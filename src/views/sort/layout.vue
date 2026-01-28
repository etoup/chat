<script lang="ts" setup>
defineOptions({ name: 'ContactLayout' })
import { reactive, markRaw, onMounted } from 'vue'
import SubViewLayout from '@/layout/SubViewLayout.vue'
import {  Peoples } from '@icon-park/vue-next'
import { ServeGetGroupList, ServeGetGroups } from '@/api/group'

const menus = reactive([
  {
    name: '全部群组',
    path: '/sort/group',
    icon: markRaw(Peoples),
    tips: ''
  },
])

const loadMenus = async () => {
  const res = await ServeGetGroupList({})
  if (res.code === 200) {
    const list = (res.data.items || []).map((it: any) => ({
      name: it.name,
      path: `/sort/group?sort_id=${it.id}`,
      icon: markRaw(Peoples),
      tips: String(it.count || '')
    }))
    menus.splice(1, menus.length - 1, ...list)
  }

  const result = await ServeGetGroups() 
  if (result.code === 200) {
    const allCount = result.data.items?.length || 0
    menus[0].tips = String(allCount)
  }
}

onMounted(loadMenus)
</script>

<template>
  <SubViewLayout title="群分组" :menus="menus">
    <template #action>
    </template>
  </SubViewLayout>
</template>
