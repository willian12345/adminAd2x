import type { RouteRecordRaw } from 'vue-router'

function Layout() {
  return import('@/layouts/index.vue')
}

const routes: RouteRecordRaw = {
  path: '/finance',
  component: Layout,
  name: 'finance',
  meta: {
    title: '财务管理',
    icon: 'i-heroicons-solid:banknotes',
  },
  children: [
    {
      path: '',
      name: 'financeIndex',
      component: () => import('@/views/finance/index.vue'),
      meta: {
        title: '财务管理',
        breadcrumb: false,
      },
    },
  ],
}

export default routes
