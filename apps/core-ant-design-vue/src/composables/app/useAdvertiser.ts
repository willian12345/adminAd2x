import { getAdvertisers } from '@/router/modules/advertiser'
import type { TAdvertiser } from '@/types/advertiser'

export function useAdvertiserSelect() {
  const advertiserList = ref<TAdvertiser[]>([])
  const loading = ref(false)

  async function fetchAdvertisers(platform: string | null = null, authCode: string | null = null) {
    loading.value = true
    try {
      const res = await getAdvertisers(platform, authCode)
      advertiserList.value = res?.data || []
    }
    catch (error) {
      console.error('获取广告主列表失败:', error)
      advertiserList.value = []
    }
    finally {
      loading.value = false
    }
  }

  const advertiserOptions = computed(() => {
    return advertiserList.value.map(item => ({
      value: item.advertiser_id,
      label: item.advertiser_name,
    }))
  })

  return {
    advertiserList,
    advertiserOptions,
    loading,
    fetchAdvertisers,
  }
}
