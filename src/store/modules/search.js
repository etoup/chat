import { defineStore } from 'pinia'
import { ServeRemoveRecords, ServeRevokeRecords, ServePublishMessage, ProcessedRecords } from '@/api/chat'
import { ServeGetGroupMembers } from '@/api/group'

// 键盘消息事件定时器
let keyboardTimeout = null

export const useSearchStore = defineStore('search', {
  state: () => {
    return {
      // 对话索引（聊天对话的唯一索引）
      index: 0,

      // 对话节点
      talk: {
        username: '',
        talk_type: 0, // 对话来源[1:私聊;2:群聊]
        receiver_id: 0,
        case_id: 0
      },

      // 好友是否正在输入文字
      keyboard: false,

      // 对方是否在线
      online: false,

      // 聊天记录
      records: [],

      // 新消息提示
      unreadBubble: 0,

      // 是否开启多选操作模式
      isOpenMultiSelect: false,

      // 是否显示编辑器
      isShowEditor: false,

      // 是否显示会话列表
      isShowSessionList: true,

      // 群成员列表
      members: [],

      // 对话记录
      items: {
        '1_1': {
          talk_type: 1, // 对话类型
          receiver_id: 0, // 接收者ID
          read_sequence: 0, // 当前已读的最后一条记录
          records: []
        }
      }
    }
  },
  getters: {
    // 多选列表
    selectItems: (state) => state.records.filter((item) => item.isCheck),
    // 当前对话是否是群聊
    isGroupTalk: (state) => state.talk.talk_type === 2
  },
})
