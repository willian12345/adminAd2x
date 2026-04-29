# Admin - AD2X

基于 Vue 3 + TypeScript + Vite 的后台管理框架，内置 Ant Design Vue 组件库。

## 技术栈

- **框架**: Vue 3.6 + TypeScript + Vite 8
- **UI 组件**: Ant Design Vue 4.x
- **状态管理**: Pinia + pinia-plugin-persistedstate
- **路由**: Vue Router 5
- **HTTP**: Alova + Axios
- **样式**: UnoCSS（原子化 CSS）+ SCSS
- **包管理器**: pnpm

## 目录结构

```
├── apps/
│   └── core-ant-design-vue/     # 主应用
│       └── src/
│           ├── api/             # API 请求模块
│           │   └── modules/     # 按业务模块拆分的 API
│           ├── assets/          # 静态资源
│           ├── components/      # 全局业务组件
│           ├── composables/     # 组合式函数
│           ├── layouts/         # 布局组件
│           ├── router/         # 路由配置
│           │   └── modules/    # 路由模块
│           ├── store/          # Pinia store
│           ├── types/          # TypeScript 类型定义
│           ├── ui/             # UI 组件
│           ├── utils/          # 工具函数
│           └── views/          # 页面视图
└── packages/                    # 框架子包（共享）
```

## 开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 代码检查
pnpm lint
```

## 路由说明

路由配置文件位于 `src/router/routes.ts`，业务路由模块放在 `src/router/modules/` 目录下。

创建新页面示例：

1. 在 `src/views/` 下创建页面组件
2. 在 `src/router/modules/` 下创建路由模块
3. 在 `src/router/routes.ts` 的 `asyncRoutes` 中注册路由模块

## 接口说明

API 模块位于 `src/api/modules/`，使用 Alova 进行请求管理。

常用命令：

```typescript
import { httpGet, httpPost } from '@/api'

// GET 请求
const res = await httpGet<ResponseType>('/api endpoint', { params: {} })

// POST 请求
const res = await httpPost<ResponseType>('/api endpoint', data, { meta: { ignoreToken: true } })
```

## 环境变量

开发环境配置文件：`.env.development`
生产环境配置：`.env.production`
测试环境配置：`.env.test`

## 功能模块

- 用户管理
- 多级菜单导航
- Ant Design Vue 组件示例
