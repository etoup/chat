<script lang="ts" setup>
import { computed, ref, onMounted, reactive } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'
import { useDialogueStore, useTalkStore, useUserStore } from '@/store'
import { NDropdown, NIcon, NInput, NPopover, NBadge, NPopconfirm, NPopselect } from 'naive-ui'
import { Search, DatabaseSearch } from '@icon-park/vue-next'
import TalkItem from './TalkItem.vue'
import Skeleton from './Skeleton.vue'
import { ServeClearAllTalkUnreadNum, ServeClearTalkUnreadNum } from '@/api/chat'
import GroupLaunch from '@/components/group/GroupLaunch.vue'
import { getCacheIndexName } from '@/utils/talk'
import SearchRecord from '@/components/talk/SearchRecord.vue'
import { ISession } from '@/types/chat'
import { useSessionMenu } from '@/hooks'
import Follow from '@/views/message/inner/Follow.vue'
import { bus } from '@/utils/event-bus'
import { ServeProgressItemSelect, ServeUserClearGroups, ServeUserClearSuperviseGroups } from '@/api/user'
import { addClass, removeClass } from '@/utils/dom'
import GroupModal from '../inner/panel/GroupModal.vue'

const {
  dropdown,
  onContextMenuTalkHandle,
  onContextMenu: onContextMenuTalk,
  onCloseContextMenu,
  onToTopTalk
} = useSessionMenu()
const showGroupManage = ref(false)
const showFollow = ref(false)
const currentGroupItem = ref()
const followGroupItem = ref()
const dialogueStore = useDialogueStore()
const talkStore = useTalkStore()
const isShowGroup = ref(false)
const isShowSearch = ref(false)
const searchKeyword = ref('')
const key = ref(0)
const topItems = computed((): ISession[] => talkStore.topItems)
const headItems = computed((): ISession[] => talkStore.headItems)
const unreadNum = computed(() => talkStore.talkUnreadNum)

const location = reactive({
  msgid: '',
  num: 0
})

const userStore = useUserStore()

