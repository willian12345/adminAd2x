<script setup lang="ts">
import { ref } from 'vue'
import { ImportTiktokBatch } from '@/api/modules/batch'
import { message } from 'ant-design-vue'

const formRef = ref()
const loading = ref(false)

const jsonData = ref('')

const jsonPlaceholder = `请粘贴 JSON 数据，例如:
{
  "campaigns": [
    {
      "name": "示例广告计划",
      "budget": 1000,
      "status": "active"
    }
  ]
}`

const rules = [
  {
    validator: (_: any, value: string) => {
      if (!value) {
        return Promise.reject(new Error('请输入 JSON 数据'))
      }
      try {
        JSON.parse(value)
        return Promise.resolve()
      }
      catch {
        return Promise.reject(new Error('JSON 格式不正确'))
      }
    },
  },
]

async function handleSubmit() {
  try {
    await formRef.value.validate()
    loading.value = true
    const parsedData = JSON.parse(jsonData.value)
    await ImportTiktokBatch(parsedData)
    message.success('导入成功！')
    jsonData.value = ''
  }
  catch (error: any) {
    console.error('导入失败:', error)
    if (error instanceof SyntaxError) {
      message.error('JSON 格式错误，请检查输入内容')
    }
    else {
      message.error(`导入失败: ${error?.message || error}`)
    }
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="w-full max-w-4xl mx-auto p-6">
    <FaPageHeader title="数据导入" description="批量导入 TikTok 相关数据">
      <template #content>
        <ACard body-style="padding: 2rem">
          <ASpace direction="vertical" size="large" class="w-full">
            <div class="text-center">
              <h3 class="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-200">
                TikTok 批量导入
              </h3>
              <p class="text-base text-gray-500">
                请输入 TikTok 相关数据的 JSON 格式内容进行批量导入
              </p>
            </div>
          </ASpace>
        </ACard>
      </template>
    </FaPageHeader>
    <ASpace direction="vertical" size="large" class="w-full">
      <AForm
              ref="formRef"
              layout="vertical"
              class="w-full"
              @finish="handleSubmit"
            >
              <AFormItem name="jsonData" :rules="rules">
                <template #label>
                  <span class="text-lg font-medium text-gray-700 dark:text-gray-300">JSON 数据</span>
                </template>
                <ATextarea
                  v-model:value="jsonData"
                  :rows="12"
                  :placeholder="jsonPlaceholder"
                  :bordered="true"
                  class="font-mono text-sm"
                  style=" font-size: 14px; line-height: 1.5;resize: none;"
                />
              </AFormItem>

              <AFormItem class="mb-0">
                <div class="flex justify-center">
                  <FaButton
                    type="primary"
                    html-type="submit"
                    :loading="loading"
                    style=" height: 44px; padding-right: 2rem;padding-left: 2rem; font-size: 16px; font-weight: 500; border-radius: 8px;"
                  >
                    {{ loading ? '导入中...' : '开始导入' }}
                  </FaButton>
                </div>
              </AFormItem>
            </AForm>

            <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p class="text-sm text-gray-600 dark:text-gray-400">
                💡 温馨提示：确保 JSON 格式正确，系统会自动验证数据格式
              </p>
            </div>
    </ASpace>
  </div>
</template>
