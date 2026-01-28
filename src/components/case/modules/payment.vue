<!--
 * @Author: etoupcom etoupcom@126.com
 * @Date: 2025-03-28 14:04:11
 * @LastEditors: etoupcom etoupcom@126.com
 * @LastEditTime: 2025-03-28 14:46:23
 * @FilePath: /console/src/views/enterprise-case/modules/balance.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { NSpace, NButton, NForm, NFormItem, NInput, NAlert, NSelect } from 'naive-ui'
import { ServePaymentChannelSelect } from '@/api/user';
import { useCaseDetailStore } from '@/store';
import MyUpload from '@/components/base/MyUpload.vue'
// import { useAuthStore } from '@/store/modules/auth';

defineOptions({
  name: 'EnterpriseCasePayment'
});

interface Props {
  rowData?: any;
}

defineProps<Props>();

const visible = defineModel<boolean>('visible', {
  default: false
});

// const authStore = useAuthStore();
// const roles = authStore.userInfo.roles;

const { formRef, validate, restoreValidation } = useNaiveForm();
const { defaultRequiredRule } = useFormRules();

type Model = Pick<any, 'amount' | 'service_files' | 'service_description' | 'enterprise_payment_channel_id'> & {
  id: number;
};

const model: Model = reactive(createDefaultModel());

function createDefaultModel(): Model {
  return {
    id: 0,
    amount: null,
    service_files: [],
    service_description: '',
    enterprise_payment_channel_id: null
  };
}

type RuleKey = Exclude<keyof Model, 'id' | 'service_description' | 'service_files'>;

const rules: Record<RuleKey, any> = {
  amount: defaultRequiredRule,
  enterprise_payment_channel_id: defaultRequiredRule,
};

const caseDetailStore = useCaseDetailStore()

const options = ref([]);

function handleInitModel() {
  Object.assign(model, createDefaultModel());
}

function closeDrawer() {
  visible.value = false;
}

async function getEnterprisePaymentChannelSelect() {
  await validate();
  const { error, data } = await ServePaymentChannelSelect();
  if (!error) {
    options.value = data.options;
  }
}

async function handleSubmit() {
  await validate();
  await caseDetailStore.caseBalanceOrderSave({...model, id: caseDetailStore.detail.id, type: caseDetailStore.type })
  caseDetailStore.setOrderReload(true);
}

watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    restoreValidation();
    getEnterprisePaymentChannelSelect();
  }
});
</script>

<template>
  <NModal
    v-model:show="visible"
    preset="card"
    class="page-modal"
    title="收款"
    :block-scroll="true"
    :mask-closable="false"
    :style="{ width: '380px', backgroundColor: '#f9f9f9' }"
  >
      <NAlert title="提示" type="warning" class="mb-4">
        <NSpace class="page-space">
          <div v-if="caseDetailStore.type === 3">该操作会生成尾款订单，可以多次收尾款，提交收款说明将转财务审核</div>
          <div v-if="caseDetailStore.type === 6">该操作会生成律师收款订单，可以多次补充律师收费，提交收款说明将转财务审核</div>
          <div v-if="caseDetailStore.type === 7">该操作会生成诉讼指导费订单，可以多次补充诉讼收费，提交收款说明将转财务审核</div>
        </NSpace>
      </NAlert>
      <NForm ref="formRef" :model="model" :rules="rules">
        <NFormItem label="收款渠道" path="enterprise_payment_channel_id">
          <NSelect v-model:value="model.enterprise_payment_channel_id" :options="options" placeholder="请选择收款渠道" />
        </NFormItem>
        <NFormItem label="收款金额" path="amount">
          <NInput v-model:value="model.amount" clearable placeholder="请填写收款金额" />
        </NFormItem>
        <NFormItem label="收款说明" path="service_description">
          <NInput
            v-model:value="model.service_description"
            type="textarea"
            :autosize="{ minRows: 3 }"
            maxlength="200"
            show-count
            clearable
            placeholder="请填写收款说明"
          />
        </NFormItem>
        <NFormItem label="收款凭证" path="service_files">
          <MyUpload v-model:value="model.service_files" :default-file-list="model.service_files" title="上传收款凭证" />
        </NFormItem>
        <NSpace :size="16" justify="end">
          <NButton @click="closeDrawer">关闭</NButton>
          <NButton type="primary" @click="handleSubmit">提交</NButton>
        </NSpace>
      </NForm>
  </NModal>
</template>

<style scoped>
.mb-4{
    margin-bottom: 16px;
}
</style>
