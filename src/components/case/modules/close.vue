<!--
 * @Author: etoupcom etoupcom@126.com
 * @Date: 2025-03-28 14:04:11
 * @LastEditors: etoupcom etoupcom@126.com
 * @LastEditTime: 2025-03-28 14:50:02
 * @FilePath: /console/src/views/enterprise-case/modules/close.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { NSpace, NButton, NForm, NFormItem, NInput, NSelect } from 'naive-ui'
import { ServeCaseContracts } from '@/api/user';
import { useCaseDetailStore } from '@/store';
// import { useAuthStore } from '@/store/modules/auth';

defineOptions({
  name: 'EnterpriseCaseClose'
});

const visible = defineModel<boolean>('visible', {
  default: false
});

// const authStore = useAuthStore();
// const roles = authStore.userInfo.roles;

const { formRef, validate, restoreValidation } = useNaiveForm();
const { defaultRequiredRule } = useFormRules();

type Model = Pick<any, 'retrieve_amount' | 'contract_id'>;

const model: Model = reactive(createDefaultModel());

function createDefaultModel(): Model {
  return {
    retrieve_amount: null,
    contract_id: null
  };
}

type RuleKey = Exclude<keyof Model, 'id'>;

const rules: Record<RuleKey, any> = {
  retrieve_amount: defaultRequiredRule,
  contract_id: defaultRequiredRule
};

const contracts = ref<any[]>([]);

const caseDetailStore = useCaseDetailStore()

function handleInitModel() {
  Object.assign(model, createDefaultModel(), { id: 0 });
}

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();
  caseDetailStore.caseCloseSave({...model, id: caseDetailStore.detail.id })
}

async function getContracts() {
  const { error, data } = await ServeCaseContracts();
  if (!error) {
    contracts.value = data.options;
  }
}

watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    restoreValidation();
    getContracts();
  }
});
</script>

<template>
  <NModal
    v-model:show="visible"
    preset="card"
    class="page-modal"
    title="转交结案"
    :block-scroll="true"
    :mask-closable="false"
    :style="{ width: '380px', backgroundColor: '#f9f9f9' }"
  >
    <NForm ref="formRef" :model="model" :rules="rules">
      <NFormItem label="挽回金额" path="retrieve_amount">
        <NInput v-model:value="model.retrieve_amount" clearable placeholder="请填写挽回金额" />
      </NFormItem>
      <NFormItem label="适用合同" path="contract_id">
        <NSelect
          v-model:value="model.contract_id"
          :options="contracts"
          filterable
          clearable
          placeholder="请选择适用合同"
        />
      </NFormItem>
      <NSpace :size="16" justify="end">
        <NButton @click="closeDrawer">关闭</NButton>
        <NButton type="primary" @click="handleSubmit">提交</NButton>
      </NSpace>
    </NForm>
  </NModal>
</template>

<style scoped></style>
