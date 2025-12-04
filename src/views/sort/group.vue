<script lang="ts" setup>
defineOptions({ name: 'ContactGroup' })
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { NSpace, NDrawer } from 'naive-ui'
import { useTalkStore, useUserStore } from '@/store'
import { Search } from '@icon-park/vue-next'
import { ServeGetGroups, ServeGetGroupSortGroupSave } from '@/api/group'
import GroupCard from './inner/GroupCard.vue'
import GroupPanel from '@/components/group/GroupPanel.vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const talkStore = useTalkStore()
const keywords = ref('')
const items = ref<any[]>([])
const groupIdsFilter = ref<number[] | null>(null)

const params = reactive({
  isShow: false,
  group_id: 0
})

const tabIndex = ref('all')

const uid = userStore.uid

const filter = computed((): any[] => {
  return items.value.filter((item: any) => {
    if (groupIdsFilter.value && groupIdsFilter.value.length > 0) {
      if (!groupIdsFilter.value.includes(item.id)) return false
    } else if (groupIdsFilter.value && groupIdsFilter.value.length == 0) {
      return false
    }
    if (tabIndex.value == 'create' && item.creator_id != uid) {
      return false
    }

    if (tabIndex.value == 'join' && item.creator_id == uid) {
      return false
    }

    return item.group_name.toLowerCase().indexOf(keywords.value.toLowerCase()) != -1
  })
})

const onLoadData = async () => {
  const res = await ServeGetGroups()

  if (res.code === 200) {
    items.value = res.data.items || []
  }
  
}

const onShowGroup = (item: any) => {
  console.log('item', item)
  params.isShow = true
  params.group_id = item.id
}

const onToTalk = (item: any) => {
  talkStore.toTalk(2, item.id, router)
}

onMounted(() => {
  onLoadData()
  const initId = route.query.sort_id as string | undefined
  if (initId) {
    onLoadGroupIds(parseInt(initId))
  } else {
    groupIdsFilter.value = null
  }
})

const onLoadGroupIds = async (sortId: number) => {
  const res = await ServeGetGroupSortGroupSave({ group_sort_id: sortId })

  if (res.code === 200) {
    groupIdsFilter.value = res.data || []
  } else {
    groupIdsFilter.value = []
  }
}
  

watch(
  () => route.query.sort_id,
  (v) => {
    if (v) {
      onLoadGroupIds(parseInt(String(v)))
    } else {
      groupIdsFilter.value = null
    }
  }
)
</script>

<template>
  <section id="drawer-target" class="el-container is-vertical h-full">
    <header class="el-header me-view-header border-bottom">
      
      <n-space>
        <n-input
          v-model:value.trim="keywords"
          placeholder="搜索"
          clearable
          style="max-width: 200px"
          round
        >
          <template #prefix>
            <n-icon :component="Search" />
          </template>
        </n-input>
        
      </n-space>
    </header>

    <main v-if="filter.length == 0" class="el-main flex-center">
      <n-empty description="暂无相关数据" />
    </main>

    <main v-else class="el-main me-scrollbar me-scrollbar-thumb pd-10" id="drawer-container">
      <div class="cards">
        <GroupCard
          v-for="item in filter"
          :key="item.key_id"
          :avatar="item.avatar"
          :username="item.group_name"
          :gender="item.gender"
          :motto="item.profile"
          flag="查看"
          :is-member="true"
          @click="onShowGroup(item)"
          @talk="onToTalk(item)"
        />
      </div>
    </main>
  </section>
  <n-drawer
    v-model:show="params.isShow"
    :width="400"
    placement="right"
    :trap-focus="false"
    :block-scroll="false"
    to="#drawer-target"
    show-mask="transparent"
  >
    <GroupPanel
      :gid="params.group_id"
      @close="params.isShow = false"
      @to-talk="talkStore.toTalk(2, params.group_id, router)"
    />
  </n-drawer>
</template>

<style lang="less" scoped>
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  grid-gap: 12px;
  gap: 12px;
}
</style>
