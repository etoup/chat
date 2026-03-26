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
import { NSpace, NButton, NForm, NFormItem, NInput, NAlert, NSelect, NGrid, NGridItem } from 'naive-ui'
import { ServeCaseContracts, ServePaymentChannelSelect } from '@/api/user';
import { useCaseDetailStore } from '@/store';
import MyUpload from '@/components/base/MyUpload.vue'
// import { useAuthStore } from '@/store/modules/auth';

defineOptions({
  name: 'EnterpriseCasePaymentLawyer'
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

type Model = Pick<any, 'times_amount' | 'times_service_files' | 'service_description' | 'times_payment_channel_id' | 'times_contract_id' | 'times_instance' | 'times_agreed_content' | 'times_description' | 'times_instance_additional' | 'times_service_amount'> & {
  id: number;
};

const model: Model = reactive(createDefaultModel());

function createDefaultModel(): Model {
  return {
    id: 0,
    times_amount: null,
    times_service_amount: null,
    times_service_files: [],
    service_description: '',
    times_payment_channel_id: null,
    times_contract_id: null,
    times_instance: null,
    times_agreed_content: '',
    times_description: '',
    times_instance_additional: ''
  };
}

type RuleKey = Exclude<keyof Model, 'id' | 'service_description' | 'times_agreed_content' | 'times_description' | 'times_instance_additional'>;

const rules: Record<RuleKey, any> = {
  times_amount: defaultRequiredRule,
  times_service_amount: defaultRequiredRule,
  times_payment_channel_id: defaultRequiredRule,
  times_contract_id: defaultRequiredRule,
  times_instance: defaultRequiredRule,
  times_service_files: defaultRequiredRule
};

const caseDetailStore = useCaseDetailStore()

const options = ref([]);
const contracts = ref([]);
const instanceOptions = reactive([
  { value: 1, label: '一审诉讼' },
  { value: 2, label: '二审诉讼' },
  { value: 3, label: '其他' }
]);

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

async function getContracts() {
  const { error, data } = await ServeCaseContracts({type: 4});
  if (!error) {
    contracts.value = data.options;
  }
}

async function handleSubmit() {
  await validate();
  await caseDetailStore.caseLawyerOrderSave({...model, id: caseDetailStore.detail.id, type: caseDetailStore.type })
  caseDetailStore.setOrderReload(true);
}

watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    restoreValidation();
    getEnterprisePaymentChannelSelect();
    getContracts();
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
    :style="{ width: '680px', backgroundColor: '#f9f9f9' }"
  >
      <NAlert title="提示" type="warning" class="mb-4">
        <NSpace class="page-space">
          <div v-if="caseDetailStore.type === 3">该操作会生成尾款订单，可以多次收尾款，提交收款说明将转财务审核</div>
          <div v-if="caseDetailStore.type === 6">该操作会生成律师收款订单，可以多次补充律师收费，提交收款说明将转财务审核</div>
          <div v-if="caseDetailStore.type === 7">该操作会生成诉讼指导费订单，可以多次补充诉讼收费，提交收款说明将转财务审核</div>
        </NSpace>
      </NAlert>
      <NForm ref="formRef" :model="model" :rules="rules">
        <NGrid cols="8" x-gap="12" item-responsive responsive="screen">
          <NGridItem span="8 m:8 l:4">
            <NFormItem label="收款凭证" path="times_service_files">
              <MyUpload v-model:value="model.times_service_files" :default-file-list="model.times_service_files" title="上传收款凭证" />
            </NFormItem>
            <NFormItem label="收款渠道" path="times_payment_channel_id">
              <NSelect v-model:value="model.times_payment_channel_id" :options="options" placeholder="请选择收款渠道" />
            </NFormItem>
            <NFormItem label="收款金额" path="times_amount">
              <NInput v-model:value="model.times_amount" clearable placeholder="请填写收款金额">
                <template #suffix>元</template>
              </NInput>
            </NFormItem>
            <NFormItem label="总服务费金额" path="times_service_amount">
              <NInput v-model:value="model.times_service_amount" clearable placeholder="填写总服务费金额">
                <template #suffix>元</template>
              </NInput>
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
          </NGridItem>
          <NGridItem span="8 m:8 l:4">
            <NFormItem label="适用合同" path="times_contract_id">
              <NSelect
                v-model:value="model.times_contract_id"
                :options="contracts"
                filterable
                clearable
                placeholder="选择适用合同"
              />
            </NFormItem>
            <NFormItem label="庭审阶段" path="times_instance">
              <NSelect
                v-model:value="model.times_instance"
                :options="instanceOptions"
                filterable
                clearable
                placeholder="选择庭审阶段"
              />
            </NFormItem>
            <NFormItem label="补充协议（合同约定，慎重填写）" path="times_agreed_content">
              <NInput
                v-model:value="model.times_agreed_content"
                type="textarea"
                :autosize="{ minRows: 3 }"
                maxlength="200"
                show-count
                clearable
                placeholder="填写补充协议"
              />
            </NFormItem>
            <NFormItem label="其他庭审阶段内容（合同约定，慎重填写）" path="times_instance_additional" v-if="model.times_instance === 3">
              <NInput
                v-model:value="model.times_instance_additional"
                type="textarea"
                :autosize="{ minRows: 3 }"
                maxlength="200"
                show-count
                clearable
                placeholder="填写其他庭审内容"
              />
            </NFormItem>
          </NGridItem>
        </NGrid>
        
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
