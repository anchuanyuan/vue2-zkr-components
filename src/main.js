import Vue from 'vue'

import router from './router/index.js'
import store from './store/index.js'
import util from '@/utils/index'
import axios from 'axios';
import moment from 'moment';
import lodash from 'lodash'
import "@/assets/style/reset.scss";
import "@/assets/style/plugin.scss";
import $ from 'jquery';
window.$ = $;

import App from './App.vue'
import 'uno.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import draggable from "./utils/draggable";
Vue.use(util)
Vue.use(draggable)
Vue.use(ElementUI,{ size: 'mini' })
import {
	RZdataFields
} from './assets/dataFields.js'

Vue.prototype.$dataFields = RZdataFields;
Vue.prototype.$moment = moment;
Vue.prototype.$moment.locale('zh-cn');
Vue.prototype.$http = axios;
Vue.prototype.$tagRefresh = false;
Vue.prototype.$loadsh = lodash;

// 往vue实例里面面放入 route对象 固定写法
const app = new Vue({
  render: h=>h(App),
  router: router,
  store
})

app.$mount('#app')
