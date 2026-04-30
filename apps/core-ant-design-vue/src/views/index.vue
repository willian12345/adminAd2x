<script setup lang="ts">
import logo from '@/assets/images/logo.svg'

const router = useRouter()

const shortcuts = ref([
  {
    title: '用户管理',
    description: '管理系统用户信息',
    icon: 'i-heroicons-solid:users',
    path: '/user',
    color: 'bg-blue-500',
  },
  {
    title: '数据导入',
    description: '批量导入 TikTok 数据',
    icon: 'i-heroicons-solid:arrow-up-tray',
    path: '/data_import',
    color: 'bg-green-500',
  },
  {
    title: 'UI 组件示例',
    description: 'Ant Design Vue 组件演示',
    icon: 'i-whh:jqueryui',
    path: '/ant_design_vue_example',
    color: 'bg-purple-500',
  },
  {
    title: '多级菜单',
    description: '导航菜单示例',
    icon: 'i-ri:function-ai-line',
    path: '/multilevel_menu_example/page',
    color: 'bg-orange-500',
  },
])

function navigateTo(path: string) {
  router.push(path)
}

const stats = ref([
  { label: '用户总数', value: '1,234', icon: 'i-heroicons-solid:user-group' },
  { label: '今日导入', value: '56', icon: 'i-heroicons-solid:arrow-up-tray' },
  { label: '在线设备', value: '89', icon: 'i-heroicons-solid:device-phone-mobile' },
  { label: '系统状态', value: '正常运行', icon: 'i-heroicons-solid:check-circle' },
])
</script>

<template>
  <div class="bg-background size-full absolute overflow-auto">
    <div class="mx-auto px-4 py-6 max-w-7xl md-px-8 md-py-10">
      <div class="mb-8 flex items-center gap-3">
        <img :src="logo" class="h-10 w-10 rounded-lg border p-1">
        <div>
          <h1 class="text-xl font-semibold">
            AD2X 管理后台
          </h1>
          <p class="text-sm text-muted-foreground">
            欢迎回来，今天又是高效的一天
          </p>
        </div>
      </div>

      <div class="mb-8 grid gap-4 md-grid-cols-4">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="border rounded-xl bg-neutral-950/[.012] dark:bg-white/5 p-5"
        >
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10">
              <FaIcon :name="stat.icon" class="size-5 text-primary" />
            </div>
            <div>
              <div class="text-2xl font-semibold">
                {{ stat.value }}
              </div>
              <div class="text-xs text-muted-foreground">
                {{ stat.label }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div class="mb-4 flex items-center gap-2">
          <div class="h-4 w-0.5 rounded-full bg-primary" />
          <h2 class="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            快捷入口
          </h2>
        </div>
        <div class="grid gap-4 md-grid-cols-2 lg-grid-cols-4">
          <div
            v-for="shortcut in shortcuts"
            :key="shortcut.path"
            class="group border rounded-xl bg-neutral-950/[.012] dark:bg-white/5 p-5 cursor-pointer transition-all duration-200 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
            @click="navigateTo(shortcut.path)"
          >
            <div class="flex items-center gap-4">
              <div
                class="flex items-center justify-center h-12 w-12 rounded-xl text-white"
                :class="shortcut.color"
              >
                <FaIcon :name="shortcut.icon" class="size-6" />
              </div>
              <div>
                <div class="font-semibold group-hover:text-primary transition-colors">
                  {{ shortcut.title }}
                </div>
                <div class="text-xs text-muted-foreground mt-0.5">
                  {{ shortcut.description }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
