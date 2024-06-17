<template>
    <div>
        <commonHeader />
        <commonMenu />
        <commonLoading v-if="loading"></commonLoading>
        <router-view></router-view>
    </div>
</template>
<script>
    import commonHeader from './commonHeader.vue'
    import commonMenu from './commonMenuList.vue'
    export default {
        name: "layout",
        data() {
            return {
            }
        },
        computed: {
            loading() {
                return this.$store.state.pageLoading;
            },
            codeData() {
                return this.$store.getters.codeData
            }
        },
        components: {
            commonHeader,
            commonMenu,
        },
        created() {
            this.loadCommonCode();
            this.loadCodeVerson();
            //码表
            // if(!localStorage[this.$store.state.sysPrefix+"codeData"] || Object.keys(JSON.parse(localStorage[this.$store.state.sysPrefix+"codeData"])).length === 0) {
            //     this.loadCommonCode();
            // }else{
            //     this.loadCodeVerson();
            // }
            //菜单
            if(!localStorage[this.$store.state.sysPrefix+"userMenu"]) {
                this.$getUserMenu();
            }
            //标签类型
            if(!localStorage[this.$store.state.sysPrefix+"userTag"]) {
                this.loadTagData();
            }
            //标签类型
            if(!localStorage[this.$store.state.sysPrefix+"Tag"]) {
                this.getCadreTag();
            }
        },
        methods: {
            //获取code码表数据
            loadCommonCode(codeKey) {
                let ajaxOptions = {
                    data:{
                        ids:codeKey?codeKey:[]
                    },
                    url:this.$baseUrl + "sys/syscode/set/getSysCodeSetAndSysCodeIem"
                }
                this.$ajaxPost(ajaxOptions,true,(res)=> {
                    if(res.code === 200) {
                        let result = codeKey?this.$deepClone(this.codeData):new Object();
                        res.data.forEach((item)=> {
                            item.sysCodeItemModels = item.sysCodeItemModels.map(code=> {
                                code.isFalse = code.selectAble === 0?true:false;
                                code.disabled = code.selectAble === 0?true:false;
                                return code;
                            });
                            result[item.name] = item;
                        });
                        localStorage.setItem(this.$store.state.sysPrefix + "codeData", JSON.stringify(result));
                        this.$store.commit("updateCodeData",result);
                    }else{
                        this.$showMsg("error",res.message);
                    }
                })
            },
            //查看code码表的版本
            loadCodeVerson() {
                let ajaxOptions = {
                    data:{
                        ids:[]
                    },
                    url:this.$baseUrl + "sys/syscode/set/getSysCodeSet"
                }
                this.$ajaxPost(ajaxOptions,true,(res)=> {
                    if(res.code === 200) {
                        let codeKey = [];
                        res.data.forEach((item)=> {
                            if(!this.codeData[item.name])
                                this.codeData[item.name] = item;
                            if(item.version !== this.codeData[item.name].version) {
                                codeKey.push(item.id);
                            }
                        });
                        if(codeKey.length>0) {
                            this.loadCommonCode(codeKey);
                        }
                    }else{
                        this.$showMsg("error",res.message);
                    }
                });
            },
            //获取标签数据
            loadTagData() {
                let ajaxOptions = {
                    data: {
                        commonlyUsed: '0'
                    },
                    method: 'get',
                    url:this.$baseUrl+"sys/tag/getSysTagCategoryAndTag?",
                };
                this.$ajaxPost(ajaxOptions,true,(res)=> {
                    if(res.code === 200) {
                        this.initTagData(res.data);
                        let tagData = {
                            TAG:res.data,
                            TAG1: res.data.filter(item => item.tagModel == "CadreInfo" && item.commonlyUsed == '0'),
                            TAG2: res.data.filter(item => item.tagModel == "DepartmentInfo")
                        };
                        localStorage.setItem(this.$store.state.sysPrefix + "tagData", JSON.stringify(tagData));
                        this.$store.commit("updateTagData",tagData);
                    }else{
                        this.$showMsg("error",res.message);
                    }
                })
            },
            getCadreTag() {
                this.$ajaxPost({
                    method: "get",
                    url: this.$baseUrl + "sys/tag/getCadreTag?",
                    data: {
                        
                    }
                },true,(res) => {
                    if(res.code == 200){
                        localStorage.setItem(this.$store.state.sysPrefix + 'tag',JSON.stringify(res.data))
                    }else {
                        this.$showMsg('error',res.message)
                    }
                })
            },
            //初始化标签数据
            initTagData(data) {
                data.forEach((item)=> {
                    item.code = item.tagCategoryId?item.tagCategoryId:item.tagId;
                    item.nameCn =  item.tagCategoryName?item.tagCategoryName:item.tagName;
                    item.name = item.nameCn
                    if(item.sysTags) {
                        item.children = this.$deepClone(item.sysTags);
                        delete item.sysTags;
                        if(item.children.length>0)
                            this.initTagData(item.children);
                    }
                })
            }
        }
    }
</script>
<style scoped>
</style>
