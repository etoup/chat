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
import { ServeCaseContracts } from '@/api/user';
import { NSpace, NButton, NForm, NFormItem, NInput, NSelect, NAlert } from 'naive-ui'
import { useCaseDetailStore } from '@/store';

defineOptions({
  name: 'EnterpriseCaseTransferRefund'
});

const visible = defineModel<boolean>('visible', {
  default: false
});

const { formRef, validate, restoreValidation } = useNaiveForm();
const { defaultRequiredRule } = useFormRules();

type Model = Pick<any, 'amount' | 'contract_id' | 'card_number' | 'bank_name' | 'payment_total_amount'>;

const model: Model = reactive(createDefaultModel());

const caseDetailStore = useCaseDetailStore()

function createDefaultModel(): Model {
  return {
    amount: null,
    payment_total_amount: null,
    contract_id: null,
    card_number: null,
    bank_name: null
  };
}

type RuleKey = Exclude<keyof Model, 'id'>;

const rules: Record<RuleKey, any> = {
  amount: defaultRequiredRule,
  payment_total_amount: defaultRequiredRule,
  contract_id: defaultRequiredRule,
  card_number: defaultRequiredRule,
  bank_name: defaultRequiredRule
};

const contracts = ref<any[]>([]);

function handleInitModel() {
  Object.assign(model, createDefaultModel(), { id: 0 });
}

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();
  caseDetailStore.caseCaseRefund({...model, id: caseDetailStore.transferDetail.id, enterprise_case_id: caseDetailStore.detail.id})
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
    title="退费结案"
    :block-scroll="true"
    :mask-closable="false"
    :style="{ width: '380px', backgroundColor: '#f9f9f9' }"
  >
    <NAlert v-if="caseDetailStore.transferDetail.status === 6" title="拒绝原因" type="warning" :show-icon="false" class="mb-4">
      <NSpace class="page-space">
        <div>{{ caseDetailStore.transferDetail.audit_remark }}</div>
      </NSpace>
    </NAlert>
    <NForm ref="formRef" :model="model" :rules="rules">
      <NFormItem label="客户付款金额（包含扣税金额）" path="payment_total_amount">
        <NInput v-model:value="model.payment_total_amount" clearable placeholder="请填写客户付款金额" />
      </NFormItem>
      <NFormItem label="退费金额" path="amount">
        <NInput v-model:value="model.amount" clearable placeholder="请填写退费金额" />
      </NFormItem>
      <NFormItem label="退费卡号" path="card_number">
        <NInput v-model:value="model.card_number" clearable placeholder="请填写退费卡号" />
      </NFormItem>
      <NFormItem label="开户支行" path="bank_name">
        <NInput v-model:value="model.bank_name" clearable placeholder="请填写开户支行" />
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
