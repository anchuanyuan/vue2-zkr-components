import Vue from 'vue';
import Vuex from 'vuex';
import {
	RZdataFields
} from '../assets/dataFields.js'

Vue.use(Vuex);

const state = {
    sysType: "",
    sysPrefix: "cadre_",
    refreshLocal: ["page", "table", "tree", "dialog","codeData"], //"codeData","userMenu"
    appInfo: {
        appName: "干部信息管理",
        appIcon: "icon-xinxi"
        //appName: "机构编制系统",
        //appIcon: "icon-jigou"
        // appName: "报表管理系统",
        // appIcon: "icon-baobiao"
        // appName: "数据中心系统",
        // appIcon: "icon-shuju"
    },
    advancedSearch: null,
    departTreeId: '', //单位树默认选中的id
    openMenu: false,
    menuActiveIndex: 0,
    headerMenuIndex: 0,
    sessionTeamChange: 0, //更新班子换届职位人选
    setPosition: false, //设置职位条件页面跳转

    pageLoading: false, //页面loading
    refreshHeight: false, //刷新高度
    userInfo: {},
    menuData: [],
    codeData: {},
    tagData: {},
    userPage: {},
    userDialog: {},
    userTree: {},
    userTable: {},
    loginStatus: false,
    selectRefresh: '',
    archivePower: {}
};
const getters = {
    sysType(state) { //bj->毕节1,xj->新疆2,
        if (!state.sysType){
        	switch (sessionStorage.cadre_sysName){
		        case "ops-cimp-bj":
		            state.sysType = "1";
			        break
		        case "ops-cimp-xj":
			        state.sysType = "2";
			        break
		        case "ops-cimp-bs":
			        state.sysType = "3";
			        break 
				case "ops-cimp-rz":
			        state.sysType = "4";
			        break
				case "ops-cimp-jn":
			        state.sysType = "5";
			        break
                case "ops-cimp-hm":
                    state.sysType = "6";
                    break
                case "ops-cimp-ls":
                    state.sysType = "3";
                    break
	        }
        }
        return state.sysType;
    },
    isAdmin(state) {
        if (!state.userInfo || Object.keys(state.userInfo).length === 0)
            state.userInfo = JSON.parse(sessionStorage[state.sysPrefix + "userInfo"]);
        let result = new Array();
        if(state.userInfo.roleViewModelList) {
            result = state.userInfo.roleViewModelList.filter(item=>{
                return item.code === '90'
            })
        }
        return result.length>0;
    },
    userInfo(state) {
        if (!state.userInfo || Object.keys(state.userInfo).length === 0)
            state.userInfo = JSON.parse(sessionStorage[state.sysPrefix + "userInfo"]);
        return state.userInfo;
    },
    menuData(state) {
        if (state.menuData.length <= 0) {
            if (localStorage[state.sysPrefix + "userMenu"])
                state.menuData = JSON.parse(localStorage[state.sysPrefix + "userMenu"]);
            else {
                state.menuData = [];
            }
        }
        return state.menuData;
    },
    codeData(state) {
        if (Object.keys(state.codeData).length === 0) {
            if (localStorage[state.sysPrefix + "codeData"]) {
                state.codeData = JSON.parse(localStorage[state.sysPrefix + "codeData"]);
            }
        }
        return state.codeData;
    },
    tagData(state) {
        if (Object.keys(state.tagData).length === 0) {
            if (localStorage[state.sysPrefix + "tagData"]) {
                state.tagData = JSON.parse(localStorage[state.sysPrefix + "tagData"]);
            }
        }
        return state.tagData;
    },
    userPage(state) {
        if (Object.keys(state.userPage).length > 0) {
            return state.userPage;
        } else {
            if (!localStorage[state.sysPrefix + 'page'])
                localStorage.setItem(state.sysPrefix + 'page', JSON.stringify({}));
            return JSON.parse(localStorage[state.sysPrefix + 'page']);
        }
    },
    userDialog(state) {
        if (Object.keys(state.userDialog).length > 0) {
            return state.userDialog;
        } else {
            if (!localStorage[state.sysPrefix + 'dialog'])
                localStorage.setItem(state.sysPrefix + 'dialog', JSON.stringify({}));
            return JSON.parse(localStorage[state.sysPrefix + 'dialog']);
        }
    },
    userTree(state) {
        if (Object.keys(state.userTree).length > 0) {
            return state.userTree;
        } else {
            if (!localStorage[state.sysPrefix + 'tree'])
                localStorage.setItem(state.sysPrefix + 'tree', JSON.stringify({}));
            return JSON.parse(localStorage[state.sysPrefix + 'tree']);
        }
    },
    userTable(state) {
        if (Object.keys(state.userTable).length > 0) {
            return state.userTable;
        } else {
            if (!localStorage[state.sysPrefix + 'table'])
                localStorage.setItem(state.sysPrefix + 'table', JSON.stringify({}));
            return JSON.parse(localStorage[state.sysPrefix + 'table']);
        }
    },
    archivePower(state) {
        if (Object.keys(state.archivePower).length > 0) {
            return state.archivePower;
        } else {
            if (!localStorage['archivePower'])
                localStorage.setItem('archivePower', JSON.stringify({}));
            return JSON.parse(localStorage['archivePower']);
        }
    }
};
const mutations = {
    updateAdvancedSearch(state, value) {
        state.advancedSearch = value
    },
    updateSelectRefresh(state, value) {
        state.selectRefresh = value
    },
    updateDepartTreeId(state, value) {
        state.departTreeId = value
    },
    updateSystype(state, payload) {
    	switch (payload){
		    case "ops-cimp-bj":
			    state.sysType = "1";
			    Vue.prototype.$dataFields = BJdataFields;
			    break
		    case "ops-cimp-xj":
		    	state.sysType = "2";
			    Vue.prototype.$dataFields = XJdataFields;
		    	break
		    case "ops-cimp-bs":
			    state.sysType = "3";
			    Vue.prototype.$dataFields = BSdataFields;
                // Vue.prototype.$dataFields = BJdataFields;
                break
			case "ops-cimp-rz":
			    state.sysType = "4";
			    Vue.prototype.$dataFields = RZdataFields;
                break
			case "ops-cimp-jn":
			    state.sysType = "5";
			    Vue.prototype.$dataFields = JNdataFields;  
                break
            case "ops-cimp-hm":
                state.sysType = "6";
                Vue.prototype.$dataFields = HMdataFields;
                break
		    default:
			    state.sysType = "3";
			    Vue.prototype.$dataFields = RZdataFields;
			    break

	    }
        console.log(Vue.prototype.$dataFields)
    },
    //菜单toggle
    toggleOpenMenu(state) {
        state.openMenu = !state.openMenu;
    },
    //更新菜单开关
    updateOpenMenu(state, payload) {
        state.openMenu = payload;
    },
    //更新菜单所在
    updateMenuActiveIndex(state, payload) {
        state.menuActiveIndex = payload;
    },
    //更新页面头部菜单所在
    updateHeaderMenuIndex(state, payload) {
        state.headerMenuIndex = payload;
    },
    //更新页面头部菜单所在
    updateUserInfo(state, payload) {
        sessionStorage.setItem(state.sysPrefix + 'userInfo', JSON.stringify(payload));
        state.userInfo = payload;
    },
    //更新菜单数据
    updateMenuData(state, payload) {
        state.menuData = payload;
    },
    //更新code数据
    updateCodeData(state, payload) {
        state.codeData = payload
    },
    //更新标签数据
    updateTagData(state, payload) {
        state.tagData = payload
    },
    //更新高度刷新
    updateRefreshHeight(state, payload) {
        state.refreshHeight = payload;
    },
    //更新页面loading
    updatePageLoading(state, payload) {
        state.pageLoading = payload;
    },
    updateUserPage(state, payload) {
        Vue.prototype.$set(state.userPage, payload[0], payload[1]);
        localStorage.setItem(state.sysPrefix + 'page', JSON.stringify(state.userPage));
    },
    updateUserDialog(state, payload) {
        Vue.prototype.$set(state.userDialog, payload[0], payload[1]);
        localStorage.setItem(state.sysPrefix + 'dialog', JSON.stringify(state.userDialog));
    },
    updateUserTree(state, payload) {
        console.log('payload')
        console.log(payload)
        Vue.prototype.$set(state.userTree, payload[0], payload[1]);
        localStorage.setItem(state.sysPrefix + 'tree', JSON.stringify(state.userTree));
    },
    updateUserTable(state, payload) {
        Vue.prototype.$set(state.userTable, payload[0], payload[1]);
        localStorage.setItem(state.sysPrefix + 'table', JSON.stringify(state.userTable));
    },
    updateArchivePower(state, payload) {
        state.archivePower = payload
        localStorage.setItem('archivePower', JSON.stringify(payload));
    },
    updateLoginStatus (state, payload) {
        state.loginStatus = !state.loginStatus
    },updateSessionTeamChange (state, payload) {
        state.sessionTeamChange++;
        if (state.sessionTeamChange === 10){
            state.sessionTeamChange = 0;
        }
    },updateSetPosition (state, payload) {
        state.setPosition = payload;
    },
};
export default new Vuex.Store({
    state,
    getters,
    mutations
});
