<script setup lang="ts">
import { reactive, watch } from 'vue';
import { NSpace, NButton, NForm, NFormItem, NInput, NSwitch } from 'naive-ui'
import MyUpload from '@/components/base/MyUpload.vue'
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { useCaseDetailStore } from '@/store';

defineOptions({
  name: 'EnterpriseCaseInformationSave'
});

interface Props {
  operateType: any;
  rowData?: any;
}

const props = defineProps<Props>();

const visible = defineModel<boolean>('visible', {
  default: false
});

// const authStore = useAuthStore();
// const roles = authStore.userInfo.roles;


type Model = Pick<any, 'id' | 'name' | 'record_text' | 'record_json' | 'hidden'>;

const model: Model = reactive(createDefaultModel());

const { formRef, validate, restoreValidation } = useNaiveForm();
const { defaultRequiredRule } = useFormRules();

type RuleKey = Exclude<keyof Model, 'id' | 'record_json' | 'hidden' | 'record_text'>;

const rules: Record<RuleKey, any> = {
  name: defaultRequiredRule,
};

const caseDetailStore = useCaseDetailStore()

function createDefaultModel(): Model {
  return {
    id: null,
    name: '',
    record_text: null,
    record_json: null,
    hidden: 0
  };
}

function handleInitModel() {
  Object.assign(model, createDefaultModel(), { id: 0 });

  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model, props.rowData);
  }
}

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();
  if (caseDetailStore.transferDetail.id > 0) {
    caseDetailStore.caseTransferComponentSave({...model, enterprise_case_id: caseDetailStore.detail.id, type: 1})
  } else {
    caseDetailStore.caseComponentSave({...model, enterprise_case_id: caseDetailStore.detail.id, type: 1})
  }
  
}

watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    restoreValidation();
  }
});
</script>

<template>
  <NModal
    v-model:show="visible"
    preset="card"
    class="page-modal"
    title="补充资料"
    :block-scroll="true"
    :mask-closable="false"
    :style="{ width: '380px', backgroundColor: '#f9f9f9' }"
  >
    <NForm ref="formRef" :model="model" :rules="rules">
      <NFormItem label="名称" path="name">
        <NInput v-model:value="model.name" clearable placeholder="请填写资料名称" />
      </NFormItem>
      <NFormItem label="描述" path="record_text">
        <NInput
          v-model:value="model.record_text"
          type="textarea"
          :autosize="{ minRows: 3 }"
          maxlength="2000"
          show-count
          clearable
          placeholder="请填写资料描述"
        />
      </NFormItem>
      <NFormItem label="对用户" path="hidden">
        <NSwitch v-model:value="model.hidden" size="large">
          <template #checked>显示</template>
          <template #unchecked>隐藏</template>
        </NSwitch>
      </NFormItem>
      <NFormItem label="资料" path="record_json">
        <MyUpload v-model:value="model.record_json" :default-file-list="model.record_json" title="上传资料" />
      </NFormItem>
      <NSpace :size="16" justify="end">
        <NButton @click="closeDrawer">关闭</NButton>
        <NButton type="primary" @click="handleSubmit">提交</NButton>
      </NSpace>
    </NForm>
  </NModal>
</template>

<style scoped></style>
