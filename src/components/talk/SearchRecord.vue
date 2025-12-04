<script lang="ts" setup>
import { ref, reactive } from 'vue'
import Loading from '@/components/base/Loading.vue'
import { DatabaseSearch } from '@icon-park/vue-next'
import * as message from '@/constant/message'
import { ISession } from '@/types/chat'
import { useInject } from '@/hooks'
import { NRadioGroup, NRadioButton, NSplit, NCard, NImage, NButton, NSpace } from 'naive-ui'
import { ServeFindTalkContentRecords, ServeFindTalkInformationRecords, ServeTalkSearchList } from '@/api/chat'
import TalkItem from './TalkItem.vue'

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'locate', session: ISession, mid?: string): void // 示例：两个参数
}>()
 defineProps({
  talkType: {
    type: Number,
    default: 0
  },
  receiverId: {
    type: Number,
    default: 0
  }
})
const { showUserInfoModal } = useInject()
const model = reactive({
  cursor: 0,
  limit: 30,
  type: 0,
  msgType: 0,
  loading: false,
  loadMore: false,
  isLoadMore: false,
  keyword: null
})


const isShow = ref(true)
const items = ref<any>([])
const searchItems = ref<any>([])
const searchItem = ref<any>()
const split = ref<number>(0.4)
const index = ref<number>(0)

const tabs = [
  { name: '搜消息', type: 0 },
  { name: '搜资料', type: 1 },
]

function getFileExtension(url) {
    if (!url) return ''; 
    return url.split('.').pop().toLowerCase(); // 转换为小写以确保兼容性
}

function isImageUrl(url) {
    const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'svg', 'webp', 'tiff']; // 可根据需求添加更多图片格式
    const extension = getFileExtension(url);
    return imageExtensions.includes(extension);
}

const onMaskClick = () => {
  emit('close')
}

const onServeTalkSearchList = () => {
  ServeTalkSearchList({ keyword: model.keyword, type: model.type }).then(
    (res: any) => {
      if (res.code == 200) {
        searchItems.value = res.data.items
      } else {
        searchItems.value = []
      }
    }
  )
}

const onUpdated = (e: any) => {
  model.keyword = e
  model.cursor = 0
  model.loading = false
  index.value = 0
  items.value = []
  onServeTalkSearchList()
}

const onTabTalk = (item: ISession) => {
  index.value = item.id
  searchItem.value = item

  switch(model.type) {
    case 1: // 搜索资料
      {
        let data = {
          keyword: model.keyword,
          enterprise_case_id : searchItem.value.enterprise_case_id,
        }

        if (model.cursor === 0) {
          model.loading = true
        } else {
          model.loadMore = true
        }
        ServeFindTalkInformationRecords(data).then((res) => {
          if (res.code != 200) return

          let list = res.data.records || []
          if (list.length) {
            model.cursor = res.data.cursor
          }

          model.loading = false
          model.loadMore = false
          model.isLoadMore = list.length >= model.limit
          items.value = list
        })
      }
      
      break
    default:
      {
        let data = {
          talk_type: item.talk_type,
          receiver_id: item.receiver_id,
          msg_type: model.msgType,
          cursor: model.cursor,
          limit: model.limit,
          keyword: model.keyword
        }

        if (model.cursor === 0) {
          model.loading = true
        } else {
          model.loadMore = true
        }

        ServeFindTalkContentRecords(data).then((res) => {
          if (res.code != 200) return

          if (data.cursor === 0) {
            items.value = []
          }

          let list = res.data.items || []
          if (list.length) {
            model.cursor = res.data.cursor
          }

          model.loading = false
          model.loadMore = false
          model.isLoadMore = list.length >= model.limit
          items.value = list
        })
      }
      
  }

  
  
}

const onTabTalkLocate = (mid?: string) => {
  
  searchItem.value && emit('locate', searchItem.value, mid)
}

const triggerType = (type: number) => {
  model.type = type
  model.cursor = 0
  items.value = []
}

</script>

