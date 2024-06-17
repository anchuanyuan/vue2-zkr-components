<template>
    <div class="common-menu-wrapper" v-if="openMenu">
        <commonTablistY height="320px" :options="menuData" @change="changeTab" v-model="selected" class="common-menu-main">
            <ul class="page-menu" slot="components">
                <li class="itemMenu" v-for="itemMenu in menuData[selected].children" :key="itemMenu.routerName" @click="changeRouter(itemMenu)">
                    <div :class='["menuIcon","iconfont",itemMenu.icon,itemMenu.color]'  :style="{'background-color': itemMenu.color}">{{itemMenu.iconText}}</div>
                    <div class="menuName" >{{itemMenu.name}}</div>
                </li>
                <li class="clearfloat"></li>
            </ul>
        </commonTablistY>
        <div class="page-bg" v-if="openMenu" @click="closeMenu"></div>
    </div>
</template>
<script>
import $ from 'jquery'
    export default {
        name: "common-menu",
        data() {
            return {
                // selected:0,
                pageIndex:0,
                prevDisabled:false,
                nextDisabled:false,
            }
        },
        computed: {
            menuData() {
                return this.$store.getters.menuData;
            },
            openMenu() {
                return this.$store.state.openMenu;
            },
            selected: {
                get() {
                    return this.$store.state.menuActiveIndex;
                },
                set(val) {
                    this.$store.commit("updateMenuActiveIndex",val);
                }
            }
        },
        watch: {
            openMenu(show) {
                this.initMenu(show);
            },
        },
        mounted() {
        },
        methods: {
            changeTab(data,index){
                this.selected=index;
            },
            closeMenu() {
                this.$store.commit("updateOpenMenu",false);
            },
            changeRouter(menu) {
                let query={};
                if(name==="DyRFAssignLead")
                    query={isAssignLead:true};
                if(menu.url == 'RetireMessage'){
                    this.$router.push({
                        name: 'RetireMessage',
                        query:{
                            type: 2,
                            title: '离退休人员信息管理'
                        }
                    });
                } else if(menu.url == 'LeaveMessage') {
                    this.$router.push({
                        name: 'LeaveMessage',
                        query:{
                            type: 3,
                            title: '调离人员信息管理'
                        }
                    });
                }  else if(menu.url == 'DeathMessage') {
                    this.$router.push({
                        name: 'DeathMessage',
                        query:{
                            type: 4,
                            title: '已去世人员信息管理'
                        }
                    });
                }  else if(menu.url == 'otherMessage') {
                    this.$router.push({
                        name: 'otherMessage',
                        query:{
                            type: 9,
                            title: '其他人员信息管理'
                        }
                    });
                } else {
					localStorage.setItem('local','00000')
                    this.$router.push({name: menu.url,query});
                }
                this.$store.commit("updateOpenMenu",false);
            },
            initMenu(show) {
                setTimeout(()=> {
                    $(".common-menu-wrapper .common-tablistY-wrapper").css({height:"320px",transition: 'height linear .3s'});
                    $(".page-menu").css({height:"315px",transition: 'height linear .3s'})
                },10)
            }
        }
    }
</script>
<style type="text/scss" lang="scss">
    .common-menu-wrapper {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 40px;
        z-index: 100;
        .common-tablistY-wrapper{
            height: 0px;
            .listY-left{
                width:200px !important;
                background-color: #EDEFF3;
                li {
                    border-right: none !important;
                    &.active {
                        background-color: #fff !important;
                        border-left: 5px solid #198FFF !important;
                    }
                }
            }
        }
        .common-menu-main {
            height: 0px;
            overflow: hidden;
            .page-menu {
                height: 0px;
                overflow-y: auto;
                // overflow: hidden;
                padding: 30px 0 0 0;
                .itemMenu {
                    width: 144px;
                    margin: 0 20px;
                    font-size: 13px;
                    cursor: pointer;
                    color: #314E5B;
                    text-align: center;
                    display: inline-block;
                    .menuIcon {
                        width: 60px;
                        height: 60px;
                        font-size: 30px;
                        color: #fff;
                        margin: 0 auto;
                        padding: 15px 0;
                        text-align: center;
                        border-radius: 20px;
                    }
                    .menuName {
                        padding: 15px 0 30px;
                    }
                }
            }
        }
        .page-bg {
            width: 100%;
            position: absolute;
            height: 100%;
            height: calc(100% - 60px);
            background: rgba(0, 0, 0, 1);
            opacity: 0.2;
            box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
        }
    }
</style>
