<template>
    <div class="common-menu-list-wrapper">
        <el-collapse-transition>
            <div class="menu-container" v-show="openMenu">
                <div class="search-item">
                    <div :class="['icon','el-icon-search',isFocus?'blue':'']"></div>
                    <input v-model="keywords"
                           autofocus="autofocus"
                           placeholder="请输入关键字"
                           @input="onInput"
                           @focus="isFocus=true;searchResult=[]"
                           @blur="isFocus=false;searchResult=[]"
                           type="text">
                    <el-collapse-transition>
                        <div class="searchResult" v-if="searchResult.length">
                            <div class="searchItem" @click="changeRouter(item)" v-for="item in searchResult">{{ item.name }}</div>
                        </div>
                    </el-collapse-transition>
                </div>
                <div class="menus-item" :style="{height:viewHeight}" ref="menus">
                    <div class="item-group" v-for="(itemMenus,index) in menuGroups" :key="itemMenus.index">
                        <div class="group" v-for="group in itemMenus">
                            <div class="groupInfo">
                                <i :class="['iconfont',group.icon]"></i>
                                <span>{{ group.name }}</span>
                            </div>
                            <div class="item" @click="changeRouter(item)" v-for="item in group.children">
                                <div class="itemInfo">
                                    <i :class="['iconfont',item.icon]"></i>
                                    <span>{{ item.name }}</span>
                                    <div class="count" v-if="item.pageCount">{{item.pageCount}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </el-collapse-transition>
        <div class="page-bg" v-if="openMenu" @click="closeMenu"></div>
    </div>
</template>
<script>
    export default {
        name: "common-menu",
        data() {
            return {
                isFocus: false,
                pageIndex: 0,
                menuGroups: [[], [], [], []],
                viewHeight: '0px',
                keywords: '',
                searchResult: []
            }
        },
        computed: {
            menuData() {
                return this.$store.getters.menuData;
            },
            openMenu() {
                this.mountMenusDom()
                return this.$store.state.openMenu;
            },
            selected: {
                get() {
                    return this.$store.state.menuActiveIndex;
                },
                set(val) {
                    this.$store.commit("updateMenuActiveIndex", val);
                }
            }
        },
        mounted() {
            this.mountMenusDom()
        },
        methods: {
            onInput() {
                const keywords = this.keywords.trim()
                if (!keywords) {
                    this.searchResult = []
                    return
                }
                const allItems = []
                this.menuData.forEach(val => {
                    val.children.forEach(item => {
                        allItems.push(item)
                    })
                })
                this.searchResult = allItems.filter(val => {
                    return val.name.includes(keywords)
                })
                console.log(this.searchResult);
            },
            mountMenusDom() {
                this.viewHeight = `${document.body.offsetHeight}px`
                this.menuGroups = [[], [], [], []]
                if (!this.$refs.menus) return
                let setIndex = 0;
                const that = this
                this.menuData.forEach((val, index) => {
                    if (index < 4) {
                        if (setIndex > 3) {
                            setIndex = 0
                        }
                        this.menuGroups[setIndex].push(val)
                        setIndex++
                    } else {
                        const minlength = Math.min(...this.menuGroups.map(item => {
                            return item.reduce((curr, prev) => {
                                return curr += prev.children.length
                            }, 0)
                        }))
                        const minIndex = this.menuGroups.findIndex((item, index) => {
                            return minlength === item.reduce((curr, prev) => {
                                return curr += prev.children.length
                            }, 0)
                        })
                        this.menuGroups[minIndex].push(val)
                    }
                })
            },

            changeTab(data, index) {
                this.selected = index;
            },
            closeMenu() {
                this.$store.commit("updateOpenMenu", false);
            },
            changeRouter(menu) {
                sessionStorage.setItem('tab', JSON.stringify({url: menu.url}));//保存上次访问的菜单。
                // this.$recordMenuCount(menu)
                let query = {};
                if (name === "DyRFAssignLead")
                    query = {isAssignLead: true};
                if (menu.url.indexOf('?') > -1) {
                    localStorage.setItem('role', menu.url[menu.url.length - 1])
                    menu.url = menu.url.substring(0, menu.url.length - 2)
                }
                if (menu.url == 'RetireMessage') {
                    this.$router.push({
                        name: 'RetireMessage',
                        query: {
                            type: 2,
                            title: '离退休人员信息管理'
                        }
                    });
                } else if (menu.url == 'LeaveMessage') {
                    this.$router.push({
                        name: 'LeaveMessage',
                        query: {
                            type: 3,
                            title: '调离人员信息管理'
                        }
                    });
                } else if (menu.url == 'DeathMessage') {
                    this.$router.push({
                        name: 'DeathMessage',
                        query: {
                            type: 4,
                            title: '已去世人员信息管理'
                        }
                    });
                } else if (menu.url == 'otherMessage') {
                    this.$router.push({
                        name: 'otherMessage',
                        query: {
                            type: 9,
                            title: '其他人员信息管理'
                        }
                    });
                } else {
                    this.$router.push({
                        name: menu.url,
                        query: Object.assign(query, menu.query ? JSON.parse(this.$StringTrim(menu.query)) : {})
                    });
                }
                this.$store.commit("updateOpenMenu", false);
            },
        }
    }
</script>
<style type="text/scss" lang="scss">
    .common-menu-list-wrapper {
        .page-bg {
            width: 100vw;
            position: absolute;
            height: 100vh;
            background: rgba(0, 0, 0, 1);
            opacity: 0.2;
            box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
            top: 0;
            left: 0;
            z-index: 5;
        }

        .menu-container {
            width: calc(100vw - 45px - 15vw);
            height: 100vh;
            position: absolute;
            top: 40px;
            left: 45px;
            z-index: 100;
            background: #FFFFFF;
            box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.04);

            .search-item {
                height: 60px;
                padding: 0 30px;
                position: relative;
                z-index: 1;

                .searchResult {
                    position: absolute;
                    left: 50%;
                    transform: translate(-50%,-5px);
                    width: calc(100% - 60px);
                    max-height: 500px;
                    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
                    background-color: #fff;
                    overflow: auto;
                    .searchItem {
                        cursor: pointer;
                        padding: 10px 30px;
                        font-size: 16px;
                        line-height: 36px;
                        color: #50576c;
                        &:hover{
                            background-color: #f1f1f1;
                        }
                    }
                }

                .icon {
                    width: 28px;
                    text-align: center;
                    position: absolute;
                    left: 30px;
                    top: 50%;
                    font-size: 16px;
                    transform: translateY(-50%);
                    transition: .3s;
                }

                > input {
                    text-indent: 30px;
                    height: 60px;
                    line-height: 60px;
                    font-size: 16px;
                    width: 100%;
                    border: 0;
                    border-bottom: 1px solid #d9d9d9;
                    transition: .3s;

                    &:focus {
                        transition: .3s;
                        border-color: #198FFF;
                    }
                }
            }

            .menus-item {
                position: relative;
                padding: 30px;
                overflow: auto;
                width: 100%;
                height: calc(100% - 60px);
                display: flex;

                .item-group {
                    flex: 1;

                    .group {
                        .groupInfo {
                            //cursor: pointer;
                            color: #50576c;
                            display: flex;
                            align-items: center;
                            margin-bottom: 30px;

                            > span {
                                font-size: 16px;
                                color: #50576c;
                                line-height: 16px;
                            }

                            .iconfont {
                                font-size: 18px;
                                margin-right: 15px;
                                color: #50576c;
                            }
                        }

                        .item {
                            margin-bottom: 20px;

                            &:last-child {
                                margin-bottom: 45px;
                            }

                            .itemInfo {
                                cursor: pointer;
                                display: flex;
                                align-items: center;
                                transition: .1s;
                                color: #909bbc;
                                .count {
                                    margin-left: 10px;
                                    min-width: 16px;
                                    height: 16px;
                                    padding: 1px 5px;
                                    background: #FF5050;
                                    border-radius: 16px;
                                    color: #fff;
                                    font-size: 14px;
                                    line-height: 16px;
                                    text-align: center;

                                }
                                &:hover {
                                    transition: .1s;
                                    color: #198FFF !important;
                                }

                                > span {
                                    font-size: 14px;
                                    //color: #909bbc;
                                    line-height: 14px;
                                }

                                .iconfont {
                                    //color: #909bbc;
                                    font-size: 16px;
                                    margin-right: 15px;
                                }
                            }
                        }
                    }
                }
            }

        }
    }
</style>
