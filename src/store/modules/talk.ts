import { defineStore } from 'pinia'
import { ServeGetTalkList, ServeCreateTalkList } from '@/api/chat'
import { formatTalkItem, ttime, KEY_INDEX_NAME } from '@/utils/talk'
import { useEditorDraftStore } from './editor-draft'
import { ISession } from '@/types/chat'

interface TalkStoreState {
  loadStatus: number
  items: ISession[]
  mid: string
  pid: number,
  isShowGroupModal: boolean
  groupModalItem: ISession | null
  isShowRhetoricModal: boolean
  rhetoricModalItem: ISession | null
  isShowMaterialModal: boolean
  materialModalItem: ISession | null
}

export const useTalkStore = defineStore('talk', {
  state: (): TalkStoreState => {
    return {
      // 加载状态[1:未加载;2:加载中;3:加载完成;4:加载失败;]
      loadStatus: 2,

      // 会话列表
      items: [],

      mid: '',

      pid: 0,

      isShowGroupModal: false,
      groupModalItem: null as ISession | null,

      isShowRhetoricModal: false,
      rhetoricModalItem: null as ISession | null,

      isShowMaterialModal: false,
      materialModalItem: null as ISession | null,
    }
  },
  getters: {

    headItems: (state) => {
      return state.items.filter((item: ISession) => item.is_robot == 1)
    },
    // 过滤所有置顶对话列表
    topItems: (state) => {
      return state.items.filter((item: ISession) => item.is_top == 1)
    },

    // 对话列表
    talkItems: (state) => {
      // return state.items.sort((a, b) => {
      //   return ttime(b.updated_at) - ttime(a.updated_at)
      // })
      return state.items.filter((item: ISession) => item.is_robot != 1).sort((a, b) => b.unread_num - a.unread_num).sort((a, b) => ttime(b.updated_at) - ttime(a.updated_at))
      // return state.items.filter((item: ISession) => item.is_robot != 1).sort((a, b) => b.unread_num - a.unread_num).sort((a, b) => ttime(b.updated_at) - ttime(a.updated_at))
      // return state.items.filter((item: ISession) => item.is_robot != 1).sort((a, b) => ttime(b.created_at) - ttime(a.created_at))
    },

    talkUnreadItems: (state) => {
      return state.items.filter((item: ISession) => item.is_robot === 0 && item.unread_num != 0).sort((a, b) => b.unread_num - a.unread_num).sort((a, b) => ttime(b.updated_at) - ttime(a.updated_at))
    },

    talkNoProgressItems: (state) => {
      return state.items.filter((item: ISession) => item.is_robot === 0 && item.case_progress === 0).sort((a, b) => b.unread_num - a.unread_num).sort((a, b) => ttime(b.updated_at) - ttime(a.updated_at))
    },

    talkProgressItems: (state) => {
      return state.items.filter((item: ISession) => item.is_robot === 0 && item.case_progress === state.pid).sort((a, b) => b.unread_num - a.unread_num).sort((a, b) => ttime(b.updated_at) - ttime(a.updated_at))
    },

    talkTodayItems: (state) => {
      return state.items.filter((item: ISession) => item.is_robot === 0 && item.is_today).sort((a, b) => b.unread_num - a.unread_num).sort((a, b) => ttime(b.updated_at) - ttime(a.updated_at))
    },

    caseClosedItems: (state) => {
      return state.items.filter((item: ISession) => item.is_robot === 0 && item.case_status == 10).sort((a, b) => b.unread_num - a.unread_num).sort((a, b) => ttime(b.updated_at) - ttime(a.updated_at))
    },

    caseSuperviseItems: (state) => {
      return state.items.filter((item: ISession) => item.is_robot === 0 && item.case_status == 7).sort((a, b) => b.unread_num - a.unread_num).sort((a, b) => ttime(b.updated_at) - ttime(a.updated_at))
    },

    caseSortItems: (state) => {
      return state.items.filter((item: ISession) => item.is_robot === 0).sort((a, b) => a.service_ratio - b.service_ratio)
    },

    // 消息未读数总计
    talkUnreadNum: (state) => {
      return state.items.reduce((total: number, item: ISession) => {
        return total + item.unread_num
      }, 0)
    }
  },
  actions: {

    showGroupModal(e: boolean) {
      this.isShowGroupModal = e
      if (!e) this.groupModalItem = null
    },

    setGroupModalItem(item: ISession | null) {
      this.groupModalItem = item
    },

    showRhetoricModal(e: boolean) {
      this.isShowRhetoricModal = e
      if (!e) this.rhetoricModalItem = null
    },

    setRhetoricModalItem(item: ISession | null) {
      this.rhetoricModalItem = item
    },

    showMaterialModal(e: boolean) {
      this.isShowMaterialModal = e
      if (!e) this.materialModalItem = null
    },

    setMaterialModalItem(item: ISession | null) {
      this.materialModalItem = item
    },

    setProgressId(pid: number) {
      console.log('setProgressId', pid)
      this.pid = pid
    },

    onMid (mid: string) {
      this.mid = mid
    },

    findItem(index_name: string) {
      return this.items.find((item: ISession) => item.index_name === index_name) as ISession
    },

    // 更新对话节点
    updateItem(params: any) {
      const item = this.items.find((item) => item.index_name === params.index_name)

      item && Object.assign(item, params)
    },

    // 新增对话节点
    addItem(params: any) {
      this.items = [params, ...this.items]
    },

    // 移除对话节点
    delItem(index_name: string) {
      const i = this.items.findIndex((item) => item.index_name === index_name)

      if (i >= 0) {
        this.items.splice(i, 1)
      }

      this.items = [...this.items]
    },

    // 更新对话消息
    updateMessage(params: any) {
      const item = this.items.find((item) => item.index_name === params.index_name)

      console.log('item', item)
      console.log('params', params)
     
      if (item) {
        if (item.is_disturb === 0) {
          item.unread_num++
        }
        
        // item.msg_text = params.msg_text
        item.updated_at = params.updated_at
      }
    },

    // 更新联系人备注
    setRemark(params: any) {
      const item = this.items.find((item) => item.index_name === `1_${params.user_id}`)

      item && (item.remark = params.remark)
    },

    // 加载会话列表
    loadTalkList() {
      this.loadStatus = 2

      const resp = ServeGetTalkList()

      resp.then(({ code, data }) => {
        if (code == 200) {
          this.items = data.items.map((item: any) => {
            const value = formatTalkItem(item)

            const draft = useEditorDraftStore().items[value.index_name]
            if (draft) {
              value.draft_text = JSON.parse(draft).text || ''
            }

            if (value.is_robot == 1) {
              value.is_online = 1
            }

            return value
          })

          this.loadStatus = 3
        } else {
          this.loadStatus = 4
        }
      })

      resp.catch(() => {
        this.loadStatus = 4
      })
    },

    findTalkIndex(index_name: string) {
      return this.items.findIndex((item: ISession) => item.index_name === index_name)
    },

    toTalk(talk_type: number, receiver_id: number, router: any) {
      const route = {
        path: '/message',
        query: {
          v: new Date().getTime()
        }
      }

      if (this.findTalkIndex(`${talk_type}_${receiver_id}`) >= 0) {
        sessionStorage.setItem(KEY_INDEX_NAME, `${talk_type}_${receiver_id}`)
        return router.push(route)
      }

      ServeCreateTalkList({
        talk_type,
        receiver_id
      }).then(({ code, data, message }) => {
        if (code == 200) {
          if (this.findTalkIndex(`${talk_type}_${receiver_id}`) === -1) {
            this.addItem(formatTalkItem(data))
          }

          sessionStorage.setItem(KEY_INDEX_NAME, `${talk_type}_${receiver_id}`)
          return router.push(route)
        } else {
          window['$message'].info(message)
        }
      })
    }
  }
})
