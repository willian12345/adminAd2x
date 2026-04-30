import type { RouteRecordRaw } from 'vue-router'

function Layout() {
  return import('@/layouts/index.vue')
}

const routes: RouteRecordRaw = {
  path: '/data_import',
  component: Layout,
  name: 'dataImport',
  meta: {
    title: '数据导入',
    icon: 'i-heroicons-solid:arrow-up-tray',
  },
  children: [
    {
      path: '',
      name: 'dataImportIndex',
      component: () => import('@/views/data-import/index.vue'),
      meta: {
        title: 'tiktok数据导入',
        breadcrumb: false,
      },
    },
  ],
}

export default routes
