<!--
 * @Author: etoupcom etoupcom@126.com
 * @Date: 2025-03-28 14:04:11
 * @LastEditors: etoupcom etoupcom@126.com
 * @LastEditTime: 2025-03-31 11:47:21
 * @FilePath: /console/src/views/enterprise-case/modules/balance.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { ServeCaseDepartments } from '@/api/user';
import { NSpace, NButton, NForm, NFormItem, NInput, NSelect } from 'naive-ui'
import { useCaseDetailStore } from '@/store';
// import { useAuthStore } from '@/store/modules/auth';

defineOptions({
  name: 'EnterpriseCaseSupervise'
});

const visible = defineModel<boolean>('visible', {
  default: false
});

// const authStore = useAuthStore();
// const roles = authStore.userInfo.roles;

const { formRef, validate, restoreValidation } = useNaiveForm();
const { defaultRequiredRule } = useFormRules();

const departments = ref<any[]>([]);

type Model = Pick<any, 'enterprise_department_id' | 'remark'>;

const model: Model = reactive(createDefaultModel());
function createDefaultModel(): Model {
  return {
    enterprise_department_id: null,
    remark: null
  };
}

type RuleKey = Exclude<keyof Model, 'id'>;

const rules: Record<RuleKey, any> = {
  enterprise_department_id: defaultRequiredRule,
  remark: defaultRequiredRule
};

const caseDetailStore = useCaseDetailStore()

function handleInitModel() {
  Object.assign(model, createDefaultModel(), { id: 0 });
}

function closeDrawer() {
  visible.value = false;
}

async function getDepartments() {
  const { error, data } = await ServeCaseDepartments({ code: 'supervise' });
  if (!error) {
    departments.value = data.options;
  }
}

async function handleSubmit() {
  await validate();
  caseDetailStore.caseSuperviseSave({...model, id: caseDetailStore.detail.id })
}

watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    restoreValidation();
    getDepartments();
  }
});
</script>

<template>
  <NModal
    v-model:show="visible"
    preset="card"
    class="page-modal"
    title="转交督查"
    :block-scroll="true"
    :mask-closable="false"
    :style="{ width: '380px', backgroundColor: '#f9f9f9' }"
  >
    
    <NForm ref="formRef" :model="model" :rules="rules">
      <NFormItem label="督查组" path="enterprise_department_id">
        <NSelect
          v-model:value="model.enterprise_department_id"
          :options="departments"
          clearable
          placeholder="请选择分配督查组"
        />
      </NFormItem>
      <NFormItem label="备注" path="remark">
        <NInput
          v-model:value="model.remark"
          type="textarea"
          maxlength="200"
          show-count
          clearable
          placeholder="请填写备注信息"
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
