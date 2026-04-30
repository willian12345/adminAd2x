<script setup lang="ts">
import { ref, computed } from 'vue'
import type { TableProps } from 'ant-design-vue'
import { getFinanceSpends, getRechargeRecords, rechargeBalance } from '@/api/modules/balance'
import { usePagination } from '@/api/index'
import { useAdvertiserSelect } from '@/composables/app/useAdvertiser'
import type { RechargeItem, SpendItem } from '@/api/modules/balance'
import { message } from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'
import dayjs from 'dayjs'

const activeTab = ref<'recharges' | 'spends'>('recharges')

const {
  data: rechargeData,
  loading: rechargeLoading,
  total: rechargeTotal,
  page: rechargePage,
  pageSize: rechargePageSize,
  update: updateRecharge,
} = usePagination<RechargeItem>(
  (page, pageSize) => {
    return getRechargeRecords({ page, page_size: pageSize })
  },
  {
    initialPage: 1,
    initialPageSize: 10,
    data: (response) => response?.data?.list ?? [],
    total: (response) => {
      return response?.data?.page_info?.total ?? 0
    },
    append: false,
  },
)

const {
  data: spendData,
  loading: spendLoading,
  total: spendTotal,
  page: spendPage,
  pageSize: spendPageSize,
  update: updateSpend,
} = usePagination<SpendItem>(
  (page, pageSize) => {
    return getFinanceSpends({ page, page_size: pageSize })
  },
  {
    initialPage: 1,
    initialPageSize: 10,
    data: (response) => response?.data?.list ?? [],
    total: (response) => {
      return response?.data?.page_info?.total ?? 0
    },
    append: false,
  },
)

const rechargeList = computed(() => {
  return rechargeData.value || []
})

const spendList = computed(() => {
  return spendData.value || []
})

const rechargeModalVisible = ref(false)
const rechargeSubmitLoading = ref(false)
const rechargeFormRef = ref<FormInstance>()
const rechargeForm = reactive({
  advertiser_id: '',
  amount: '',
  remark: '',
})

const { advertiserOptions, loading: advertiserLoading, fetchAdvertisers } = useAdvertiserSelect()

async function openRechargeModal() {
  await fetchAdvertisers()
  rechargeModalVisible.value = true
}

async function handleRechargeSubmit() {
  try {
    await rechargeFormRef.value?.validate()
    rechargeSubmitLoading.value = true
    await rechargeBalance({
      advertiser_id: rechargeForm.advertiser_id,
      amount: Number(rechargeForm.amount),
      remark: rechargeForm.remark,
    })
    message.success('充值成功')
    rechargeModalVisible.value = false
    rechargeForm.advertiser_id = ''
    rechargeForm.amount = ''
    rechargeForm.remark = ''
    updateRecharge({ page: 1 })
  }
  catch (error) {
    console.error('充值失败:', error)
  }
  finally {
    rechargeSubmitLoading.value = false
  }
}

const rechargeColumns: TableProps['columns'] = [
  {
    title: '充值单号',
    dataIndex: 'txn_no',
    key: 'txn_no',
    width: 180,
  },
  {
    title: '平台',
    dataIndex: 'platform',
    key: 'platform',
    width: 100,
  },
  {
    title: '广告主ID',
    dataIndex: 'advertiser_id',
    key: 'advertiser_id',
    width: 120,
  },
  {
    title: '广告主名称',
    dataIndex: 'advertiser_name',
    key: 'advertiser_name',
    width: 150,
  },
  {
    title: '充值金额',
    dataIndex: 'amount',
    key: 'amount',
    width: 120,
  },
  {
    title: '货币',
    dataIndex: 'currency',
    key: 'currency',
    width: 80,
  },
  {
    title: '充值日期',
    dataIndex: 'recharge_date',
    key: 'recharge_date',
    width: 120,
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    key: 'created_at',
    width: 180,
    customRender: ({ text }: { text: string }) => {
      return dayjs(text).format('YYYY-MM-DD HH:mm:ss')
    },
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
    ellipsis: true,
  },
]

