<script setup lang="ts">
import type { Ref } from 'vue'
import { ref, reactive, computed, } from 'vue'
import type { TableProps } from 'ant-design-vue'
import { createUser, getUserList } from '@/api/modules/user'
import { message } from 'ant-design-vue'
import type { TUser } from '@/types/user'
import { usePagination } from '@/api'






const searchValue = ref('')

const loading = ref(false)
const userList = ref<TUser[]>([])
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
})

const { data: userListData, page, pageSize, total, isLastPage, update } =
    usePagination<TUser>(
      (page, pageSize) => {
        return getUserList(page, pageSize);
      },
      {
        debounce: [1000],
        append: true,
        initialPage: 1,
      },
    );

  watchEffect(() => {
    userList.value = userListData.value || []
    pagination.total = total.value
  })

    // console.log(userListData.value,3333444)
    // userList.value = userListData?.value?.[0] || []
    // pagination.total = total.value

async function fetchUserList() {
  loading.value = true
  try {
    const res = await getUserList(pagination.current, pagination.pageSize)
    if (res?.data?.page_info) {
      userList.value = res.data.list
      pagination.total = res.data.page_info.total
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
  } finally {
    loading.value = false
  }
}

function handleTableChange(pag: any) {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  fetchUserList()
}

const columns: TableProps['columns'] = [
  {
    title: 'User ID',
    dataIndex: 'user_id',
    key: 'iuser_idd',
    width: 80,
  },
  {
    title: '用户名',
    dataIndex: 'full_name',
    key: 'full_name',
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    key: 'created_at',
    width: 180,
  },
  // {
  //   title: '操作',
  //   key: 'action',
  //   width: 160,
  // },
]

const modalVisible = ref(false)
const modalTitle = ref('添加用户')
const formRef = ref()
const formState = reactive({
  fullName: '',
  email: '',
  password: '',
  role: '用户',
})

function openAddModal() {
  modalTitle.value = '添加用户'
  formState.fullName = ''
  formState.email = ''
  formState.password = ''
  formState.role = '用户'
  modalVisible.value = true
}

function openEditModal(record: TUser) {
  modalTitle.value = '编辑用户'
  formState.fullName = record.full_name
  formState.email = record.email
  formState.password = ''
  modalVisible.value = true
}

function handleDelete(id: number) {
  console.log('Delete user:', id)
}

async function saveUser() {
  try {
    await formRef.value.validate()
    await createUser(formState.fullName, formState.email, formState.password)
    message.success('添加用户成功')
    modalVisible.value = false
    fetchUserList()
  } catch (error) {
    console.error('添加用户失败:', error)
  }
}

const roleOptions = [
  { value: '管理员', label: '管理员' },
  { value: '编辑', label: '编辑' },
  { value: '用户', label: '用户' },
]

const rules = {
  fullName: [{ required: true, message: '请输入用户名' }],
  email: [
    { required: true, message: '请输入邮箱' },
    { type: 'email', message: '请输入有效的邮箱地址' },
  ],
  password: [{ required: true, message: '请输入密码' }],
}

// fetchUserList()
</script>

<template>
  <div>
    <FaPageHeader title="用户管理" description="管理系统用户信息，包括添加、编辑、删除用户等操作。">
      <FaButton type="primary" @click="openAddModal">
        <FaIcon name="i-heroicons-solid:plus" />
        添加用户
      </FaButton>
    </FaPageHeader>

    <FaPageMain>
      <div class="flex items-center gap-4 mb-4">
        <AInput
          v-model:value="searchValue"
          placeholder="搜索用户名或邮箱"
          style="width: 300px;"
          allow-clear
        >
          <template #prefix>
            <FaIcon name="i-heroicons-solid:search" />
          </template>
        </AInput>
        <FaButton>搜索</FaButton>
      </div>

      <ATable
        :columns="columns"
        :data-source="userList"
        :loading="loading"
        :pagination="{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total: number) => `共 ${total} 条`,
        }"
        bordered
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <ASpace :size="8">
              <a @click="openEditModal(record)">编辑</a>
              <a @click="handleDelete(record.id)" class="text-red-500">删除</a>
            </ASpace>
          </template>
        </template>
      </ATable>
    </FaPageMain>

    <AModal
      v-model:open="modalVisible"
      :title="modalTitle"
      :footer="null"
    >
      <AForm
        ref="formRef"
        :model="formState"
        :rules="rules"
        layout="vertical"
      >
        <AFormItem label="用户名" name="fullName">
          <AInput v-model:value="formState.fullName" placeholder="请输入用户名" />
        </AFormItem>
        <AFormItem label="邮箱" name="email">
          <AInput v-model:value="formState.email" placeholder="请输入邮箱" />
        </AFormItem>
        <AFormItem v-if="modalTitle === '添加用户'" label="密码" name="password">
          <AInput v-model:value="formState.password" type="password" placeholder="请输入密码" />
        </AFormItem>
        <!-- <AFormItem label="角色" name="role">
          <ASelect v-model:value="formState.role" :options="roleOptions" />
        </AFormItem> -->
      </AForm>
      <div class="flex justify-end gap-4 mt-4">
        <FaButton @click="modalVisible = false">取消</FaButton>
        <FaButton type="primary" @click="saveUser">保存</FaButton>
      </div>
    </AModal>
  </div>
</template>
