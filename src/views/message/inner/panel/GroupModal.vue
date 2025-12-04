<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { FormInst, FormRules } from 'naive-ui'
import { NModal, NGrid, NGridItem, NForm, NFormItem, NInput, NButton, NTag, NSpace, NPopconfirm, NSpin, NEmpty } from 'naive-ui'
import { useTalkStore } from '@/store'
// import { fetchGroupSortCreate, fetchGroupSortDelete, fetchGroupMemberSortList, fetchGroupMemberSortBind, fetchGroupMemberSortUnbind } from '@/apis/api'
import { ServeGetGroupList, ServeGetGroupSave, ServeGetGroupDelete, ServeGetGroupSortSet, ServeGetGroupSortCancel } from '@/api/group'

const talkStore = useTalkStore()
const group = computed(() => talkStore.groupModalItem)
const visible = computed({
    get: () => talkStore.isShowGroupModal,
    set: (value: boolean) => {
        talkStore.showGroupModal(value)
    }
})

const loading = ref(false)
const sorts = ref<any[]>([])
const form = ref<{ name: string; description: string; sort: string }>({ name: '', description: '', sort: '' })
const formRef = ref<FormInst | null>(null)
const rules: FormRules = {
  name: [
    { required: true, message: '请输入分组名称', trigger: ['input', 'blur'] }
  ]
}

const loadList = async () => {
  // const gid = group.value?.to_from_id || 0
  // const [err, data] = await fetchApi(fetchGroupMemberSortList, { group_id: gid }, { loading })
  // if (err) return
  // sorts.value = data.items || []
  const res = await ServeGetGroupList({group_id: group.value?.receiver_id || 0})
  
  if (res.code === 200) {
    sorts.value = res.data.items || []  
  }
}

const onCreate = async () => {
  try {
    await formRef.value?.validate()
  } catch {
    return
  }
  const name = form.value.name?.trim()
  const description = form.value.description?.trim()
  const sortStr = String(form.value.sort ?? '').trim()
  const payload: any = { name }
  if (description) payload.description = description
  if (sortStr) {
    const sortNum = Number(sortStr)
    if (!Number.isNaN(sortNum)) payload.sort = sortNum
  }

  const res = await ServeGetGroupSave(payload)
  if (res.code === 200) {
    form.value = { name: '', description: '', sort: '' }
    await loadList()    
  }
}

const onDelete = async (id: number) => {
  const res = await ServeGetGroupDelete({ keys: [id] })
  if (res.code === 200) {
    await loadList()    
  }
}

const onSelect = async (it: any) => {
  const res = await ServeGetGroupSortSet({
    group_id: group.value?.receiver_id || 0,
    group_sort_id: it.id
  })
  if (res.code === 200) {
    await loadList()  
  }
}

const onUnbind = async (it: any) => {
  const res = await ServeGetGroupSortCancel({
    group_id: group.value?.receiver_id || 0,
    group_sort_id: it.id
  })
  if (res.code === 200) {
    await loadList()
  }
}

watch(() => talkStore.isShowGroupModal, (v) => { if (v) loadList() })

</script>

<template>
    <NModal
        v-model:show="visible"
        display-directive="show"
        preset="card"
        class="page-modal"
        :title="(group?.remark || group?.name) ? `${(group?.remark || group?.name)}-添加群组` : '添加群组'"
        :style="{ width: '780px', backgroundColor: '#f9f9f9' }"
        closable
    >
    <NGrid cols="8" x-gap="12" item-responsive responsive="screen">
      <NGridItem span="8 m:8 l:5">
        <div class="page-main">
          <div class="page-main-card">
            <div class="page-main-card-main">
              <div class="page-main-card-title">分组列表</div>
              <div class="page-content-card">
                <n-spin :show="loading">
                  <div v-if="!sorts.length" class="page-remark"><n-empty description="暂无分组" /></div>
                  <div v-else>
                    <div v-for="it in sorts" :key="it.id" class="sort-item">
                      <div class="sort-item-left">
                        <div style="display: flex; align-items: center">
                          <div class="sort-name">{{ it.name }}</div>
                          <n-tag size="small" type="info" :bordered="false" style="margin-left: 10px">{{ it.count }}</n-tag>
                        </div>
                        <div class="sort-desc">{{ it.description }}</div>
                      </div>
                      <div class="sort-item-right">
                        <n-space size="small">
                          <n-button v-if="!it.bound" size="small" tertiary @click="onSelect(it)">选择</n-button>
                          <n-button v-else size="small" type="warning" tertiary @click="onUnbind(it)">取消绑定</n-button>
                          <n-popconfirm @positive-click="onDelete(it.id)" positive-text="确定" negative-text="取消">
                            <template #default>确定删除该分组？</template>
                            <template #trigger>
                              <n-button size="small" type="error">删除</n-button>
                            </template>
                          </n-popconfirm>
                        </n-space>
                      </div>
                    </div>
                  </div>
                </n-spin>
              </div>
            </div>
          </div>
        </div>
      </NGridItem>
      <NGridItem span="8 m:8 l:3">
        <div class="page-main">
          <div class="page-main-card">
            <div class="page-main-card-main">
              <div class="page-main-card-title">新增分组</div>
              <n-form ref="formRef" :model="form" :rules="rules" size="small">
                <n-form-item path="name" label="分组名称">
                  <n-input v-model:value="form.name" size="medium" clearable placeholder="分组名称" />
                </n-form-item>
                <n-form-item path="description" label="分组描述">
                  <n-input v-model:value="form.description" size="medium" clearable placeholder="分组描述" />
                </n-form-item>
                <n-form-item path="sort" label="排序">
                  <n-input v-model:value="form.sort" size="medium" clearable placeholder="排序（越小越靠前）" />
                </n-form-item>
                <n-space>
                  <n-button size="medium" type="primary" :loading="loading" @click="onCreate">创建分组</n-button>
                </n-space>
              </n-form>
            </div>
          </div>
        </div>
      </NGridItem>
    </NGrid>
  </NModal>
</template>

<style scoped>
.page-content-card{
  margin-top: 5px;
}
.page-card {
  width: 780px;
  padding: 6px 0;
  background-color: #f5f5f5;
}
.page-main {
  height: calc(100vh - 500px);
  overflow-y: auto;
}
.page-main-card {
    background-color: #fff;
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 12px;
    .page-main-card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      .page-main-card-top-left {
        font-size: 14px;
        font-weight: 600;
      }
      .page-main-card-top-right {
        font-size: 12px;
        color: #666;
      }
    }
    .page-main-card-title{
      font-size: 16px;
      color: #333;
      font-weight: 600;
      margin-bottom: 8px;
    }
    .page-main-card-main {
      .page-main-card-main-tag {
        display: flex;
        align-items: center;
        margin-right: 8px;
        font-size: 13px;
        .page-main-card-main-tag-span {
          margin-left: 5px;
        }
      }
    }
  }
  .page-main-card:last-child {
    margin-bottom: 0;
  }
  .page-title{
    font-size: 13px;
    color: #333;
    font-weight: 600;
  }
  .page-remark{
    font-size: 12px;
    color: #666;
    font-weight: 400;
    margin: 6px 0;
    background-color: #f5f5f5;
    padding: 15px 8px;
    border-radius: 6px;
  }
  .page-foot{
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #ccc;
  }
  .sort-item{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #f0f0f0;
  }
  .sort-item:last-child{
    border-bottom: none;
  }
  .sort-name{
    font-size: 13px;
    font-weight: 600;
    color: #333;
  }
  .sort-desc{
    font-size: 12px;
    color: #8a8a8a;
  }
</style>
