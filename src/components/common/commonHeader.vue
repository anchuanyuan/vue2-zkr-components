<template>
    <div class="common-header-wrapper">
        <div class="common-header">
            <div class="left-wrapper">
                <span :class='["logoIcon iconfont",showBgIcon,appInfo.appIcon]'></span>
                <span class="header-logo-title">{{appInfo.appName}}</span>
            </div>
            <div class="right-wrapper">
                <div class="common-header-menu">
                    <span v-for="(item , index) in headMenuList" :key="index"
                          :class='["iconBtn",{"active":index===headMenuIndex}]' @click="runClick(item.eName,index)">
                        <i :class="item.icon"></i>
                        <span class="iconTitle">{{item.text}}</span>
                    </span>
                    <span v-if="secretLevelWarning" style="margin-left: 24px;" class="red">{{secretLevelWarning}}</span>
                </div>
                <div class="common-header-user">
                    <formDropDown class="userDrop" trigger="click" type="text"
                                  :title="nickName" @click="dropClick">
                        <img slot="left" class="userImg" src="../../assets/images/common/user.png"/>
                        <span slot="left" class="level" v-if="userInfo.visible === '1'" :style="{backgroundColor:userInfo.levelColor}">{{userInfo.levelName}}</span>
                        <el-dropdown-item slot="dropdown"
                                          v-for="(item,index) in dropData"
                                          :class='{"last":dropData.length-1===index}'
                                          :key="index" :command="item.event"
                        >
                            <span :class="item.icon"></span>
                            {{item.text}}
                        </el-dropdown-item>
                    </formDropDown>
                </div>
				<span style="cursor: pointer;color: #fff;font-size: 14px" @click="helpClick">下载单机版采集程序</span>
                <!-- <formDropDown type="primary" :options="helpList" @click="helpClick">
                	<span slot="link" style="cursor: pointer;color: #fff">帮助<i class="el-icon-question"
                                                                     style="margin-left: 4px"></i></span>
                </formDropDown> -->
            </div>
        </div>
        <commonDialog title="修改密码" height="200px" width="750px"
                      :visible.sync="formControl.visible"
                      :show-close="!forceChangePwd"
                      :form="form" :rules="rules"
                      :save="save"
        >
            <commonForm msgWidth="200px">
                <formRow label="用户名" required :rule="rules.userName">
                    <formInput v-model="form.userName" placeholder="请输入用户名" :rule="rules.userName" disabled></formInput>
                </formRow>
                <formRow label="原密码" required :rule="rules.oldPassword">
                    <formInput v-model="form.oldPassword" placeholder="请输入原密码" :rule="rules.oldPassword"
                               type="password"></formInput>
                </formRow>
                <formRow label="新密码" required :rule="rules.newPassword">
                    <formInput v-model="form.newPassword" placeholder="请输入新密码" :rule="rules.newPassword"
                               type="password"></formInput>
                </formRow>
                <formRow label="确认新密码" required :rule="rules.confirm">
                    <formInput v-model="form.confirm" placeholder="请再次输入新密码" :rule="rules.confirm"
                               type="password"></formInput>
                </formRow>
            </commonForm>
        </commonDialog>
        <commonDialog title="登录" :form="loginForm" :visible.sync="formControl.loginVisible" :rules="loginRules"
                      :url="loginUrl" :showClose="false" :afterSave="afterSave" width="450px" height="200px">
            <commonForm class="pageBoxItem" :labelWidth="'80px'">
                <div class="red" style="text-align: center;margin-bottom: 16px;width: 100%">
                    由于长时间未在线使用，为了确保使用操作安全，请重新登录
                </div>
                <formRow label="用户名" required :rule="loginRules.userName">
                    <formInput v-model="loginForm.userName" placeholder="请输入用户名"
                               :rule="loginRules.userName"></formInput>
                </formRow>
                <formRow label="密码" required :rule="loginRules.passWord">
                    <formInput v-model="loginForm.passWord" placeholder="请输入密码" :rule="loginRules.passWord"
                               type="password"></formInput>
                </formRow>
            </commonForm>
        </commonDialog>
    </div>
