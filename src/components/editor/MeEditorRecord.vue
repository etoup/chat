<script lang="ts" setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import {
  FormInst,
  FormRules,
  NDrawer,
  NDrawerContent,
  NForm,
  NFormItem,
  NInput,
  NSpace,
  NDivider,
  NVirtualList,
  NButton,
  NFlex,
  NModal,
  NCard,
  NPopconfirm,
  NPopover,
  NEllipsis,
  NIcon,
  NTabPane,
  NTabs,
  NScrollbar
} from 'naive-ui'
// import Upload from '@/components/base/OssUpload.vue'
// import { Policy } from '@/api/user'
import { CaseRecordCreate, PhraseSave, PhraseList, PhraseRemove } from '@/api/case.js'
import { ServePublishMessage } from '@/api/chat'
import { useDialogueStore } from '@/store'
import {
  Plus
} from '@icon-park/vue-next'

const dialogueStore = useDialogueStore()

const emit = defineEmits(['close', 'on-submit'])

const showModal = ref(false)
const isShowBox = ref(true)
const fileList = ref([])
const imageList = ref([])
const items = ref([])
const keyword = ref('')
const policy = ref()
const activeTab = ref('1')
const loading = ref(false)

const formRef = ref<FormInst | null>(null)
const formModalRef = ref<FormInst | null>(null)

const model = reactive({
  lang: '',
  content: '',
  url: '',
  files: [],
  images: []
})

const modelModal = reactive({
  content: null,
  remark: null,
  sort: null,
  type: 1
})

const rules: FormRules = {
  content: [
    {
      required: true,
      message: '请填写工作内容'
    }
  ]
}

const rulesModal: FormRules = {
  content: [
    {
      required: true,
      message: '请填写常用语内容'
    }
  ]
}

const isCanSubmit = computed(() => {
  return !model.content
})

const isModalCanSubmit = computed(() => {
  return !modelModal.content
})

const onMaskClick = () => {
  emit('close')
}

const onSubmit = async () => {
  let data = {
    case_id: dialogueStore.talk.case_id,
    content_files: model.files,
    content_images: model.images,
    content: model.content,
    url: model.url
  }

  if (model.lang == 'json') {
    try {
      data.content = JSON.stringify(JSON.parse(model.content), null, 2)
    } catch (error) {
      data.content = model.content
    }
  }

  const res = await CaseRecordCreate(data)
  if (res.code == 200) {
    emit('on-submit', { ...data, content: model.content, id: res.data })
  } else {
    window['$message'].info(res.message)
  }
}

const loadData = async (type = activeTab.value) => {
  loading.value = true
  try {
    const res = await PhraseList({ type: Number(type) })
    if (res.code == 200) {
      items.value = res.data.records || res.data.items || []
    } else {
      window['$message'].error(res.message || '获取常用语失败')
    }
  } catch (error) {
    window['$message'].error('加载数据失败')
  } finally {
    loading.value = false
  }
}

const handleTabChange = (value) => {
  activeTab.value = value
  loadData(value)
}

const onModalSubmit = async () => {
  try {
    const res = await PhraseSave({ 
      ...modelModal, 
      sort: Number(modelModal.sort),
      type: 1
    })
    
    if (res.code == 200) {
      modelModal.content = null
      modelModal.remark = null
      modelModal.sort = null
      showModal.value = false
      
      loadData(activeTab.value)
      window['$message'].success('新增成功')
    } else {
      window['$message'].error(res.message || '新增失败')
    }
  } catch (error) {
    window['$message'].error('操作失败')
  }
}

const onUse = (content) => {
  model.content = content
  window['$message'].success('已选择该常用语')
}

// Add a helper function to mimic onSendTextEvent from PanelFooter
const sendTextMessage = (content, callBack) => {
  // Create the same data structure expected by onSendTextEvent
  let data = {
    items: [{ type: 'text', content }],
    quoteId: 0,  // No quote
    mentionUids: [] // No mentions
  }
  
  // Create the message object structure
  let message = {
    type: 'text',
    content,
    quote_id: 0,
    mentions: []
  }
  
  // Add receiver information
  message.receiver = {
    receiver_id: dialogueStore.talk.receiver_id || dialogueStore.talk.case_id,
    talk_type: dialogueStore.talk.talk_type || 1
  }
  
  // Use ServePublishMessage directly like in PanelFooter
  ServePublishMessage(message)
    .then(({ code, message: responseMessage }) => {
      if (code == 200) {
        callBack(true)
      } else {
        window['$message'].warning(responseMessage || '发送失败')
      }
    })
    .catch(() => {
      window['$message'].warning('网络繁忙,请稍后重试!')
    })
}

