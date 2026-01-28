<script setup>
import Draggable from 'vuedraggable'
import { reactive, computed, ref, onMounted } from 'vue'
import { NModal, NForm, NFormItem, NInput, NSelect, NSpace, NEmpty, NButton, NIcon } from 'naive-ui'
import { Drag, Delete } from '@icon-park/vue-next'
import { ServeContactGroupSave, ServeContactGroupList } from '@/api/contact'
import { ServeGetGroupSortSelect, ServeGetGroupSortSet } from '@/api/group'

const emit = defineEmits(['close', 'reload'])
const props = defineProps({
  groupItem: {
    type: Object,
    default: () => ({})
  }
})

let index = 1
let valueName = ref('')
const isShow = ref(false)
const optionsName = ref([]) 

const onMaskClick = () => {
  emit('close')
}

// Load the group sort options
const loadGroupSortOptions = async () => {
  try {
    const { code, data } = await ServeGetGroupSortSelect()
    console.log('API response:', data, code)
    
    if (code === 200 && data && data.options) {
      optionsName.value = data.options.map(option => ({
        label: option.label,
        value: String(option.value)
      }))
      
      console.log('Processed options:', optionsName.value)
      
      if (optionsName.value.length === 0) {
        optionsName.value.push({
          label: '暂无分组',
          value: '0',
          disabled: true
        })
      }
    } else {
      window['$message'].warning('分组数据格式不正确')
      optionsName.value = [{
        label: '暂无分组',
        value: '0',
        disabled: true
      }]
    }
  } catch (error) {
    window['$message'].error('加载分组列表失败')
    optionsName.value = [{
      label: '加载失败',
      value: '0',
      disabled: true
    }]
  }
}

const onLoadData = async () => {
  await loadGroupSortOptions()
  console.log(props.groupItem,'props.groupItem'); 
  if (props.groupItem && props.groupItem.sort_id) {
    valueName.value = String(props.groupItem.sort_id)
  }
}

const onSubmit = () => {
  if (!valueName.value) {
    window['$message'].warning('请选择分组')
    return
  }
  
  ServeGetGroupSortSet({
    group_id: props.groupItem.receiver_id,
    group_sort_id: parseInt(valueName.value, 10)
  }).then(({ code, message }) => {
    if (code === 200) {
      window['$message'].success('设置分组成功')
      emit('reload')
      emit('close')
    } else {
      window['$message'].error(message || '设置分组失败')
    }
  }).catch(error => {
    console.error('Failed to set group sort:', error)
    window['$message'].error('设置分组失败')
  })
}

const isCanSubmit = computed(() => {
  return !valueName.value
})

onMounted(() => {
  onLoadData()
})
</script>

<template>
  <n-modal
    v-model:show="isShow"
    preset="card"
    title="分组管理"
    size="huge"
    :bordered="false"
    class="modal-radius"
    style="max-width: 450px"
    :on-after-leave="onMaskClick"
  >
    <n-empty v-show="optionsName.length === 0" size="50" description="暂未设置分组">
      <template #icon>
        <img src="@/assets/image/no-data.svg" alt="" />
      </template>
    </n-empty>

    <n-form v-show="optionsName.length > 0">
      <n-form-item label="选择分组">
        <div class="options">
          <div class="option">
            <n-space vertical style="flex: 1;">
              <n-select v-model:value="valueName" :options="optionsName" placeholder="请选择分组" />
            </n-space>
          </div>
        </div>
      </n-form-item>
    </n-form>

    <template #footer>
      <div class="footer">
        <div>
          <n-button type="tertiary" @click="isShow = false"> 取消 </n-button>
          <n-button type="primary" @click="onSubmit" class="mt-l15" :disabled="isCanSubmit">
            确定
          </n-button>
        </div>
      </div>
    </template>
  </n-modal>
</template>

<style lang="less" scoped>
.footer {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.options {
  width: 100%;

  .handle {
    cursor: move;
  }

  .option {
    margin: 8px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    user-select: none;
  }
}
</style>