import type { RouteRecordMainRaw } from '@fantastic-admin/types'
import type { RouteRecordRaw } from 'vue-router'
import pinia from '@/store'
import AntDesignVueExample from './modules/ant.design.vue.example'
import MultilevelMenuExample from './modules/multilevel.menu.example'
import User from './modules/user'
import DataImport from './modules/data-import'
import Finance from './modules/finance'

// 固定路由（默认路由）
const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login.vue'),
    meta: {
      title: '登录',
    },
  },
  {
    path: '/:all(.*)*',
    name: 'notFound',
    component: () => import('@/views/[...all].vue'),
    meta: {
      title: '找不到页面',
    },
  },
]

// 系统路由
const systemRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/index.vue'),
    meta: {
      breadcrumb: false,
      menu: false,
    },
    children: [
      {
        path: '',
        component: () => import('@/views/index.vue'),
        meta: {
          title: useAppSettingsStore(pinia).settings.app.home.title,
          icon: 'i-ant-design:home-twotone',
          breadcrumb: false,
        },
      },
      {
        path: 'reload',
        name: 'reload',
        component: () => import('@/views/reload.vue'),
        meta: {
          title: '重新加载中...',
          breadcrumb: false,
        },
      },
    ],
  },
]

// 动态路由（异步路由、导航菜单路由）
const asyncRoutes: RouteRecordMainRaw[] = [
  {
    meta: {
      title: '用户管理',
      icon: 'i-heroicons-solid:users',
    },
    children: [
      User,
    ],
  },
  {
    meta: {
      title: '数据导入',
      icon: 'i-heroicons-solid:arrow-up-tray',
    },
    children: [
      DataImport,
    ],
  },
  {
    meta: {
      title: '财务管理',
      icon: 'i-heroicons-solid:banknotes',
    },
    children: [
      Finance,
    ],
  },
]

export {
  asyncRoutes,
  constantRoutes,
  systemRoutes,
}
