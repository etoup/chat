<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { FormInst, FormRules } from 'naive-ui'
import { NModal, NGrid, NGridItem, NForm, NFormItem, NInput, NButton, NRadioButton, NSpace, NRadioGroup, NPopconfirm, NEmpty } from 'naive-ui'
import { useTalkStore } from '@/store'
import { PhraseList, PhraseRemove, PhraseSave } from '@/api/case'

const emit = defineEmits(['on-submit'])

const talkStore = useTalkStore()
const visible = computed({
    get: () => talkStore.isShowRhetoricModal,
    set: (value: boolean) => {
        talkStore.showRhetoricModal(value)
    }
})
const model = reactive({
  lang: '',
  content: '',
  url: '',
  files: [],
  images: []
})
const typeItems = [
  {
    value: '1',
    label: '自用常用语'
  },
  {
    value: '2',
    label: '通用常用语'
  },
]
const active = ref('1')
const loading = ref(false)
const items = ref<any[]>([])
const form = ref<{ content: string; remark: string; sort: string }>({ content: '', remark: '', sort: '' })
const formRef = ref<FormInst | null>(null)
const rules: FormRules = {
  content: [
    { required: true, message: '请输入分组名称', trigger: ['input', 'blur'] }
  ]
}

const loadList = async () => {
  const res = await PhraseList({type:  Number(active.value)})
  if (res.code === 200) {
    items.value = res.data.records || []  
  }
}

const onCreate = async () => {
  try {
    await formRef.value?.validate()
  } catch {
    return
  }
  const content = form.value.content?.trim()
  const remark = form.value.remark?.trim()
  const sortStr = String(form.value.sort ?? '').trim()
  const payload: any = { content }
  if (remark) payload.remark = remark
  if (sortStr) {
    const sortNum = Number(sortStr)
    if (!Number.isNaN(sortNum)) payload.sort = sortNum
  }
  payload.type = 1
  const res = await PhraseSave(payload)
  if (res.code === 200) {
    form.value = { content: '', remark: '', sort: '' }
    await loadList()    
  }
}

const onSend = async (content:string) => {
  let data = {
    content
  }
  if (model.lang == 'json') {
    try {
      data.content = JSON.stringify(JSON.parse(model.content), null, 2)
    } catch (error) {
      data.content = model.content
    }
  }
  emit('on-submit', { ...data, content })
}

const onChange = (val: string) => {
  active.value = val
  loadList()
}

const onRemove = async (id) => {
  try {
    const res = await PhraseRemove({ keys: [id] })
    if (res.code == 200) {
      loadList()
      window['$message'].success('删除成功')
    } else {
      window['$message'].error(res.message || '删除失败')
    }
  } catch (error) {
    window['$message'].error('操作失败')
  }
}

watch(() => talkStore.isShowRhetoricModal, (v) => { if (v) loadList() })

</script>

<template>
    <NModal
      v-model:show="visible"
      preset="card"
      class="page-modal"
      :style="{ width: '780px', backgroundColor: '#f9f9f9' }"
      closable
    >
    <template #header>
      <n-radio-group v-model:value="active" name="group" @update:value="onChange">
        <n-radio-button
          v-for="item in typeItems"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        />
      </n-radio-group>
    </template>
    <NGrid cols="8" x-gap="12" item-responsive responsive="screen">
      <NGridItem span="8 m:8 l:5">
        <div class="page-main">
          <div class="page-main-card">
            <div class="page-main-card-main">
              <div class="page-content-card">
                <div v-if="!items.length" class="page-remark"><n-empty description="暂无常用语" /></div>
                <div v-else>
                  <div v-for="item in items" :key="item.id" class="page-item">
                    <div class="page-item-content">
                      <n-ellipsis expand-trigger="click" line-clamp="3" :tooltip="false">
                        {{ item.content }}
                      </n-ellipsis>
                    </div>
                    <div v-if="item.remark" class="page-item-remark">{{ item.remark }}</div>
                    <div class="page-item-opt">
                      <n-space>
                        <n-popconfirm 
                          v-if="item.type === 1 || active === '1'" 
                          @positive-click="onRemove(item.id)"
                        >
                          <template #trigger>
                            <n-button secondary type="error" size="small">删除</n-button>
                          </template>
                          确认删除该常用语吗？
                        </n-popconfirm>
                        <n-button secondary type="info" size="small" @click="onSend(item.content)">
                          发送
                        </n-button>
                      </n-space>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </NGridItem>
      <NGridItem span="8 m:8 l:3">
        <div class="page-main">
          <div class="page-main-card">
            <div class="page-main-card-main">
              <n-form ref="formRef" :model="form" :rules="rules" size="small">
                <n-form-item path="name" label="常用语内容">
                  <n-input
                    type="textarea"
                    :maxlength="2000"
                    placeholder="请输入常用语内容..."
                    v-model:value="form.content"
                  />
                </n-form-item>
                <n-form-item path="remark" label="备注">
                  <n-input v-model:value="form.remark" size="medium" clearable placeholder="请输入备注" />
                </n-form-item>
                <n-form-item path="sort" label="排序">
                  <n-input v-model:value="form.sort" size="medium" clearable placeholder="请输入排序（越小越靠前）" />
                </n-form-item>
                <n-space>
                  <n-button size="medium" type="primary" :loading="loading" :disabled="active === '2'" @click="onCreate">创建自用常用语</n-button>
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
  height: calc(100vh - 200px);
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

  .page-item {
    border: 1px solid var(--border-color, #eee);
    border-radius: 8px;
    margin-bottom: 12px;
    padding: 12px;
    transition: all 0.2s ease-in-out;
    
    &:hover {
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.05);
    }
    
    .page-item-content {
      font-size: 14px;
      overflow-wrap: break-word;
      margin-bottom: 8px;
    }
    
    .page-item-remark {
      margin: 5px 0;
      font-size: 12px;
      color: #999;
    }
    
    .page-item-opt {
      display: flex;
      justify-content: flex-end;
      margin-top: 8px;
    }
  }
  .page-item:last-child {
    margin-bottom: 5px;
  }
</style>