// Update your onSend method
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

const onRemove = async (id) => {
  try {
    const res = await PhraseRemove({ keys: [id] })
    if (res.code == 200) {
      loadData(activeTab.value)
      window['$message'].success('删除成功')
    } else {
      window['$message'].error(res.message || '删除失败')
    }
  } catch (error) {
    window['$message'].error('操作失败')
  }
}

const getPolicy = () => {
  Policy().then((res) => {
    if (res.code === 200) {
      policy.value = res.data
    }
  })
}

const onFiles = (e: any) => {
  fileList.value = e
  setTimeout(() => {
    model.files = e
  }, 800)
}

const onImages = (e: any) => {
  imageList.value = e
  setTimeout(() => {
    model.images = e
  }, 800)
}

onMounted(() => {
  // getPolicy()
  loadData('1')
})
</script>

<template>
  <n-drawer
    v-model:show="isShowBox"
    :width="500"
    :on-after-leave="onMaskClick"
    :segmented="{
      content: true
    }"
  >
    <n-drawer-content title="常用语列表">
      <n-flex>
        <div class="page-left">
          <n-tabs type="line" animated @update:value="handleTabChange" :value="activeTab">
            <n-tab-pane name="1" tab="自建">
              <n-flex justify="end" style="margin-bottom: 10px">
                <n-button type="primary" @click="showModal = true">
                  <template #icon><n-icon><plus /></n-icon></template>
                  新增常用语
                </n-button>
              </n-flex>
            </n-tab-pane>
            
            <n-tab-pane name="2" tab="通用"></n-tab-pane>
          </n-tabs>
          
          <n-scrollbar style="max-height: 500px" trigger="hover">
            <div v-if="loading" class="loading-state">
              <n-spin size="medium" />
              <span>加载中...</span>
            </div>
            
            <div v-else-if="items.length > 0">
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
                      v-if="item.type === 1 || activeTab === '1'" 
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
            
            <n-empty 
              v-else 
              description="暂无常用语" 
              class="page-empty"
            >
              <template #extra v-if="activeTab === '1'">
                <n-button size="small" @click="showModal = true">新增常用语</n-button>
              </template>
            </n-empty>
          </n-scrollbar>
        </div>
      </n-flex>

      <template #footer>
        <div class="footer">
          <div>
            <n-button type="tertiary" @click="isShowBox = false">关闭</n-button>
          </div>
        </div>
      </template>
    </n-drawer-content>
  </n-drawer>
  <n-modal v-model:show="showModal">
    <n-card
      style="width: 500px"
      title="新增"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <n-form ref="formModalRef" :model="modelModal" :rules="rulesModal">
        <n-form-item path="content" label="常用语内容">
          <n-input
            type="textarea"
            :maxlength="65535"
            placeholder="请输入常用语内容..."
            v-model:value="modelModal.content"
          />
        </n-form-item>
        <n-form-item path="remark" label="备注">
          <n-input placeholder="请输入备注" v-model:value="modelModal.remark" />
        </n-form-item>
        <n-form-item path="sort" label="排序">
          <n-input placeholder="请输入排序，越小越靠前" v-model:value="modelModal.sort" />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-space>
          <n-button type="tertiary" @click="showModal = false">关闭</n-button>
          <n-button type="primary" @click="onModalSubmit" :disabled="isModalCanSubmit">
            提交
          </n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>

<style lang="less" scoped>
.page-right {
  width: 350px;
  overflow: hidden;
  border-radius: 10px;
}

.popselect {
  height: 30px;
  line-height: 30px;
  margin-bottom: 10px;

  span {
    margin-right: 10px;
  }
}

.footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.page-left {
  flex: 1;
  
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
}

.loading-state {
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

.page-empty {
  margin-top: 50px;
}
</style>
