<!--
 * @Author: etoupcom etoupcom@126.com
 * @Date: 2025-03-28 14:04:11
 * @LastEditors: etoupcom etoupcom@126.com
 * @LastEditTime: 2025-03-28 16:15:00
 * @FilePath: /console/src/views/enterprise-case/modules/close.vue
 * @Description: 修复 category_id 被重置的问题
-->
<script setup lang="ts">
import { reactive, ref, watch, nextTick } from 'vue';
import { NSpace, NButton, NForm, NFormItem, NInput, NGrid, NGridItem, NCascader, NDatePicker } from 'naive-ui'
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { ServeCaseCategory, ServeCaseCategoryItem, ServeLawyerCaseDataSave } from '@/api/user';
import MyUpload from '@/components/base/MyUpload.vue'

defineOptions({
  name: 'EnterpriseCaseApplyLawyer'
});

interface Props {
  rowData?: any;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const { formRef, validate, restoreValidation } = useNaiveForm();
const { defaultRequiredRule } = useFormRules();

interface Model {
  category_id: number | null;
  [key: string]: any;
}

const model = reactive<Model>({
  category_id: null
});

const rules = ref({
  category_id: defaultRequiredRule
});

const fields = ref<any[]>([]);
const menu = ref<any[]>([]);

function createDefaultModel(): Model {
  return {
    category_id: null
  };
}

// --- 核心修复函数 ---
function resetModelAndFields() {
  // 1. 备份当前的 category_id
  const currentCategoryId = model.category_id;

  // 2. 创建一个基础对象
  const newModel: any = {
    category_id: currentCategoryId
  };

  // 3. 根据当前的 fields 初始化动态字段
  if (fields.value && fields.value.length > 0) {
    fields.value.forEach((field) => {
      if (field.type === 'date' || field.type === 'datetime') {
        // 【修改点】日期类型初始化为 null 或 '' 均可，但必须确保后续赋值是字符串
        // 建议初始化为 null，让组件自己处理显示，但确保类型定义兼容
        newModel[field.name] = null;
      } else {
        newModel[field.name] = '';
      }
    });
  }

  // 4. 清理 model 中旧的动态属性
  Object.keys(model).forEach(key => {
    if (key !== 'category_id') {
      delete (model as any)[key];
    }
  });

  // 5. 赋予新值 (使用 Object.assign 可能会破坏部分响应式引用，建议直接循环赋值)
  // 【优化点】不要完全 replace object，而是逐个赋值，保持响应式引用稳定
  for (const key in newModel) {
    (model as any)[key] = newModel[key];
  }

  // 6. 重建 Rules
  const newRules = {
    category_id: defaultRequiredRule
  };

  if (fields.value) {
    fields.value.forEach((field) => {
      const isRequired = field.required === '1';
      if (isRequired) {
        newRules[field.name] = {
          required: true,
          message: `请选择${field.label}`
        };
      }
    });
  }

  rules.value = newRules;

  nextTick(() => {
    restoreValidation();
  });
}
// ------------------

function handleInitModel() {
  // 打开弹窗时的初始化
  model.category_id = null;
  fields.value = []; // 清空 fields
  rules.value = { category_id: defaultRequiredRule };
  restoreValidation();
}

function closeDrawer() {
  visible.value = false;
  fields.value = [];
  // 关闭时彻底清空
  Object.keys(model).forEach(key => {
    if (key !== 'category_id') {
      delete (model as any)[key];
    }
  });
  model.category_id = null; // 关闭时也重置 category_id
  rules.value = { category_id: defaultRequiredRule };
}

async function handleSubmit() {
  await validate();
  console.log(props.rowData)
  const { error } = await ServeLawyerCaseDataSave({
    case_id: props.rowData.id,
    category_id: model.category_id,
    detail: fields.value.map((field) => {
      const rawValue = model[field.name];
      let value = '';

      switch (field.type) {
        case 'file':
          // 处理文件类型：取数组第一个元素的 path
          if (Array.isArray(rawValue) && rawValue.length > 0) {
            value = rawValue[0].path;
          } else {
            value = ''; // 或者根据需求设为 null
          }
          break;
        case 'image':
          // 处理图片类型：取数组第一个元素的 path
          if (Array.isArray(rawValue) && rawValue.length > 0) {
            value = rawValue[0].path;
          } else {
            value = ''; // 或者根据需求设为 null
          }
          break;

        default:
          // 处理其他所有类型：保持原有 toString 逻辑
          // 使用可选链防止 rawValue 为 null/undefined 时报错
          value = rawValue?.toString() || '';
          break;
      }

      return {
        name: field.name,
        label: field.label,
        type: field.type,
        value: value
      };
    })
  });

  if (!error) {
    closeDrawer();
    emit('submitted');
  }
}

function handleUpdate(value: any) {
  if (!value) {
    model.category_id = null; // 显式置空
    fields.value = [];

    // 清空动态字段
    Object.keys(model).forEach(key => {
      if (key !== 'category_id') delete (model as any)[key];
    });

    rules.value = { category_id: defaultRequiredRule };
    return;
  }
  getCaseCategoryItem(value);
}

async function getCaseCategoryItem(id: number) {
  const targetId = Array.isArray(id) ? id[id.length - 1] : id;

  const { error, data } = await ServeCaseCategoryItem({ id: targetId });

  if (!error && data?.fields) {
    fields.value = data.fields;

    // 调用修复后的重置函数，它会保留 category_id
    resetModelAndFields();
  }
}

async function getCaseCategory() {
  const { error, data: res } = await ServeCaseCategory();
  if (!error) {
    menu.value = res.records;
  }
}

watch(visible, async (val) => {
  if (val) {
    handleInitModel();
    getCaseCategory();
  }
});
</script>

<template>
  <NModal
    v-model:show="visible"
    preset="card"
    class="page-modal"
    title="申请律师"
    :block-scroll="true"
    :mask-closable="false"
    :style="{ width: '480px', backgroundColor: '#f9f9f9' }"
  >
    <NForm ref="formRef" :model="model" :rules="rules">
      <NGrid cols="8" x-gap="12" item-responsive responsive="screen">
        <NGridItem span="8 m:8 l:8">
          <NFormItem label="办案类型" path="category_id">
            <NCascader
              v-model:value="model.category_id"
              placeholder="请选择办案类型"
              check-strategy="child"
              value-field="id"
              label-field="name"
              :options="menu"
              filterable
              clearable
              @update:value="handleUpdate"
            />
          </NFormItem>
        </NGridItem>