<template>
  <n-modal
    v-model:show="isShow"
    preset="card"
    title="全站检索"
    style="max-width: 950px"
    class="modal-radius"
    :on-after-leave="onMaskClick"
    :segmented="{
      content: true
    }"
    :header-style="{
      padding: '20px 15px'
    }"
    :content-style="{
      padding: '0 0 10px'
    }"
  >
    <section class="main-box el-container is-vertical o-hidden">
        <header class="el-header bdr-b search">
            <n-radio-group v-model:value="model.type">
                <n-radio-button
                    v-for="tab in tabs"
                    :key="tab.type"
                    :value="tab.type"
                    @click="triggerType(tab.type)"
                >
                    {{ tab.name }}
                </n-radio-button>
            </n-radio-group>
            <div class="search-input">
                <n-input
                    placeholder="搜索关键字"
                    v-model:value="model.keyword"
                    clearable
                    @clear="onUpdated"
                >
                <template #prefix>
                    <n-icon :component="DatabaseSearch" />
                </template>
            </n-input>      
            </div>
            
            <n-button
                type="primary"
                @click="onServeTalkSearchList"
                style="margin-left: 10px;"
            >
                搜索
            </n-button>
        
        </header>
      <main class="el-main me-scrollbar me-scrollbar-thumb" v-if="searchItems.length > 0">

        <n-split direction="horizontal" :max="0.75" :min="0.25" v-model:size="split">
          <template #1>
            <div class="page-talk-main-box">
              <div class="page-talk-main">
                <TalkItem
                  v-for="item in searchItems"
                  :key="item.id"
                  :data="item"
                  :avatar="item.avatar"
                  :username="item.remark || item.name"
                  :active="item.id == index"
                  @tab-talk="onTabTalk"
                />
              </div>
            </div>
          </template>
          <template #2>
            <main v-if="model.loading" class="el-main flex-center">
              <Loading />
            </main>

            <main v-else class="el-main page-talk-main-box">
              <div v-if="model.type === 1" class="page-card-main">
                <NCard
                  v-for="item in items"
                  :key="item.id"
                  :title="item.name"
                  size="small"
                  class="page-content-card"
                >
                  <NSpace vertical>
                    <div>{{ item.description }}</div>
                    <div>{{ item.record_text }}</div>
                    <NList v-if="item.extra" bordered>
                      <NListItem v-for="(info, index) in item.extra" :key="index">
                        <NSpace align="center" justify="space-between" style="width: 100%;">
                          <NImage class="page-img" v-if="isImageUrl(info.url || info.path)" style="width: 60px; height: 60px;  background-color: #eee; overflow: hidden;" :src="info.url || info.path" />
                          <div>{{ info.name || item.name }}</div>
                          <NButton
                            size="small"
                            tag="a"
                            target="_blank"
                            rel="noopener noreferrer"
                            :href="`https://view.yuesutech.com?fileUrl=${info.url || info.path}`"
                          >
                            预览
                          </NButton>
                        </NSpace>
                      </NListItem>
                    </NList>
                  </NSpace>
                  <template #footer>
                    <div class="page-li-foot">{{ item?.created_at }}</div>
                  </template>
                  <template #action></template>
                </NCard>
              </div>
              <div v-else>
                <div v-for="item in items" :key="item.avatar" class="message-item">
                  <div class="left-box">
                    <im-avatar
                      :src="item.avatar"
                      :size="30"
                      :username="item.nickname"
                      @click="showUserInfoModal(item.user_id)"
                    />
                  </div>

                  <div class="right-box me-scrollbar">
                    <div class="msg-header">
                      <span class="name">{{ item.nickname }}</span>
                      <span class="time"> {{ item.created_at }}</span>
                    </div>

                    <template v-if="item.is_revoke == 1">
                      <div class="msg-content">此消息已被撤回</div>
                    </template>

                    <component
                      v-if="item.is_revoke == 0"
                      :is="message.MessageComponents[item.msg_type] || 'unknown-message'"
                      :extra="item.extra"
                      :data="item"
                      :isSearch="true"
                      :patterns="[model.keyword]"
                      @click="onTabTalkLocate(item?.msg_id)"
                    />
                  </div>
                </div>
              </div>
            </main>
          </template>
        </n-split>


        
      </main>
      <main v-else class="el-main flex-center">
        <n-empty size="200" description="暂无相关数据">
          <template #icon>
            <img src="@/assets/image/no-data.svg" alt="" />
          </template>
        </n-empty>
      </main>
    </section>
  </n-modal>