</template>
<script>
	import commonMenu from './commonMenu.vue'
	import store from "../../assets/store";

	export default {
		name: 'commonHeader',
		components: {
			commonMenu,
		},
		data() {
			return {
				loginForm: {
					userName: '',
					passWord: '',
					systemType: '2'
				},
				form: {
					newPassword: '',
					oldPassword: '',
					confirm: '',
					id: '',
				},
				rules: {
					newPassword:  {passWord_rz: true},
					oldPassword: { required: true},
                    confirm: {passWord_rz: true},
				},
				loginRules: {
					userName: {required: true},
					passWord: {required: true},
				},
				formControl: {
					visible: false,
					loginVisible: false,
				},
				dropData: [

					{icon: "el-icon-refresh", text: "清除缓存", event: "refreshLocal"},
					{icon: "icon iconfont icon-shezhi", text: "修改密码", event: "edit"},
					{icon: "icon iconfont icon-homeclose", text: "退出账号", event: "logOut"},
				],
				helpList: [
					{name: "下载单机版采集程序", data: "zip"},
					{name: "下载网络版采集程序", data: "zip2"},
					{name: "干部管理操作手册", data: 'emp'},
					{name: "单位管理操作手册", data: 'dep'},
				],
                appInfo:{
	                appIcon:'',
	                appName:'',
                },
				sendOnlineTime:0.12,
				secretLevelWarning:'',
				loginUrl: this.$baseUrl + 'user/user/login',
                forceChangePwd: false
			}
		},
		computed: {
			showBgIcon() {
				if (this.$dataFields.showAppInfo) {
					return 'bgIcon'
				} else {
					return ''
				}
			},
			loginStatus() {
				return this.$store.state.loginStatus
			},
			headMenuIndex() {
				return this.$store.state.headerMenuIndex;
			},
			headMenuList() {
				return [
					{eName: "toggleMenu", text: "菜单", icon: "iconfont icon-mulu"},
					{eName: "goHome", text: "首页", icon: "iconfont icon-zhuye"}
				];
			},
			userInfo() {
				return this.$store.getters.userInfo;
			},
			nickName() {
				return localStorage[this.$store.state.sysPrefix + "userName"];
			}
		},
		watch: {
			loginStatus() {
				this.formControl.loginVisible = true;
			}
		},
		mounted() {
			window.addEventListener('storage',(event)=>{
				if (event.key === 'userInfo'){
					sessionStorage.setItem(this.$store.state.sysPrefix + 'userInfo', localStorage.userInfo);
					window.location.reload();
				}
			},false);
			this.secretLevelWarning = sessionStorage.secretLevelWarning;
			this.changeRules();
			this.questOnlineNumber();
			this.setLevel();
			this.appInfo.appIcon = sessionStorage.appIcon;
			this.appInfo.appName = sessionStorage.appName;
			if (sessionStorage.portalTime === '1') {
				this.dropData = [
					{icon: "el-icon-refresh", text: "清除缓存", event: "refreshLocal"},
					{icon: "icon iconfont icon-homeclose", text: "退出账号", event: "logOut"},
				]
			}

            const weakPassword = JSON.parse(localStorage.getItem('weakPassword'));
            if(weakPassword === '1'){
                console.log('weakPasswordweakPasswordweakPassword')
                this.$alert("检测到此账号为若口令登录，请修改密码后重新登陆！", '提示',{
                    showClose: false
                }).then(() => {
                    this.forceChangePwd = true
                    // 修改密码
                    this.edit()
                });
            }
		},
		methods: {
			//推送在线状态
			postOnLine() {
				let ajaxOption = {
					url: this.$baseUrl + "gatewayCenter/updateHeartbeatTime",
				}
				localStorage.onlineNumber = new Date().getTime();
				this.$ajaxPost(ajaxOption, false, res => {

				})
			},
			questOnlineNumber() {
				this.postOnLine() //默认请求一次，立即更新localStorage
				let timer = setInterval(()=>{//定时检测localStorage的状态
					if(localStorage.onlineNumber) {
						let data1 = localStorage.onlineNumber;
						let data2 = new Date().getTime();
						if((data2-data1)>sessionStorage.webFixed) { //时间间隔大于 分钟才触发请求
							this.postOnLine()
						}
					}
					if(!sessionStorage[this.$store.state.sysPrefix + 'isLogin']) {
						clearInterval(timer)
					}
				},sessionStorage.webFixed*0.2) //定时器检测频率要远小于时间间隔，才能更准确
			},
			changeRules() {
				if (this.$dataFields.showPassRules) {
					this.rules.newPassword.passWord = true
				} else {
					this.rules.newPassword.passWord = false
				}
			},
			//page栏事件点击
			runClick(clickEvent, index) {
				this.$store.commit("updateHeaderMenuIndex", index);
				this[clickEvent]();
			},
			//菜单图标
			shrinkMenu() {
				this.$store.commit('toggleShrinkMenu');
			},
			//打开关闭菜单
			toggleMenu() {
				this.$store.commit("toggleOpenMenu");
			},
			//返回主页
			goHome() {
				this.$store.commit("updateOpenMenu", false);
				if (sessionStorage[this.$store.state.sysPrefix + 'useHome'])
					this.$router.push({name: sessionStorage[this.$store.state.sysPrefix + 'useHome']});
				else
					this.$router.push({name: 'Home'})
			},
			//头部菜单点击
			dropClick(e) {
				this[e]();
			},
			//登出
			logOut() {
				this.$showConfirm('确定退出当前账户？', () => {
					this.logOutFn()
				})
			},
            logOutFn() {
                let ajaxOptions = {
                    url: this.$baseUrl + "user/user/loginOut"
                };
                this.$ajaxPost(ajaxOptions, true, (res) => {
                    this.$message.warning('请重新登陆系统！');
                    localStorage.removeItem('weakPassword')
                    if (localStorage[this.$store.state.sysPrefix + "isContactInfo"] !== undefined)
                        localStorage.removeItem(this.$store.state.sysPrefix + 'isContactInfo');
                    if (localStorage[this.$store.state.sysPrefix + "userMenu"] !== undefined)
                        localStorage.removeItem(this.$store.state.sysPrefix + 'userMenu');
                    if (window.timer)//->清除全局定时器
                        window.clearInterval(timer);
                    if (this.$dataFields.loginOutBlack === "1") {
                        if (sessionStorage.portalTime === '2') {
                            sessionStorage.clear();
                            this.$router.push({name: "AccessLogin"});
                        } else {
                            window.location.href = sessionStorage.loginUrl;
                            sessionStorage.clear();
                        }
                    } else {
                        sessionStorage.clear();
                        window.close()
                        location.href = 'about:blank'
                    }
                });
            },
			//清除本地缓存
			refreshLocal() {
				this.$store.state.refreshLocal.forEach((item) => {
					let refreshKey = this.$store.state.sysPrefix + item;
					if (localStorage[refreshKey] !== undefined)
						localStorage.removeItem(refreshKey);
				});
        this.$ajaxPost({
          url: this.$baseUrl + 'cadreteam/removeRedisCacheNew',
          data: {}
        }, true, res => {
          if (res.code == 200) {
            this.$router.go(0)
          }
        })
			},
			/* 修改密码*/
			edit() {
				for (let key in this.form) {
					this.form[key] = '';
				}
				this.form.id = this.userInfo.id;
				this.form.userName = this.userInfo.loginName;
				this.formControl.visible = true;
			},
			getMenuData() {
				this.$getUserMenu(() => {
					window.location.reload()
				});
			},
			afterSave(res) {
				this.formControl.loginVisible = false;
				let userName = localStorage.getItem('cadre_userName');
				if (userName === res.data.loginName) { //相同账号
					window.location.reload()
				} else {
					sessionStorage.setItem(this.$store.state.sysPrefix + 'isLogin', true);//->登录状态
					sessionStorage.setItem(this.$store.state.sysPrefix + 'sysName', res.data.sysName);//->系统标记
					localStorage.userInfo = JSON.stringify(res.data);
					this.$store.commit("updateUserInfo", res.data);
					this.$store.commit("updateSystype", res.data.sysName);
					localStorage.setItem(this.$store.state.sysPrefix + 'userName', this.loginForm.userName);
					//->1.普通首页->home，2.仅菜单首页->onlyHome，3.带统计项首页->totalHome
					let pageType = res.data.roleViewModelList.map(item => item.pageType);
					if (pageType.length > 1) {
						if (~pageType.indexOf("3"))
							pageType = "3";
						else if (~pageType.indexOf("2"))
							pageType = "2";
						else
							pageType = "1";
					} else {
						pageType = pageType[0];
					};
					let result = res.data.roleViewModelList.filter((item) => {
						return item.pageType === pageType
					});
					let homeDetailUrl = "";
					if (result.length > 0) {
						homeDetailUrl = result[0].detailUrl;
					}
					sessionStorage.setItem(this.$store.state.sysPrefix + 'homeDetailUrl', homeDetailUrl);
					sessionStorage.setItem(
						this.$store.state.sysPrefix + 'useHome',
						{"1": "Home", "2": "OnlyHome", "3": "TotalHome"}[pageType]
					);
					this.getMenuData()
				}
			},
			save() {
				if (this.form.newPassword !== this.form.confirm) {
					this.$showMsg('error', '两次输入的新密码不一致！')
					return
				}
				let ajaxOption = {
					url: this.$baseUrl + "user/user/modifyUserPassword",
					data: this.form
				};
				this.$ajaxPost(ajaxOption, true, (res) => {
					if (res.code === 200) {
						this.$showMsg('success', '保存成功');
						this.formControl.visible = false;
                        // 登出
                        this.logOutFn()
					} else {
						this.$showMsg('error', res.message);
						// this.formControl.visible = false;
					}
				})
			},
			// 帮助
			helpClick() {
				window.open(encodeURI(this.$baseUrl + `export/help/bj/previewHelp?type=zip`));
				// window.open(encodeURI(this.$baseUrl + `export/help/bj/previewHelp?type=${item.data}`));
			},
			/* 获取密级列表 */
			setLevel() {
				if (sessionStorage.showSecurity == '1'){
					let secretLevelList = JSON.parse(sessionStorage.secretLevelList)
					let temp = secretLevelList.find(item => {
						return item.code === this.userInfo.securityClassifiedCode
					})
					let userInfoTemp = JSON.parse(sessionStorage[this.$store.state.sysPrefix + 'userInfo'])
					if (temp){
						userInfoTemp.levelName = temp.name;
						userInfoTemp.levelColor = temp.color;
						userInfoTemp.visible = temp.visible;
					}else{
						userInfoTemp.levelName = "未知密级";
						userInfoTemp.levelColor = "#198fff";
						userInfoTemp.visible = '1';
					}
					this.$store.commit("updateUserInfo", userInfoTemp);
                }
			}
		}
	}
