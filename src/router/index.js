// 引入vue-router 库 编写 router 路由表
import Vue from 'vue';
import VueRouter from 'vue-router'
//固定写法
Vue.use(VueRouter)

export const routes = [
  {
    path: '/formBreadcrumbPage',
    name: '面包屑-组件',
    component: () => import('@/pages/form/formBreadcrumbPage.vue'),
    meta: {
      title: '表单-面包屑'
    }
  },
  {
    path: '/dialog',
    name: '弹窗组件',
    component: () => import('@/pages/dialog/dialog.page.vue'),
    meta: {
      title: '弹窗组件'
    }
  },
  {
    path: '/quickEditor',
    name: '表格编辑-组件',
    component: () => import('@/pages/quickEditor/index.vue'),
    meta: {
      title: '表格编辑'
    }
  },

]

// new VueRouter 实例 用解析路由的运行时
const router = new VueRouter(
  {
    mode: 'history',
    // 路由配置项 配置了3个路由 / 根路由  /A 路由 和/B路由  
    routes: [
      {
        name: 'home',
        path: '/',
        component: ()=>import('@/pages/index.vue'),
        meta: {
          title: "导航页"
        }
      } ,
      ...routes
    ]
  }
)

// 导出路由对象
export default router
