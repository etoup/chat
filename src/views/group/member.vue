<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { NSpace, NTabs, NTab, NDropdown, NSpin } from 'naive-ui'
import { Search, Plus, Delete } from '@icon-park/vue-next'
import MemberCard from './inner/MemberCard.vue'
import UserSearchModal from './inner/UserSearchModal.vue'
import GroupManage from './inner/GroupManage.vue'
import { ServeContactGroupList } from '@/api/contact'
import { ServeGetGroups, ServeGetGroupSortCancel, ServeGetGroupSortGroupSave } from '@/api/group'
import { useFriendsMenu, useEventBus, useInject } from '@/hooks'
import { ContactConst } from '@/constant/event-bus'
import { useTalkStore } from '@/store'
import { useRouter } from 'vue-router'

const router = useRouter()
const talkStore = useTalkStore()
const { dropdown, showDropdownMenu, closeDropdownMenu } = useFriendsMenu()
const { showUserInfoModal } = useInject()
const isShowUserSearch = ref(false)
const isShowGroupModal = ref(false)
const keywords = ref('')
const index = ref(0)
const items = ref([])
const allGroups = ref([])
const groups = ref([])
const currentGroupSortId = ref(null)
const loading = ref(false)
const loadingGroups = ref(false)
const loadingSortedGroups = ref(false)

// Define emits
const emit = defineEmits(['refreshGroups'])

const props = defineProps({
  selectedGroupId: {
    type: Number,
    default: null
  }
})

watch(() => props.selectedGroupId, (newVal) => {
  if (newVal && newVal > 0) {
    currentGroupSortId.value = newVal
    loadAllGroups().then(() => loadSortedGroups())
  } else {
    // 如果没有选择分组，或分组ID为0，则加载所有群组
    currentGroupSortId.value = newVal
    loadContactGroupList()
  }
})

const filter = computed(() => {
  if (keywords.value.length === 0) return items.value
  
  return items.value.filter((item) => {
    let value = item.group_name
    return value.toLowerCase().indexOf(keywords.value.toLowerCase()) !== -1
  })
})

const loadAllGroups = async () => {
  loadingGroups.value = true
  loading.value = true
  
  try {
    const res = await ServeGetGroups()
    
    if (res.code === 200) {
      allGroups.value = res.data.items || []
      return true
    } else {
      window['$message'].error('加载群组数据失败')
      allGroups.value = []
      return false
    }
  } catch (error) {
    window['$message'].error('加载群组数据失败')
    allGroups.value = []
    return false
  } finally {
    loadingGroups.value = false
    if (!loadingSortedGroups.value) loading.value = false
  }
}

const loadContactGroupList = () => {
  loading.value = true
  ServeGetGroups().then((res) => {
    if (res.code == 200) {
      if (res.data && res.data.items) {
        items.value = res.data.items;
      } else {
        items.value = [];
      }
    } else {
      window['$message'].error(res.message || '加载群组数据失败')
      items.value = []
    }
    loading.value = false
  }).catch(error => {
    window['$message'].error('加载群组数据失败')
    items.value = []
    loading.value = false
  })
}

const loadSortedGroups = async () => {
  if (!currentGroupSortId.value) return
  
  loadingSortedGroups.value = true
  loading.value = true
  
  try {
    const sortRes = await ServeGetGroupSortGroupSave({
      group_sort_id: currentGroupSortId.value
    })
    
    if (sortRes.code === 200) {
      const groupIds = Array.isArray(sortRes.data) ? sortRes.data : [];
      
      items.value = allGroups.value.filter(group => 
        groupIds.includes(group.id)
      );
    } else {
      window['$message'].error(sortRes.message || '加载分组数据失败')
      items.value = []
    }
  } catch (error) {
    window['$message'].error('加载分组数据失败')
    items.value = []
  } finally {
    loadingSortedGroups.value = false
    loading.value = false
  }
}

const removeGroupFromSort = async (groupId) => {
  try {
    loading.value = true
    
    const params = {
      group_sort_id: Number(currentGroupSortId.value),
      group_id: Number(groupId)
    }
    
    const res = await ServeGetGroupSortCancel(params)
    
    if (res.code === 200) {
      window['$message'].success('从分组中移除成功')
      
      // 刷新当前分组中的群组列表
      await loadSortedGroups()
      
      // 通知父组件刷新分组列表
      emit('refreshGroups')
      
      // 触发全局事件，通知其他组件刷新
      const event = new CustomEvent('group-list-updated')
      window.dispatchEvent(event)
    } else {
      window['$message'].error(res.message || '移除失败')
    }
  } catch (error) {
    window['$message'].error('移除失败')
  } finally {
    loading.value = false
  }
}



const onToTalk = (item) => {
  talkStore.toTalk(2, item.id, router)
}

const onInfo = (item) => {
  showUserInfoModal(item.id)
}