        <NGridItem
          v-for="(e, index) in fields"
          :key="index"
          span="8 m:8 l:8"
        >
          <NFormItem :label="e.label" :path="e.name">

            <NInput
              v-if="e.type === 'text'"
              v-model:value="model[e.name]"
              :placeholder="'请输入' + e.label"
            />

            <NInput
              v-else-if="e.type === 'textarea'"
              v-model:value="model[e.name]"
              :placeholder="'请输入' + e.label"
              type="textarea"
            />

            <NDatePicker
              v-else-if="e.type === 'date'"
              v-model:value="model[e.name]"
              type="date"
              :placeholder="'请选择' + e.label"
              style="width: 100%"
              clearable
            />

            <NDatePicker
              v-else-if="e.type === 'datetime'"
              v-model:value="model[e.name]"
              type="datetime"
              :placeholder="'请选择' + e.label"
              style="width: 100%"
              clearable
            />

            <MyUpload v-else-if="e.type === 'image'" accept="image/*" v-model:value="model[e.name]" :default-file-list="model[e.name]" :title="'点击上传' + e.label" />
            <MyUpload v-else-if="e.type === 'file'" v-model:value="model[e.name]" :default-file-list="model[e.name]" :title="'点击上传' + e.label" />

            <NInput
              v-else
              v-model:value="model[e.name]"
              :placeholder="'请输入' + e.label"
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

<style scoped></style>