</script>
<style type="text/scss" lang="scss">
    $height: 40px;
    .common-header-wrapper {
      font-size: 14px;
        .common-header {
            display: flex;
            height: $height;
            line-height: $height;
            background: #fff;
            box-shadow: 0 0 15px #ccc;
            .level{
                border-radius: 10px;
                color: #fff;
                display: inline-block;
                font-size: 12px;
                height: 18px;
                line-height: 18px;
                padding: 0 6px;
                text-align: center;
                white-space: nowrap;
            }
            .left-wrapper {
                display: flex;
                align-items: center;
                color: #fff;
                padding: 0 10px;
                background-color: #1680e5;

                .logoIcon {
                    font-size: 1.5em;
                    padding-right: 5px;
                }

                .bgIcon {
                    width: 30px;
                    height: 30px;
                    margin-right: 10px;
                    background: red;
                    color: #f4ea2a;
                    line-height: 30px;
                    text-align: center;
                    border-radius: 5px;
                    padding: 0px;
                }

                .header-logo-title {
                    font-size: 1.3em;
                }
            }

            .right-wrapper {
                flex: 1;
                color: #fff;
                padding: 0 10px;
                font-size: 1.3em;
                background-color: #198FFF;
                display: flex;
                align-items: center;

                .common-header-menu {
                    flex: 1;

                    .iconBtn {
                        height: $height;
                        cursor: pointer;
                        margin: 0 10px;
                        display: inline-block;

                        &.active {
                            border-bottom: 3px solid #fff
                        }
                    }
                }

                .common-header-user {
                    .userDrop {
                        display: flex;
                        align-items: center;

                        .userImg {
                            width: 25px;
                            height: 25px;
                            border-radius: 50%;
                        }

                        .el-dropdown-link {
                            color: #fff;

                            .el-button {
                                color: #fff;
                            }
                        }
                    }

                    .userName {
                        display: inline-block;
                    }
                }
            }
        }
    }
</style>
