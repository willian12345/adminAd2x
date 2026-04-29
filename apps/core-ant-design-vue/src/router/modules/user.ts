import type { RouteRecordRaw } from 'vue-router'

function Layout() {
  return import('@/layouts/index.vue')
}

const routes: RouteRecordRaw = {
  path: '/user',
  component: Layout,
  name: 'user',
  meta: {
    title: '用户管理',
    icon: 'i-heroicons-solid:users',
    menu: false,
  },
  children: [
    {
      path: '',
      name: 'userIndex',
      component: () => import('@/views/user/index.vue'),
      meta: {
        title: '用户管理',
        breadcrumb: false,
      },
    },
  ],
}

export default routes
