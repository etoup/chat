<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { FormInst } from 'naive-ui'
import { NModal, NGrid, NGridItem, NForm, NFormItem, NSelect, NButton, NSpace, NDynamicInput, NInput, NIcon, NTooltip } from 'naive-ui'
import { useTalkStore, useDialogueStore } from '@/store'
import { ServeMaterialSelect, ServeMaterialRecordSave, ServeMaterialRecordPublish, ServeMaterialRecordUpdate } from '@/api/material'
import {
  ChevronUpCircleOutline as UpIcon
} from '@vicons/ionicons5'

const emit = defineEmits(['on-submit'])

const talkStore = useTalkStore()
const dialogueStore = useDialogueStore()
const visible = computed({
    get: () => talkStore.isShowMaterialModal,
    set: (value: boolean) => {
      talkStore.showMaterialModal(value)
      if (!value) {
        form.value = { id: null, material_id: null, parameter_data: [] }
        model.content = ''
        content.value = ''
        url.value = ''
        hasUrl.value = false
      }
    }
})
const model = reactive({
  lang: '',
  content: '',
  url: '',
  files: [],
  images: []
})
const loading = ref(false)
const options = ref<any[]>([])
const list = ref<any[]>([])
const url = ref<string>('')
const hasUrl = ref<boolean>(false)
const content = ref<string>('')
const form = ref<{ id: string | null; material_id: string | null; parameter_data: any }>({ id: null, material_id: null, parameter_data: [] })
const formRef = ref<FormInst | null>(null)

const loadList = async () => {
  const res = await ServeMaterialSelect()
  if (res.code === 200) {
    list.value = res.data || []
    options.value = res.data.map((e: any) => {
      return { label: e.name, value: e.id }
    }) || []  
  }
}

const onCreate = async () => {
  try {
    await formRef.value?.validate()
  } catch {
    return
  }
  url.value = ''
  loading.value = true
  try {
    const [res] = await Promise.all([
      ServeMaterialRecordSave({ ...form.value, group_id: dialogueStore.talk.receiver_id }),
      new Promise((resolve) => setTimeout(resolve, 3000))
    ])
    if (res.code === 200) {
      form.value.id = res.data.id
      const fileUrl = res.data.url || ''
      if (fileUrl) {
        try {
          url.value = `${fileUrl}?t=${Date.now()}`
        } catch {
          window['$message']?.info('文件尚未可用，请稍后重试')
          url.value = ''
        }
      } else {
        url.value = ''
      }
    } else {
      window['$message']?.error(res.message || '生成预览文件失败')
      return
    }
  } finally {
    loading.value = false
  }
}

const onSend = async () => {
  if (!hasUrl.value) {
    const result = await ServeMaterialRecordUpdate({ id: form.value.id })
    if (result.code !== 200) {
      window['$message']?.error(result.message || '材料发送失败') 
      return
    }
  }
  const res = await ServeMaterialRecordPublish({id: form.value.id})
  if (res.code === 200) { 
    const c = content.value
    if (c) {
      let data = {
        content: c,
      }
      emit('on-submit', { ...data })
    }
    form.value = { id: null, material_id: null, parameter_data: [] }
    model.content = ''
    content.value = ''
    url.value = ''
    hasUrl.value = false
  } else {
    window['$message']?.error(res.message || '材料发送失败')
  }
}

const onChange = (value: string | null) => {
  if (!value) return
  const selected = list.value.find(item => item.id === value)
  if (selected) {
    form.value.parameter_data = selected.parameter_data || []
    content.value = selected.rhetoric || ''
    hasUrl.value = !!selected.url
  }
}

watch(() => talkStore.isShowMaterialModal, (v) => { if (v) loadList() })

</script>

<template>
    <NModal
      v-model:show="visible"
      preset="card"
      class="page-modal"
      title="办案材料"
      :style="{ width: '480px', backgroundColor: '#f9f9f9' }"
      closable
    >
    <NGrid cols="24" x-gap="12" item-responsive responsive="screen">
      <NGridItem span="24 m:24 l:24">
        <div class="page-main">
          <div class="page-main-card">
            <div class="page-main-card-main">
              <n-form ref="formRef" :model="form">
                <n-form-item path="material_id" label="材料">
                  <n-select v-model:value="form.material_id" size="medium" filterable clearable placeholder="请选择需要的材料" :options="options" @change="onChange" />
                </n-form-item>
                <n-form-item path="content" label="配套话术（发送材料之后同步发送）" v-if="content">
                  <n-input :value="content" size="medium" readonly type="textarea" placeholder="选择材料后有配套话术展示" />
                </n-form-item>
                <n-form-item path="parameter_data" label="参数" v-if="form.parameter_data.length > 0">
                  <NDynamicInput
                    v-model:value="form.parameter_data"
                    :on-create="() => ({ label: '', code: '' })"
                    item-style="margin-bottom: 5px;"
                  >
                    <template #default="{ value }">
                      <div v-if="value" style="display: flex">
                        <n-input
                          v-model:value="value.label"
                          placeholder="参数名称"
                          size="medium"
                          readonly
                          style="width: 50%;"
                        />
                        <n-input
                          v-model:value="value.value"
                          placeholder="填写参数数据"
                          clearable
                          @keydown.enter.prevent
                          size="medium"
                          style="margin-left: 5px;"
                        />
                      </div>
                    </template>
                    <template #action="{ index, move }">
                      <NSpace style="margin-left: 20px">
                        <NTooltip trigger="hover">
                          <template #trigger>
                            <NButton disabled @click="() => move('up', index)">
                              <NIcon>
                                <UpIcon />
                              </NIcon>
                            </NButton>
                          </template>
                          上移
                        </NTooltip>
                      </NSpace>
                    </template>
                  </NDynamicInput>
                </n-form-item>
                <n-space justify="space-between">
                  <n-space>
                    <n-button size="medium" type="primary" :loading="loading" @click="onCreate">{{ url ? '重新生成预览文件' : '生成预览文件' }}</n-button>
                    <n-button size="medium" type="success" tag="a" :href="url" :disabled="url.length === 0" target="_blank">预览</n-button>
                  </n-space>
                  <n-button size="medium" type="warning" :disabled="url.length === 0" @click="onSend">确认发送材料</n-button>
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
.pdf-view{
  width: 100%;
  min-height: calc(100vh - 430px);
}
.pdf-empty{
  width: 100%;
  height: calc(100vh - 430px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  background-color: #f5f5f5;
  border-radius: 6px;
}
.pdf-open-link{
  margin-top: 8px;
  font-size: 12px;
}
.page-card {
  width: 780px;
  padding: 6px 0;
  background-color: #f5f5f5;
}
.page-main {
  height: calc(100vh - 300px);
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
