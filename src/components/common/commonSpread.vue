<template>
    <div :class="['common-spread-wrapper']">
        <slot></slot>
        <el-button v-if="!openConfig && showConfig" class="config"  type="primary" @click="openConfig=!openConfig">工具栏</el-button>
        <div class="common-spread-content">
            <commonContainer :height="height" :offset="5" :class="['spread-table',{'hidden':hidden},{'border':this.sheetData},{'openConfig':openConfig}]">
                <input v-show="false" ref="file" type="file" @change="changeFile">
                <div :id="id" ref="excelView" class="spread-content"></div>
            </commonContainer>
            <config ref="config" :visible.sync="openConfig" :spread="spread" @runSpread="runSpread"></config>
        </div>
        <commonDialog appendBody ref="exportDialog" :visible.sync="exportVisible" title="导出" :save="saveExportForm">
            <commonForm>
                <formRow label="文件名">
                    <formInput v-model="form.fileName" placeholder="请输入名称"></formInput>
                </formRow>
                <formRow label="加密" v-if="isFile">
                    <formInput v-model="form.passWord" placeholder="请输入名称"></formInput>
                </formRow>
            </commonForm>
        </commonDialog>
        <commonDialog appendBody ref="importDialog" :visible.sync="importVisible" title="导入" :save="saveImportForm">
            <commonForm>
                <formRow label="请选择文件">
                    <form id="importForm" ref="importForm" :action="docUrl" method="post">
                        <input ref="importFile" type="file">
                    </form>
                </formRow>
                <formRow label="文件类型">
                    <div>{{type}}</div>
                </formRow>
            </commonForm>
        </commonDialog>
    </div> 