</template>

<style lang="less" scoped>
.page-talk-main-box {
  height: 100%;
  overflow: auto;
  .page-talk-main{
    padding: 16px 15px 0 15px;
  }
}

.page-card-main{
  padding: 16px;
}
.page-content-card{
  margin-bottom: 10px;
}

.main-box {
  height: 550px;

  .flex-center{
    margin-top: 30px;
  }

  .search {
    display: flex;
    align-items: center;
    padding: 0 15px;
    height: 60px;
    .search-input {
      width: 200px;
      margin-left: 10px;
    }
  }
}

.message-item {
  min-height: 30px;
  display: flex;
  margin-bottom: 5px;
  flex-direction: row;
  padding: 5px 15px;

  &:first-child {
    margin-top: 10px;
  }

  .left-box {
    width: 30px;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    user-select: none;
    padding-top: 8px;
    margin-right: 10px;

    img {
      height: 30px;
      width: 30px;
      border-radius: 3px;
    }
  }

  .right-box {
    width: 100%;
    overflow-x: auto;
    padding: 0px 5px 15px 5px;
    box-sizing: border-box;
    height: fit-content;

    .msg-header {
      height: 30px;
      line-height: 30px;
      font-size: 12px;
      position: relative;
      user-select: none;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}

.more {
  margin: 10px auto 20px;
  width: 150px;
  height: 30px;
}

.talk {
  padding: 8px 10px 8px 5px;
  height: 50px;
  display: flex;
  align-items: center;
  transition: 0.2s ease-in;
  margin: 0px 2px 5px 0;
  border-radius: 5px;

  .avatar-box {
    height: 34px;
    width: 34px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    user-select: none;
    transition: ease 1s;
    position: relative;
    overflow: hidden;

    .top-mask {
      width: 100%;
      height: 100%;
      background-color: rgba(22, 25, 29, 0.6);
      position: absolute;
      top: 0;
      left: 0;
      color: #ffffff;
      display: none;
      align-items: center;
      justify-content: center;
    }

    &:hover .top-mask {
      display: flex;
    }
  }

  .content-box {
    height: 40px;
    display: flex;
    align-content: center;
    flex-direction: column;
    flex: 1 1;
    margin-left: 10px;
    overflow: hidden;

    .header {
      width: 100%;
      height: 20px;
      display: flex;
      align-items: center;

      .title {
        color: #1f2329;
        font-size: 14px;
        line-height: 20px;
        flex: 1 1;
        display: flex;
        overflow: hidden;
        .nickname {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-right: 5px;
        }
      }

      .datetime {
        color: #8f959e;
        font-size: 12px;
        margin-left: 10px;
        user-select: none;
      }
    }

    .content {
      width: 100%;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .text {
        overflow: hidden;
        font-weight: 300;
        font-size: 12px;
        color: #8f959e;
        display: flex;

        .draft {
          color: red;
          padding-right: 3px;
          flex-shrink: 0;
        }

        .online {
          color: #8bc34a;
          padding-right: 3px;
          flex-shrink: 0;
        }

        .detail {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      .tip {
        height: inherit;
        display: flex;
        padding-left: 5px;
        align-items: center;

        .unread {
          color: #8f959e;
          font-size: 12px;
          user-select: none;

          .badge {
            background-color: #f44336;
            color: #ffffff;
            border-radius: 3px;
            transform-origin: right;
          }
        }

        .disturb {
          color: #8f959e;
          font-size: 12px;
          user-select: none;
        }
      }
    }
  }

  --actived-bg: #ececec;

  &:hover,
  &.actived {
    background-color: var(--actived-bg);
  }
}
</style>