const spendColumns: TableProps['columns'] = [
  {
    title: '交易单号',
    dataIndex: 'txn_no',
    key: 'txn_no',
    width: 180,
  },
  {
    title: '统计日期',
    dataIndex: 'stat_date',
    key: 'stat_date',
    width: 120,
  },
  {
    title: '平台',
    dataIndex: 'platform',
    key: 'platform',
    width: 100,
  },
  {
    title: '广告主ID',
    dataIndex: 'advertiser_id',
    key: 'advertiser_id',
    width: 120,
  },
  {
    title: '广告计划ID',
    dataIndex: 'campaign_id',
    key: 'campaign_id',
    width: 120,
  },
  {
    title: '广告计划名称',
    dataIndex: 'campaign_name',
    key: 'campaign_name',
    width: 180,
    ellipsis: true,
  },
  {
    title: '消耗金额',
    dataIndex: 'cost',
    key: 'cost',
    width: 120,
  },
]

function handleRechargeTableChange(pag: any) {
  updateRecharge({
    page: pag.current,
    pageSize: pag.pageSize,
  })
}

function handleSpendTableChange(pag: any) {
  updateSpend({
    page: pag.current,
    pageSize: pag.pageSize,
  })
}
</script>

<template>
  <div>
    <FaPageHeader title="财务管理" description="查看充值明细与消耗明细">
      <template #actions>

      </template>
    </FaPageHeader>
    <FaPageMain>
      <FaTabs
        v-model="activeTab"
        :list="[
          { label: '充值明细', value: 'recharges' },
          { label: '消耗明细', value: 'spends' },
        ]"
      />

      <div v-show="activeTab === 'recharges'">
        <div class="mb-4">
        <AButton v-if="activeTab === 'recharges'" type="primary" @click="openRechargeModal">
          充值
        </AButton>
        </div>
        <ATable
          :columns="rechargeColumns"
          :data-source="rechargeList"
          :loading="rechargeLoading"
          :pagination="{
            current: rechargePage,
            pageSize: rechargePageSize,
            total: rechargeTotal,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total: number) => `共 ${total} 条`,
          }"
          bordered
          @change="handleRechargeTableChange"
        />
      </div>

      <div v-show="activeTab === 'spends'" class="mt-4">
        <ATable
          :columns="spendColumns"
          :data-source="spendList"
          :loading="spendLoading"
          :pagination="{
            current: spendPage,
            pageSize: spendPageSize,
            total: spendTotal,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total: number) => `共 ${total} 条`,
          }"
          bordered
          @change="handleSpendTableChange"
        />
      </div>
    </FaPageMain>

    <FaModal
      v-model="rechargeModalVisible"
      title="充值"
      :confirm-button-loading="rechargeSubmitLoading"
      width="640px"
      @confirm="handleRechargeSubmit"
    >
      <AForm
        ref="rechargeFormRef"
        :model="rechargeForm"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <AFormItem
          label="广告主"
          name="advertiser_id"
          :rules="[{ required: true, message: '请选择广告主' }]"
        >
          <ASelect
            v-model:value="rechargeForm.advertiser_id"
            placeholder="请选择广告主"
            :loading="advertiserLoading"
            :options="advertiserOptions"
            show-search
            :get-popup-container="(triggerNode: HTMLElement) => triggerNode.parentNode as HTMLElement"
          />
        </AFormItem>
        <AFormItem
          label="充值金额"
          name="amount"
          :rules="[
            { required: true, message: '请输入充值金额' },
            { type: 'number', message: '金额必须是数字' },
          ]"
        >
          <AInputNumber
            v-model:value="rechargeForm.amount"
            placeholder="请输入充值金额"
            :min="0"
            :precision="2"
            class="!w-full"
          />
        </AFormItem>
        <AFormItem label="备注" name="remark">
          <ATextarea
            v-model:value="rechargeForm.remark"
            placeholder="请输入备注（可选）"
            :rows="3"
          />
        </AFormItem>
      </AForm>
    </FaModal>
  </div>
</template>