</template>
<script>
    import config from './commonSpreadConfig/index.vue'
    import $ from 'jquery'
    export default {
        name: "spread",
        components:{
            config
        },
        props:{
            height:String,
            options:[String,Array,Object],
            search:Object,//查询条件
            url:String,//请求数据url
            updateUrl:String,//更新url
            createUrl:String,//新增url
            docUrl:String,//doc文件类型url
            type:String,//文件类型//->xls,xlsx/doc,docx
            model:Object,
            hidden:{//隐藏
                type:Boolean,
                default:false
            },
            showConfig:{   //是否显示工具栏
                type:Boolean,
                default:true
            }
        },
        data() {
            let id = "spread_" + (this.$moment().format("x") + parseInt(Math.random() * (100000000 + 1)));
            return {
                id:id,
                spread:{},
                excelIo:{},
                openConfig:false,
                listIndex: 0,
                ExportList: [],
                form:{
                    file:null,
                    fileName:null,
                    passWord:null
                },
                isJson:false,
                isFile:false,
                exportVisible:false,
                importVisible:false,
                loadSuccess:false,//成功或失败
                sheetData:null,
                useType:["xls","xlsx"],
                colors:['#f47920','#f8aba6','#b2d235','#afb4db','#dea32c','#f2eada'],
            }
        },
        mounted() {
            setTimeout(()=> {
                this.excelIo = new GC.Spread.Excel.IO();
                this.spread = new GC.Spread.Sheets.Workbook(document.getElementById(this.id));
                let style = new GC.Spread.Sheets.Style();
                style.wordWrap = 'true';
                let sheet = this.spread.getSheet(0);
                
                let selectionChanged = GC.Spread.Sheets.Events.SelectionChanged;//->单元格事件
                this.spread.bind(selectionChanged, this.changeSpread);
                if(this.options) {
                    this.initData();
                    return;
                };
                if(this.getUrl)
                    this.loadData();
            },50)
        },
        computed:{
            getUrl() {
                if(this.url)
                    return this.url;
                return this.$baseUrl + "sheet/designCarrier/getContentByDesignId?";
            },
            addUrl() {
                if(this.createUrl)
                    return this.createUrl;
                return this.$baseUrl + "sheet/designCarrier/create?";
            },
            changeUrl() {
                if(this.updateUrl)
                    return this.updateUrl;
                return this.$baseUrl + "sheet/designCarrier/update?";
            },
            docxUrl() {
                return this.$baseUrl + "sheet/design/wordUpload"
            }
        },
        watch:{
            search:{
                handler() {
                    this.loadData();
                },deep:true
            },
            options:{
                handler() {
                    this.initData();
                },deep:true
            },
        },
        methods: {
            changeSpread() {
                this.$refs.config.changeSpread();
            },
            runSpread(val) {
                updateStringProperty(this.spread,"sheetName",val);
            },
            //加载数据
            loadData() {
                // return
                let loaded = true;
                for(let key in this.search) {
                    if(this.search[key] === null)
                        loaded = false;
                }   
                if(!loaded)//->未加载完成
                    return;
                let ajaxOptions = {
                    data:this.search,
                    url:this.getUrl
                };
                this.$ajaxPost(ajaxOptions,true,(res)=> {
                    if(res.code === 200) {
                        this.loadSuccess = true;
                        this.sheetData = JSON.parse(res.data);
                        this.initData(this.sheetData);
                    }else{
                        this.loadSuccess = false;
                        this.sheetData = null;
                    }
                    this.$emit("loadSuccess",res.data);
                })
            },
            //初始化数据
            initData(data) {
                if(!data)
                    data = this.options;
                if(!data)
                    return;
                this.spread.suspendPaint();
                this.spread.fromJSON(JSON.parse(data.content));
                this.spread.resumePaint();
                this.$emit("initSuccess");
                this.$emit("initAnnotate");
            },
            //获取当前excl页
            getSheet() {
                return this.spread.getActiveSheet();
            },
            //获取当前页的sels
            getSels() {
                let sheet = this.spread.getActiveSheet();
                return sheet.getSelections();
            },
            //导入模板
            importModel() {
                this.importVisible = true;
            },
            //导入文件
            importFile() {
                this.$refs.file.click();
            },
            //导入json
            importJSON() {
                this.$refs.file.click();
            },
            //选中文件后
            changeFile(val) {
                let excelFile = this.$refs.file.files[0];
                let passWord = "";//123
                this.excelIo.open(excelFile,(json)=> {
                    this.spread.fromJSON(json);
                }, function (e) {
                }, {password: passWord});
            },
            //导出文件
            exportFile(name) {
                for(let key in this.form)
                    this.form[key] = null;
                this.form.fileName = name ? name : null
                this.isFile = true;
                this.isJson = false;
                this.exportVisible = true;
            },
            //导出json
            exportJSON() {
                for(let key in this.form)
                    this.form[key] = null;
                this.isFile = false;
                this.isJson = true;
                this.exportVisible = true;
            },
            //确定导出
            saveExportForm() {
                let json = this.spread.toJSON({includeBindingSource: true});
                let fileName = this.form.fileName?this.form.fileName:"新建";
                let passWord = this.form.passWord?this.form.passWord:"";
                if(this.save) {
                    this.save(this.form);
                    return;
                }
                if(this.isJson) {
                    exportToJSON(this.spread,fileName);
                    this.exportVisible = false;
                    return;
                }
                if (fileName.substr(-5, 5) !== '.xlsx')
                    fileName += '.xlsx';
                this.excelIo.save(json, (blob)=> {
                    saveAs(blob, fileName);
                    this.exportVisible = false;
                }, function (e) {
                }, {password: passWord});
            },
            //确定导入
            saveImportForm() {
                let fileName = this.$refs.importFile.value;
                let fileType = fileName.split(".");
                fileType = fileType[fileType.length-1];
                if(!this.type.includes(fileType)) {
                    this.$showMsg("error",`必须选择${this.type}的类型文件`);
                    this.$refs.importDialog.disabled = false;
                    return;
                };
                if(!this.useType.includes(fileType)) {//->doc类型
                    this.importForm();
                    return;
                }
                let excelFile = this.$refs.importFile.files[0];
                this.excelIo.open(excelFile,(json)=> {
                   this.saveModel(json);
                }, function (e) {}, {password: ''});
            },
            //doc,docx导入
            importForm() {
                return
                let form = document.getElementById('importForm') ;//this.$refs.importForm;
                let formData = new FormData(form);
                let query = this.$deepClone(this.model);
                $.ajax({
                    url:this.docxUrl,
                    type:"post",
                    data:formData,
                    processData:false, 
                    contentType:false, 
                    success:function(res){ 
                    },
                })
            },
            //单元格设置
            setCell(data) {
                let sheet = this.spread.getActiveSheet();
                data.forEach((item,index)=> {
                    if(item.bindType!=="")
                        sheet.getCell(item.ctrlRowNo,item.ctrlColumnNo).backColor(this.colors[parseInt(item.bindType)]);
                    else
                        sheet.getCell(item.ctrlRowNo,item.ctrlColumnNo).backColor('#FFFFFF');
                })
            },
            //模板保存
            saveModel(json) {
                if(!json)
                    json = this.spread.toJSON();
                let query = this.$deepClone(this.model);
                query.content=JSON.stringify(json);
                query.id = this.sheetData?this.sheetData.id:"";
                let ajaxOptions = {
                    data:query,
                    url:this.loadSuccess?this.changeUrl:this.addUrl
                };
                this.$ajaxPost(ajaxOptions,true,(res)=> {
                    if(res.code === 200) {
                        this.$showMsg("success","保存成功");
                        this.importVisible = false;
                    }else{
                        this.$showMsg("error",res.message);
                    }
                })
            },
            // 批量导出
            saveExportList(list) {
                this.ExportList = list
                this.listIndex = 0
                this.ExportLoadData()
            },
            //获取模板（批量）
            ExportLoadData() {
                let len = this.ExportList.length
                if(len == this.listIndex){
                    return
                }
                if(this.ExportList[this.listIndex].type == '0' || this.ExportList[this.listIndex].type == '1') {
                    let ajaxOptions = {
                        data: {
                            designId: this.ExportList[this.listIndex].designId
                        },
                        url:this.getUrl
                    };
                    this.$ajaxPost(ajaxOptions,true,(res)=> {
                        if(res.code === 200) {
                            this.loadSuccess = true;
                            this.sheetData = JSON.parse(res.data);
                            this.initListData(this.sheetData);
                        }else{
                            this.loadSuccess = false;
                            this.sheetData = null;
                            this.listIndex++
                            this.ExportLoadData()
                        }
                        this.$emit("loadSuccess",res.data);
                    })
                } else if(this.ExportList[this.listIndex].type == '2' || this.ExportList[this.listIndex].type == '3'){
                    let ajaxOptions = {
                        data:{
                            designId: this.ExportList[this.listIndex].id
                        }, 
                        url:this.$baseUrl + "sheet/design/wordDownload"
                    };
                    this.$exportFile(ajaxOptions);
                    this.listIndex++
                    this.ExportLoadData()
                }
            },
            //初始化数据(批量)
            initListData(data) {
                if(!data)
                    data = this.options;
                if(!data)
                    return;
                this.spread.suspendPaint();
                this.spread.fromJSON(JSON.parse(data.content));
                this.spread.resumePaint();
                // this.$emit("initListSuccess");
                this.initListSuccess()
            },
            //获取数据区数据（批量）
            initListSuccess() {
                let ajaxOptions = {
                    data: {
                        sheetId: this.ExportList[this.listIndex].id
                    },
                    url: this.$baseUrl+'sheet/sheetData/getBySheetId?',
                    method: 'get'
                }
                this.$ajaxPost(ajaxOptions,true,(res)=> {
                    if(res.code === 200) {
                        if(res.data.length > 0) {
                            let sheet = this.getSheet()
                            let spread = this.spread
                            spread.suspendPaint();
                            let json = spread.toJSON();
                            let dataTable = json.sheets[sheet.Cj].data.dataTable;
                            let dataArr = res.data
                            dataArr.forEach((item) => {
                                if(item.ctrlRowNo!=undefined&&item.ctrlColumnNo!=undefined){
                                    let currentVal=dataTable[item.ctrlRowNo+""][item.ctrlColumnNo+""]["value"]==undefined?'':dataTable[item.ctrlRowNo+""][item.ctrlColumnNo+""]["value"].toString();
                                    if(currentVal!=undefined&&(currentVal.indexOf('-')==-1
                                            &&currentVal.indexOf('—')==-1)){
                                        let val=item.stringValue;
                                        let isNum=this.isNumber(item.stringValue);
                                        if(isNum){
                                            if(item.stringValue.indexOf('.')==-1){
                                                val=parseInt(item.stringValue);
                                            }else{
                                                val=parseFloat(item.stringValue);
                                            }
                                        }
                                        dataTable[item.ctrlRowNo+""][item.ctrlColumnNo+""]["value"]=val;
                                    }
                                }
                            })
                            spread.fromJSON(json);
                            spread.resumePaint();
                            let name = this.ExportList[this.listIndex].name
                            let pass = this.ExportList[this.listIndex].pass
                            this.exportListData(name,pass)
                            this.listIndex++
                            this.ExportLoadData()
                        } else {
                            let name = this.ExportList[this.listIndex].name
                            let pass = this.ExportList[this.listIndex].pass
                            this.exportListData(name,pass)
                            this.listIndex++
                            this.ExportLoadData()
                        }
                    }else{
                        this.$showMsg("error",res.message)
                        this.listIndex++
                        this.ExportLoadData()
                    }
                })
            },
            //确定导出(批量)
            exportListData(name,pass) {
                let json = this.spread.toJSON({includeBindingSource: true});
                let fileName = name?name:"新建";
                let passWord = pass?pass:"";
                if(this.save) {
                    this.save(this.form);
                    return;
                }
                if(this.isJson) {
                    exportToJSON(this.spread,fileName);
                    this.exportVisible = false;
                    return;
                }
                if (fileName.substr(-5, 5) !== '.xlsx')
                    fileName += '.xlsx';
                this.excelIo.save(json, (blob)=> {
                    saveAs(blob, fileName);
                    this.exportVisible = false;
                }, function (e) {
                }, {password: passWord});
            },
            isNumber(val) {
                if(val === "" || val ==null){
                    return false;
                }
                if(!isNaN(val)){
                    return true;
                }else{
                    return false;
                }
            },
        }
    }
</script>
<style type="text/scss" lang="scss">
    .common-spread-wrapper {
        position: relative;
        .config {
            position: absolute;
            right:0;
            top: 0;
        }
        .common-spread-content {
            display: flex;
            .spread-table {
                width:100%;
                height:100%;
                transition: width 0.5s;
                &.border {
                    border-top: 1px solid #ddd;
                    border-left: 1px solid #ddd;
                }
                .spread-content {
                    height: calc(100% - 4px);
                    width: calc(100% - 4px);
                }
                &.openConfig {
                    width: calc(100% - 244px);
                    overflow: hidden;
                }
                &.hidden{
                    width: 0px !important;
                    height: 0px !important;
                }
            }
        }
    }
    .common-dialog-wrapper {
        .common-spread-wrapper {
            height:100%;
            width:100%;
            .common-spread-content{
                height:100% !important;
                width:100%;
            }
        }
    }
</style>
  