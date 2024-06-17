<template>
    <div :class="['formRemoteSelect',{'invalid-input': validInput}]">
        <el-select v-model="inputVal" :multiple="isMultiple" filterable remote reserve-keyword :placeholder="placeholder" 
            :remote-method="remoteMethod" @change="change">
                <el-option v-for="item in data" :key="item.id" :label="item.name" :value="item.id">
                    <slot name="itemContent" :row="item"></slot>
                </el-option>
                <li v-if="pageIndex*pageSize<totalCount" @click="loadMore()" class="loadmore">
                    <a>{{isOnloadMore?'正在加载...':'加载更多'}}</a>
                </li>
        </el-select>
        <slot></slot>
    </div>
</template>
<style lang="scss" type="text/scss">
    .formRemoteSelect {
        width: 100%;
        display: flex;
        .el-input__inner {
            height: 32px;
            line-height: 32px;
        }
        .el-input__icon {
            height: 32px;
            line-height: 32px;
        }
        &.invalid-input {
            .el-input__inner {
                border: #ff4848 1px solid !important;
            }
        }
        .itemStateName {
            padding-left: 10px;
        }
    }
    .el-select-dropdown__item {
        width: 100% !important;
    }
    .loadmore {
        cursor: pointer !important;
        text-align: center;
        &:hover {
            a {
                color: #409EFF;
            }
        }
        a {
            line-height: 30px;
            font-size: 13px;
        }
    }
    .el-select-dropdown {
        .el-select-dropdown__item {
            height: auto !important;
            .treeBody {
                overflow-y: hidden;
            }
            .labelInfo{
                .labelOther {
                    padding-left: 15px;
                    font-size: 12px;
                    line-height: 20px;
                    max-width: 350px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }
        }
    }
</style>
<script>
    export default {
        props:["value","isMultiple","placeholder","url","disabled","options","refresh","addOptions","searchInit","analyticData","rule"],
        data() {
            return {
                searchTxt: '',
                pageIndex: 1,
                pageSize:10,
                totalCount: 0,
                data: [],
                selectLoading: false,
                isOnloadMore: false
            }
        },
        computed: {
            IsMultiple() {//是否多选下拉框
                if (this.isMultiple === undefined || this.isMultiple === false)
                    return false;
                else
                    return true;
            },
            inputVal: {
                get() {
                    return this.value;
                },
                set(val) {
                    this.$emit('input', val);
                }
            },
            validInput: {
                get() {
                    if (this.rule) {
                        return this.rule.valid === false;
                    } else {
                        return false;
                    }
                },
            },
        },
        mounted() {
            if(this.options)
                this.data = this.options;
            else
                this.remoteMethod();
            
        },
        watch:{
            refresh(show) {
                if(show){
                    this.remoteMethod();
                }
            }
        },
        methods: {
            //->获取远程数据
            getRemoteData(searchText, callback) {
                let searchData = {
                    name: searchText,
                    paginationVO: {
                        pageIndex: this.pageIndex,
                        pageSize: this.pageSize
                    }
                };
                if(this.searchInot){
                    searchData = this.searchInit({text: searchText,pageIndex: this.pageIndex,pageSize: this.pageSize});
                }
                let ajaxOption = {
                    url: this.url,
                    data: searchData
                };
                this.$ajaxPost(ajaxOption, (res) => {
                    this.selectLoading = false;
                    this.isOnloadMore = false;
                    if (res.code === 200) {
                        callback(res.data);
                    } else {
                        this.$message.error('数据获取失败');
                    }
                })
            },
            //加载远程
            remoteMethod(searchText) {
                searchText = searchText?searchText:"";
                this.pageIndex = 1;
                this.getRemoteData(searchText, (data) => {
                    data = this.analyticData ? this.analyticData(data) : data;
                    this.totalCount = data.totalElements;
                    this.totalCount = data.paginationVO.countNumber;
                    this.data = data.content;
                    this.checkAddOptions();
                })
            },
            //加载更多
            loadMore() {
                if (this.pageIndex * this.pageSize < this.totalCount) {
                    this.isOnloadMore = true;
                    this.pageIndex++
                    this.getRemoteData(this.searchTxt, (data) => {
                        data = this.analyticData ? this.analyticData(data) : data;
                        // this.data.push(...data.content);
                        this.checkAddOptions(data.content);
                    })
                }
            },
            //->检查是否有需要增加的options
            checkAddOptions(moreData) {
                if(moreData){
                    moreData.forEach((itemMore)=>{
                        let exist = false;
                        this.data.forEach((item,index)=>{
                            if(item.id === itemMore.id){
                                this.$set(this.data,index,itemMore);//->如果数据是只读类型
                                if(moreData.readOnly)
                                    this.$set(this.data[index],'show',false);
                                exist = true;
                            }
                        });
                        if(!exist){
                            this.data.push(itemMore);
                        }
                    })
                }else{
                    if(this.addOptions){
                        this.addOptions.forEach((itemAdd)=>{
                            let exist = false;
                            this.data.forEach((item)=>{
                                if(itemAdd.id === item.id)
                                    exist = true;
                            })
                            if(!exist){//->外部自定义添加的远程数据初始化默认隐藏
                                itemAdd.show = false;
                                this.data.push(itemAdd);
                            }
                        });
                    }
                };
            },
            change(val) {
                this.checkRule(val);
                let checkedData = new Array();
                if(this.isMultiple){
                    val.forEach((itemVal)=>{
                        this.data.forEach((item)=>{
                            if(itemVal===item.id)
                                checkedData.push(item);
                        })
                    })
                }else{
                    checkedData = this.data.filter((item)=>{return item.id===val})[0];
                }
                this.$emit("change",val,checkedData,this.data);
            },
            checkRule(val) {
                if (this.rule) {
                    this.$validate.validRule(this.rule, val);
                }
            }
        }
    }
</script>
