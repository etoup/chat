import { reactive } from 'vue'
import { parseDate } from '@/utils/datetime'

interface IDropdown {
  options: any[]
  show: boolean
  x: number
  y: number
  item: any
}

const isRevoke = (uid: any, item: any): boolean => {
  if (uid != item.user_id) {
    return false
  }

  const time = new Date().getTime() - parseDate(item.created_at).getTime()

  return Math.floor(time / 1000 / 60) <= 2
}

export function useMenu() {
  const dropdown: IDropdown = reactive({
    options: [],
    show: false,
    x: 0,
    y: 0,
    item: {}
  })

  const showDropdownMenu = (e: any, uid: number, item: any) => {
    dropdown.item = Object.assign({}, item)

    dropdown.options = []
    if ([4].includes(item.msg_type)) {
      dropdown.options.push({ label: '转译', key: 'voice' })
    }
    if ([1, 3].includes(item.msg_type)) {
      dropdown.options.push({ label: '复制', key: 'copy' })
    }

    if (isRevoke(uid, item)) {
      dropdown.options.push({ label: `撤回`, key: 'revoke' })
    }

    dropdown.options.push({ label: '回复', key: 'quote' })
    dropdown.options.push({ label: '删除', key: 'delete' })

    dropdown.options.push({ label: '多选', key: 'multiSelect' })

    if ([3, 4, 5].includes(item.msg_type)) {
      dropdown.options.push({ label: '下载', key: 'download' })
    }

    if ([3].includes(item.msg_type)) {
      dropdown.options.push({ label: '收藏', key: 'collect' })
    }
    dropdown.options.push({ label: '收集', key: 'gather' })

    dropdown.x = e.clientX
    dropdown.y = e.clientY
    dropdown.show = true
  }

  const closeDropdownMenu = () => {
    dropdown.show = false
    dropdown.item = {}
  }

  return { dropdown, showDropdownMenu, closeDropdownMenu }
}