const onJumpMessage = (msgid: string) => {
  const element = document.getElementById(msgid)
  if (!element) {
    

    const el = document.getElementById('imChatPanel')

    return el?.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  element?.scrollIntoView({
    behavior: 'smooth'
  })

  addClass(element, 'border')

  setTimeout(() => {
    element && removeClass(element, 'border')
  }, 3000)
}

const items = computed((): ISession[] => {
  if (searchKeyword.value.length === 0) {

    switch (key.value) {
      case 0:
        return talkStore.talkItems
      case 1:
        return talkStore.talkTodayItems
      case 2:
        return talkStore.talkUnreadItems
      case 3:
        return talkStore.talkNoProgressItems
      case 4:
        return talkStore.caseClosedItems
      case 5:
        return talkStore.caseSortItems
      case 6:
        return talkStore.caseSuperviseItems
      default:
        return talkStore.talkProgressItems
    }

  }

  if (key.value === 1) {
    return talkStore.talkTodayItems.filter((item: ISession) => {
      let keyword = item.remark || item.title || item.name
      return keyword.toLowerCase().indexOf(searchKeyword.value.toLowerCase()) != -1
    })
  }

  if (key.value === 2) {
    return talkStore.talkUnreadItems.filter((item: ISession) => {
      let keyword = item.remark || item.title || item.name
      return keyword.toLowerCase().indexOf(searchKeyword.value.toLowerCase()) != -1
    })
  }

  if (key.value === 3) {
    return talkStore.talkNoProgressItems.filter((item: ISession) => {
      let keyword = item.remark || item.title || item.name
      return keyword.toLowerCase().indexOf(searchKeyword.value.toLowerCase()) != -1
    })
  }

  if (key.value === 4) {
    return talkStore.caseClosedItems.filter((item: ISession) => {
      let keyword = item.remark || item.title || item.name
      return keyword.toLowerCase().indexOf(searchKeyword.value.toLowerCase()) != -1
    })
  }

  return talkStore.talkItems.filter((item: ISession) => {
    let keyword = item.remark || item.title || item.name

    return keyword.toLowerCase().indexOf(searchKeyword.value.toLowerCase()) != -1
  })
})

// 列表加载状态
const loadStatus = computed(() => talkStore.loadStatus)

// 当前会话索引
const indexName = computed(() => dialogueStore.index_name)

const value = ref(0)
const options = ref([])

const handleOptions = async () => {
  const res = await ServeProgressItemSelect()
  if (res.code === 200) {
    options.value = res.data.options
  }
}

// 切换会话
const onTabTalk = (item: ISession, follow = false) => {
  console.log('item: ', item)

  if (item.index_name === indexName.value) return

  searchKeyword.value = ''

  // 更新编辑信息
  dialogueStore.setDialogue(item)

  // 清空消息未读数
  if (item.unread_num > 0) {
    ServeClearTalkUnreadNum({
      talk_type: item.talk_type,
      receiver_id: item.receiver_id
    }).then(() => {
      talkStore.updateItem({
        index_name: item.index_name,
        unread_num: 0
      })
    })
  }

  // 设置滚动条跟随
  if (follow) {
    const el = document.getElementById('talk-session-list')
    if (el) {
      let index = talkStore.findTalkIndex(item.index_name)

      el.scrollTo({
        top: index * 66 + index * 5,
        behavior: 'smooth'
      })
    }
  }
}

const onReload = () => {
  talkStore.loadTalkList()
}

// 初始化加载
const onInitialize = () => {
  let index_name = getCacheIndexName()

  index_name && onTabTalk(talkStore.findItem(index_name), true)
}

const onAddGroup = (groupItem = null) => {
  if (groupItem) {
    currentGroupItem.value = groupItem
  } else {
    currentGroupItem.value = null
  }
  showGroupManage.value = true
}

const onTab = (type: number) => {
  key.value = type
  if (type === 0) {
    value.value = 0
  }
}

const onBackTop = () => {
  const el = document.getElementById('talk-session-list')
  if (el) {
    el.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
}

const onBackSort = () => {

}

const onSearchRecordClose = () => {
  isShowSearch.value = false
}

const onSearchRecordLocate = (e: any, mid: string) => {
  // isShowSearch.value = false
  
  if (e) {
    onTabTalk(e, true)
  }
  if (mid) {
    talkStore.onMid(mid)
    setTimeout(() => {
      onJumpMessage(mid)
    }, 2000)
  }
}

const handlePositiveClick = async () => {
  const res: any = await ServeUserClearGroups()
  if (res.code == 200) {
    window.setTimeout(() => {
      onReload()
    }, 500)
  }
}

const handleSupervisePositiveClick = async () => {
  const res: any = await ServeUserClearSuperviseGroups()
  if (res.code == 200) {
    window.setTimeout(() => {
      onReload()
    }, 500)
  }
}

const handleClearAllTalkUnreadNum = async () => {
  const res: any = await ServeClearAllTalkUnreadNum()
  if (res.code == 200) {
    window.setTimeout(() => {
      onReload()
    }, 500)
  }
}

const handleUpdate = async (v: number) => {
  await talkStore.setProgressId(v)
  key.value = -1
}

// 路由更新事件
onBeforeRouteUpdate(onInitialize)

onMounted(() => {
  onInitialize()
  handleOptions()
  bus.subscribe('group:manage:show', (userData) => {
    onAddGroup(userData)
  });
  bus.subscribe('follow:show', (data) => {
    console.log('userData: ', data)
    followGroupItem.value = data
    showFollow.value = true
  });
})
</script>

<template>
  <!-- 右键菜单 -->
  <n-dropdown
    class="dropdown-menus"
    :show="dropdown.show"
    :x="dropdown.x"
    :y="dropdown.y"
    :options="dropdown.options"
    @select="onContextMenuTalkHandle"
    @clickoutside="onCloseContextMenu"
  />

  <section class="el-container is-vertical height100">
    <!-- 工具栏目 -->
    <header class="el-header header-tools">
      <n-input
        placeholder="搜索好友 / 群聊"
        v-model:value.trim="searchKeyword"
        round
        clearable
        style="width: 78%"
      >
        <template #prefix>
          <n-icon :component="Search" />
        </template>
      </n-input>

      <n-button circle @click="isShowSearch = true">
        <template #icon>
          <n-icon :component="DatabaseSearch" />
        </template>
      </n-button>
    </header>

    <!-- 置顶栏目 -->
    <header class="el-header header-top" v-show="loadStatus == 3 && topItems.length > 0">
      <n-popover v-for="item in topItems" :key="item.index_name" placement="bottom" trigger="hover">
        <template #trigger>
          <div
            class="top-item pointer"
            @click="onTabTalk(item, true)"
            :class="{
              active: item.index_name == indexName
            }"
          >
            <n-badge v-if="item.unread_num > 0" dot processing>
              <im-avatar :src="item.avatar" :size="34" :username="item.name" />
            </n-badge>
            <n-badge v-else>
              <im-avatar :src="item.avatar" :size="34" :username="item.name" />
            </n-badge>
            <span class="icon-mark robot" v-show="item.is_robot == 1"> 助 </span>

            <span class="icon-mark group" v-show="item.talk_type == 2 && item.is_robot == 0">
              群
            </span>
            <span class="text">{{ item.remark || item.title || item.name }}</span>
          </div>
        </template>
        <span> {{ item.remark || item.title || item.name }} </span>
      </n-popover>
    </header>

    <!-- 标题栏目 -->
    <div>
      <header
        v-show="loadStatus == 3 && talkStore.talkItems.length > 0"
        class="el-header header-badge"
        :class="{ shadow: false }"
      >
        <div class="header-badge-left">
          <n-space :size="5">
            <n-popselect v-model:value="value" :options="options" @update:value="handleUpdate">
              <n-button
                strong
                secondary
                round
                :type="key === 0 ? 'info' : 'default'"
                size="tiny"
                @click="onTab(0)"
                >
                  全部 {{ talkStore.talkItems.length }} 
                </n-button>
            </n-popselect>
            
            <n-button
              strong
              secondary
              round
              :type="key === 1 ? 'info' : 'default'"
              size="tiny"
              @click="onTab(1)"
              >今日 {{ talkStore.talkTodayItems.length }}</n-button
            >
            <n-button
              strong
              secondary
              round
              :type="key === 2 ? 'info' : 'default'"
              size="tiny"
              @click="unreadNum > 0 && onTab(2)"
              >未读 {{ talkStore.talkUnreadItems.length }}</n-button
            >
            <n-button
              strong
              secondary
              round
              :type="key === 3 ? 'info' : 'default'"
              size="tiny"
              @click="onTab(3)"
              >未标 {{ talkStore.talkNoProgressItems.length }}</n-button
            >
            <n-button
              strong
              secondary
              round
              :type="key === 6 ? 'info' : 'default'"
              size="tiny"
              @click="onTab(6)"
              > 
              <span>督查</span>
              <span style="margin-left: 3px;"> {{ talkStore.caseSuperviseItems.length }} </span>
              <n-popconfirm @positive-click="handleSupervisePositiveClick">
                <template #trigger>
                  <div class="delete-all">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      viewBox="0 0 1024 1024"
                    >
                      <path
                        d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448s448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372s372 166.6 372 372s-166.6 372-372 372z"
                        fill-opacity=".8"
                        fill="currentColor"
                      ></path>
                      <path
                        d="M512 140c-205.4 0-372 166.6-372 372s166.6 372 372 372s372-166.6 372-372s-166.6-372-372-372zm171.8 527.1c1.2 1.5 1.9 3.3 1.9 5.2c0 4.5-3.6 8-8 8l-66-.3l-99.3-118.4l-99.3 118.5l-66.1.3c-4.4 0-8-3.6-8-8c0-1.9.7-3.7 1.9-5.2L471 512.3l-130.1-155a8.32 8.32 0 0 1-1.9-5.2c0-4.5 3.6-8 8-8l66.1.3l99.3 118.4l99.4-118.5l66-.3c4.4 0 8 3.6 8 8c0 1.9-.6 3.8-1.8 5.2l-130.1 155l129.9 154.9z"
                        fill-opacity=".1"
                        fill="currentColor"
                      ></path>
                      <path
                        d="M685.8 352c0-4.4-3.6-8-8-8l-66 .3l-99.4 118.5l-99.3-118.4l-66.1-.3c-4.4 0-8 3.5-8 8c0 1.9.7 3.7 1.9 5.2l130.1 155l-130.1 154.9a8.32 8.32 0 0 0-1.9 5.2c0 4.4 3.6 8 8 8l66.1-.3l99.3-118.5L611.7 680l66 .3c4.4 0 8-3.5 8-8c0-1.9-.7-3.7-1.9-5.2L553.9 512.2l130.1-155c1.2-1.4 1.8-3.3 1.8-5.2z"
                        fill-opacity=".8"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </div>
                </template>
                确认要清理所有转督查的群会话吗？
              </n-popconfirm>
            </n-button>
            <n-button
              strong
              secondary
              round
              :type="key === 4 ? 'info' : 'default'"
              size="tiny"
              @click="onTab(4)"
              > 
              <span>结案</span>
              <span style="margin-left: 3px;"> {{ talkStore.caseClosedItems.length }} </span>
              <n-popconfirm @positive-click="handlePositiveClick">
                <template #trigger>
                  <div class="delete-all">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      viewBox="0 0 1024 1024"
                    >
                      <path
                        d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448s448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372s372 166.6 372 372s-166.6 372-372 372z"
                        fill-opacity=".8"
                        fill="currentColor"
                      ></path>
                      <path
                        d="M512 140c-205.4 0-372 166.6-372 372s166.6 372 372 372s372-166.6 372-372s-166.6-372-372-372zm171.8 527.1c1.2 1.5 1.9 3.3 1.9 5.2c0 4.5-3.6 8-8 8l-66-.3l-99.3-118.4l-99.3 118.5l-66.1.3c-4.4 0-8-3.6-8-8c0-1.9.7-3.7 1.9-5.2L471 512.3l-130.1-155a8.32 8.32 0 0 1-1.9-5.2c0-4.5 3.6-8 8-8l66.1.3l99.3 118.4l99.4-118.5l66-.3c4.4 0 8 3.6 8 8c0 1.9-.6 3.8-1.8 5.2l-130.1 155l129.9 154.9z"
                        fill-opacity=".1"
                        fill="currentColor"
                      ></path>
                      <path
                        d="M685.8 352c0-4.4-3.6-8-8-8l-66 .3l-99.4 118.5l-99.3-118.4l-66.1-.3c-4.4 0-8 3.5-8 8c0 1.9.7 3.7 1.9 5.2l130.1 155l-130.1 154.9a8.32 8.32 0 0 0-1.9 5.2c0 4.4 3.6 8 8 8l66.1-.3l99.3-118.5L611.7 680l66 .3c4.4 0 8-3.5 8-8c0-1.9-.7-3.7-1.9-5.2L553.9 512.2l130.1-155c1.2-1.4 1.8-3.3 1.8-5.2z"
                        fill-opacity=".8"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </div>
                </template>
                确认要清理所有已结案的群会话吗？
              </n-popconfirm>
            </n-button>
            
          </n-space>

          <n-popconfirm @positive-click="handleClearAllTalkUnreadNum">
            <template #trigger>
              <div class="badge unread" v-show="unreadNum">{{ unreadNum }}未读</div>
            </template>
            确认要清理所有未读消息吗？
          </n-popconfirm>
        </div>
      </header>
      <main class="el-main me-scrollbar me-scrollbar-thumb">
        <template v-if="loadStatus == 2"><Skeleton /></template>
        <template v-else>
          <div class="back-sort" @click="onTab(5)" v-if="userStore.roles.includes('director') || userStore.roles.includes('ajjd')">
            <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z" fill="#ddd" stroke="#ddd" stroke-width="4" stroke-linejoin="round"/><path d="M20 20L24 16L28 20" stroke="#FFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 28L24 32L28 28" stroke="#FFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="back-top" @click="onBackTop">
            <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z" fill="#ddd" stroke="#ddd" stroke-width="4" stroke-linejoin="round"/><path d="M24 33.5V15.5" stroke="#FFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M33 24.5L24 15.5L15 24.5" stroke="#FFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
        </template>
      </main>
    </div>
    <div class="me-scrollbar-container">
      <main  class="el-main me-scrollbar me-scrollbar-thumb assistant-container">
        <template v-if="loadStatus == 2"><Skeleton /></template>
        <template v-else>
          <TalkItem
            v-for="item in headItems"
            :key="item.index_name"
            :data="item"
            :avatar="item.avatar"
            :username="item.remark || item.title || item.name"
            :active="item.index_name == indexName"
            @tab-talk="onTabTalk"
            @top-talk="onToTopTalk"
            @contextmenu.prevent="onContextMenuTalk($event, item)"
          />
        </template>
      </main>
    </div>


    <main id="talk-session-list" class="el-main me-scrollbar me-scrollbar-thumb page-scrollbar">
      <template v-if="loadStatus == 2"><Skeleton /></template>
      <template v-else>
        <TalkItem
          v-for="item in items"
          :key="item.index_name"
          :data="item"
          :avatar="item.avatar"
          :username="item.remark || item.title || item.name"
          :active="item.index_name == indexName"
          :show-total="userStore.roles.includes('director') || userStore.roles.includes('ajjd')"
          @tab-talk="onTabTalk"
          @top-talk="onToTopTalk"
          @contextmenu.prevent="onContextMenuTalk($event, item)"
        />
      </template>
    </main>
  </section>

  <GroupLaunch v-if="isShowGroup" @close="isShowGroup = false" @on-submit="onReload" />

  <SearchRecord
    v-if="isShowSearch"
    :talk-type="2"
    :receiver-id="23"
    @close="onSearchRecordClose"
    @locate="onSearchRecordLocate"
  />

  <GroupModal v-model:show="talkStore.isShowGroupModal" />

  <Follow v-model:visible="showFollow" :item="followGroupItem" />
</template>

<style lang="less" scoped>
.me-scrollbar-container{
  padding-right: 8px;
}
.header-tools {
  height: 60px;
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  padding: 0 8px;
}

.header-badge {
  height: 38px;
  padding-left: 15px;
  padding-right: 5px;
  display: flex;
  align-items: center;
  .header-badge-left {
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1;
    .delete-all {
      height: 15px;
      width: 15px;
      color: rgba(0, 0, 0, 0.3);
      margin-left: 5px;
    }
  }
  &.shadow {
    box-shadow: 0 2px 6px 0 rgb(31 35 41 / 5%);
  }

  .unread {
    background-color: #ff4d4f;
    color: white;
    cursor: pointer;
  }
}

.header-top {
  padding: 5px 8px;
  padding-right: 0;
  padding-right: 8px;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  grid-gap: 0 14px;
  grid-template-columns: repeat(auto-fill, 32px);
  display: grid;
  box-sizing: border-box;

  .top-item {
    flex-basis: 46px;
    flex-shrink: 0;
    height: 56px;
    margin: 3px 2px 3px 2px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    position: relative;

    .icon-mark {
      position: absolute;
      height: 25px;
      width: 25px;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      right: -12px;
      bottom: 15px;
      transform: scale(0.6);
      border-radius: 50%;

      &.group {
        color: #3370ff;
        background-color: #e1eaff;
      }

      &.robot {
        color: #dc9b04 !important;
        background-color: #faf1d1 !important;
      }
    }
    &.active {
      .text {
        color: rgb(80 138 254);
      }
    }

    .text {
      display: inline-block;
      height: 20px;
      font-size: 12px;
      transform: scale(0.9);
      text-align: center;
      line-height: 20px;
      word-break: break-all;
      overflow: hidden;
    }
  }
}

html[theme-mode='dark'] {
  .header-badge {
    &.shadow {
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    }
  }
}

.back-sort{
  position: absolute;
  right: 5px;
  bottom: 30px;
  cursor: pointer;
}

.back-top {
  position: absolute;
  right: 5px;
  bottom: 5px;
  cursor: pointer;
}

#talk-session-list {
  // 滚动条样式 
  &::-webkit-scrollbar {
    width: 8px;
    height: 20px;
  }

  // &::-webkit-scrollbar-thumb {
  //   background-color: rgba(0, 0, 0, 0.2);
  //   border-radius: 4px;   
  // }
}
</style>