const onContextMenu = (e, item) => {
  showDropdownMenu(e, item)
  e.preventDefault()
}

const onContextMenuHandle = (key = '') => {
  const events = {
    delete: null
  }

  events[key] && events[key](dropdown.item)
  closeDropdownMenu()
}

const onToolsMenu = (value) => {
  switch (value) {
    case 'add':
      isShowUserSearch.value = true
      break
    case 'group':
      isShowGroupModal.value = true
      break
  }
}

const onChangeRemark = (data) => {
  let item = items.value.find((item) => item.id == data.user_id)
  item && (item.remark = data.remark)
}

onMounted(() => {
  if (props.selectedGroupId && props.selectedGroupId > 0) {
    currentGroupSortId.value = props.selectedGroupId
    loadAllGroups().then(() => loadSortedGroups())
  } else {
    // 如果没有选择分组，或分组ID为0，则加载所有群组
    currentGroupSortId.value = props.selectedGroupId
    loadContactGroupList()
  }
})

useEventBus([{ name: ContactConst.UpdateRemark, event: onChangeRemark }])
</script>

<template>
  <section class="el-container is-vertical height100">
    <header class="el-header from-header bdr-b">
      <div class="groups">
        <n-tabs v-if="groups.length" v-model:value="index">
          <n-tab v-for="tab in groups" :key="tab.id" :name="tab.id">
            {{ tab.name }}({{ tab.count }})
          </n-tab>
        </n-tabs>
      </div>
      <div class="tools">
        <n-space>
          <n-input
            v-model:value.trim="keywords"
            placeholder="搜索"
            clearable
            style="width: 200px"
            round
          >
            <template #prefix>
              <n-icon :component="Search" />
            </template>
          </n-input>

          <!-- <n-dropdown
            :animated="true"
            trigger="hover"
            :show-arrow="false"
            @select="onToolsMenu"
            :options="[
              {
                label: '添加好友',
                key: 'add'
              },
              {
                label: '分组管理',
                key: 'group'
              }
            ]"
          >
            <n-button circle>
              <template #icon>
                <n-icon :component="Plus" />
              </template>
            </n-button>
          </n-dropdown> -->
        </n-space>
      </div>
    </header>

    <main
      id="drawer-target"
      class="el-main pd-10 me-scrollbar me-scrollbar-thumb"
    >
      <div v-if="loading" class="loading-indicator">
        <n-spin size="medium" />
        <span>{{ loadingGroups ? '加载群组数据...' : loadingSortedGroups ? '加载分组数据...' : '加载中...' }}</span>
      </div>
      <div v-else-if="filter.length" class="cards">
        <MemberCard
          v-for="item in filter"
          :key="item.id"
          :avatar="item.avatar"
          :username="item.group_name"
          :gender="item.gender"
          :motto="item.motto"
         
          @click="onInfo(item)"
          @to-talk="onToTalk(item)"
          @contextmenu.prevent="onContextMenu($event, item)"
        >
          <template #action v-if="currentGroupSortId && currentGroupSortId > 0">
            <Delete 
              theme="outline" 
              size="20" 
              class="delete-icon" 
              @click.stop="removeGroupFromSort(item.id)" 
              title="从分组中移除"
            />
          </template>
        </MemberCard>
      </div>
      <div v-else class="empty-state">
        <n-empty size="200" :description="currentGroupSortId ? '当前分组中暂无群组' : '暂无群组数据'">
          <template #icon>
            <img src="@/assets/image/no-data.svg" alt="" />
          </template>
        </n-empty>
      </div>
    </main>

    <UserSearchModal v-model:show="isShowUserSearch" />

    <!-- <GroupManage
      v-if="isShowGroupModal"
      @close="isShowGroupModal = false"
      @relaod="loadContactGroupList"
    />

    <n-dropdown
      :show="dropdown.show"
      :x="dropdown.x"
      :y="dropdown.y"
      :options="dropdown.options"
      @select="onContextMenuHandle"
      @clickoutside="closeDropdownMenu"
    /> -->
  </section>
</template>

<style lang="less" scoped>
.from-header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .groups {
    display: flex;
    align-items: center;
    flex: 1 auto;
    height: 100%;
    margin-right: 30px;
    overflow: hidden;
    padding-left: 15px;
  }

  .tools {
    display: flex;
    align-items: center;
    height: 100%;
    width: 250px;
    flex-shrink: 0;
    padding-right: 10px;
  }
}

#drawer-target {
  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    grid-gap: 12px;
    gap: 12px;
  }
  
  .loading-indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 200px;
    
    span {
      margin-top: 12px;
      color: #999;
    }
  }
  
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 20px;
  }
}

.delete-icon {
  color: #999;
  cursor: pointer;
  transition: color 0.3s;
  
  &:hover {
    color: #f56c6c;
  }
}
</style>
