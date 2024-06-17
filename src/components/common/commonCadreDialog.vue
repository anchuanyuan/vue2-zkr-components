<template>
    <commonDialog :visible.sync='showVisible' title="选择干部" height='600px' class="common-cadre-dialog" width='850px'
        :save='onSave' @open="onOpen">
        <el-tabs type="border-card">
            <el-tab-pane>
                <span slot="label" class="el-icon-money">组织架构</span>
                <commonBody style="height: 580px; margin-bottom: -1px;">
                    <departTree slot="left" showTreeTop filter :showTreeBottom='false' autoHeight @nodeClick="nodeClick"
                        lazy :props="treeProps" :search="searchTree"  v-model="currentDepId"/>
                    <div slot="right" >
                        <el-input
                            class="cadre-search-input"
                            size="small"
                            placeholder="输入干部姓名查找"
                            @keyup.enter.native="search"
                            clearable
                            @clear="search"
                            v-model="searchStr">
                            <i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
                        </el-input>
                        <div class="container-member" v-if="loading&&cadreList.length>0">
                            <div>
                                <div class="member-item pointer"
                                    v-for="(member,index) in cadreList"
                                    :key="index"
                                    :class="member.checked?'selected':''"
                                    @click="e=>clickMember(member,e)">
                                    <div class="avatar-div">
                                        <img :src="getImage(member.EMP_ID)" @error="setDefaultImg"/>
                                    </div>
                                    <div class="member-info">
                                        <div class="first-row">
                                            <span>{{member.a01001}}</span>
                                            <span v-if="member.a01004value">|</span>
                                            <span>{{member.a01004value}}</span>
                                            <span v-if="member.a01007">|</span>
                                            <span>{{member.a01007}}</span>
                                        </div>
                                        <div class="second-row">现任职务：{{member.a01111}}；</div>
                                    </div>
                                    <div class="check-box">
                                        <el-checkbox v-model="member.checked"></el-checkbox>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <commonPagination :page.sync='searchData.pageIndex' :size.sync='searchData.pageSize'
                            :total='total' :pagerCount ='5' layout='prev, pager, next, jumper'
                            v-if="loading&&cadreList.length>0"/>
                        <commonEmpty v-if="loading&&cadreList.length==0" style="height: 400px"/>
                    </div>
                </commonBody>
            </el-tab-pane>
        </el-tabs>
    </commonDialog>
</template>
<script>
export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        multiple: {
            type: Boolean,
            default: false
        },
        defaultChecked: {
            type: Array,
            default: _ => []
        },
         deptId: String,
    },
    watch: {
        searchData: {
            deep: true,
            handler() {
                this.getData()
            }
        },
        showVisible(val) {
            if(val) {
                this.cadreList.forEach(item => item.checked = false)
                this.result = {}
                if(this.multiple)
                    this.checkedList = this.defaultChecked
            } 
        },
    },
    computed: {
        showVisible: {
            get(val) {
                return this.visible;
            },
            set(val) {
                this.$emit("update:visible", val);
            }
        },
    },
    data() {
        return {
            searchStr: '', 
            imgurl: require("../../../static/img/defaultAvatar.jpg"),
            treeProps: {
                value: "id",
                label: "name",
                children: "subTreeNode",
                isLeaf: "leaf",
            },
            searchTree: {deptId: null},
            loading: false,
            searchData: {
                deptId: null,
                name: "",
                pageSize: 10,
                pageIndex: 1,
                includeSubNode: "1",
            },
            cadreList: new Array(),
            checkedList: [],
            total: 0,
            result: new Object,
            changing: false,
            currentDepId:''
        }
    },
    methods: {
        onOpen() {
           this.currentDepId = this.deptId;
       },
        search() {
            this.searchData.name = this.searchStr
        },
        currentChange () {
            this.getData()
        },
        /* 设置默认头像 */
        setDefaultImg (e) {
            e.target.src = this.imgurl;
        },
        getData() {
            this.$ajaxPost({
                url: this.$baseUrl + "cadre/list",
                data: this.searchData
            },true,(res) => {
                if(res.code == 200){
                    let arr = new Array()
                    res.data.cadres.forEach(item => {
                        let obj = new Object()
                        item.fields.forEach(item => {
                            obj[item.fieldNameEn] = item.fieldValue
                        })
                        this.$set(obj,'checked',Boolean(this.checkedList.find(item => item.EMP_ID == obj.EMP_ID)))
                        arr.push(obj)
                    })
                    this.cadreList = arr
                    this.loading =  true
                    this.total = res.data.dataCount
                }else {
                    this.$showMsg('error',res.message)
                }
            })
        },
        nodeClick(data) {
            this.searchData.deptId = data
        },
        changeContain() {

        },
        containChange() {

        },
        clickMember(data,e) {
            let checked = data.checked
            setTimeout(_ => {
                if(e.srcElement.className == 'el-checkbox__original') {
                    return 
                }
                if(this.multiple) {
                    this.$set(data,'checked',!checked)
                    let arr = this.cadreList.map(item => item.EMP_ID)
                    this.checkedList = this.checkedList.filter(item => !arr.includes(item.EMP_ID))
                    this.checkedList.push(...this.cadreList.filter(item => item.checked))
                }else {
                    this.cadreList.forEach(item => this.$set(item,'checked',false))
                    this.$set(data,'checked',true)
                    this.result = data
                }
            },50)
        },
        getImage (cadreInfoId) {
            return this.$baseUrl + 'cadre/photo?empId=' + cadreInfoId
        },
        onSave() {
            if(this.multiple) {
                this.$emit('save',this.checkedList.map(item => item.EMP_ID),this.checkedList)
            }else {
                this.$emit('save',this.result.EMP_ID,this.result)
            }
            
            this.$emit('update:visible',false)
        }
    }
}
</script>
<style lang='scss' scoped>
.common-cadre-dialog {
    .el-tabs__content {
        padding: 0;
    }
    .el-dialog__body {
        padding-top: 0;
    }
    .container-member {
        >div:first-child {
            overflow: auto;
            height: 460px;
            margin-bottom: 10px;
        }
        .member-item {
            display: flex;
            align-items: center;
            box-sizing: border-box;
            border: 1px solid rgba(204, 204, 204, 0.3);
            margin: 8px;
            padding: 8px;
            &:first-child {
                margin-top: 0px;
            }
            .avatar-div {
                line-height: 0;
                margin-right: 16px;
                img {
                    width: 40px;
                    height: 50px;
                    object-fit: contain;
                }
            }
            .member-info {
                margin-right: 10px;
                .first-row {
                    margin-bottom: 8px;
                    span:nth-child(2n) {
                        padding: 0 12px;
                    }
                }
            }
            .check-box {
                flex: 1 1 auto;
                text-align: right;
            }
        }
        .selected {
            background-color: rgba(25, 143, 255, 0.1);
        }
        .empty {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
    .header-input input {
        border-radius: 50px;
        background: #f8f8f8;
        margin: 10px 8px 10px 8px;
    }
    .cadre-search-input {
        margin: 10px 8px 5px 8px;
        width: calc(100% - 16px);
        .el-input__inner {
            border-radius: 16px;
        }
    }
}  
</style>