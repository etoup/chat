<!--
 * @Author: etoupcom etoupcom@126.com
 * @Date: 2025-03-21 14:27:23
 * @LastEditors: etoupcom etoupcom@126.com
 * @LastEditTime: 2025-03-26 17:30:41
 * @FilePath: /console/src/views/enterprise-case/modules/detail?.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup lang="ts">
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { NModal, NGrid, NGridItem, NForm, NFormItem, NInput, NSpace, NButton, NTimeline, NTimelineItem, NList, NListItem, NDatePicker} from 'naive-ui'
import { computed, reactive, ref, watch } from 'vue';
import { DocumentFolder } from '@icon-park/vue-next'
import MyUpload from '@/components/base/MyUpload.vue'
import { useCaseDetailStore } from '@/store';

defineOptions({
  name: 'EnterpriseCaseFollow'
});

interface Props {
  item?: any;
}

const props = defineProps<Props>();


const visible = defineModel<boolean>('visible', {
  default: false
});

const caseDetailStore = useCaseDetailStore()

type Model = Pick<any, 'id' | 'name' | 'record_text' | 'record_json' | 'hidden' | 'reminded_at'>;

const model: Model = reactive(createDefaultModel());

const { formRef, validate, restoreValidation } = useNaiveForm();
const { defaultRequiredRule } = useFormRules();

type RuleKey = Exclude<keyof Model, 'id' | 'record_json' | 'hidden' | 'record_text' | 'reminded_at'>;

const rules: Record<RuleKey, any> = {
  name: defaultRequiredRule,
};

const title = computed(() => `案件跟进《${props.item?.remark || props.item?.title || props.item?.name}》`);

function createDefaultModel(): Model {
  return {
    id: null,
    name: '',
    record_text: null,
    record_json: null,
    reminded_at: null,
    hidden: 0
  };
}

function closeDrawer() {
  visible.value = false;
}

function handleInitModel() {
  Object.assign(model, createDefaultModel(), { id: 0 });
}

async function handleSubmit() {
  await validate();
  await caseDetailStore.caseComponentSave({...model, enterprise_case_id: props.item.enterprise_case_id, type: 2});
  await caseDetailStore.getFollowList({enterprise_case_id: props.item.enterprise_case_id, type: 2})
  handleInitModel();
  restoreValidation();
}

watch(visible, async () => {
  if (visible.value) {
    restoreValidation();
    await caseDetailStore.getFollowList({enterprise_case_id: props.item.enterprise_case_id, type: 2})
  }
});
</script>

<template>
  <NModal
    v-model:show="visible"
    display-directive="show"
    preset="card"
    class="page-modal"
    :title="title"
    :style="{ width: '980px', backgroundColor: '#f9f9f9' }"
  >
    <NGrid cols="8" x-gap="12" item-responsive responsive="screen">
      <NGridItem span="8 m:8 l:5">
        <div class="page-main">
          <div class="page-main-card">
            <NEmpty v-if="caseDetailStore.informationList.length === 0" :description="caseDetailStore.informationTip" class="page-content-empty" />
            <NTimeline class="page-content-timeline">
              <NTimelineItem
                v-for="item in caseDetailStore.informationList"
                :key="item.id"
                type="info"
                :title="item.name || item.content"
                :time="item.created_at"
              >
                <template #header>
                  <div class="page-title">{{ item.name || item.content }}</div>
                  <div class="page-remark" v-if="item.record_text">{{ item.record_text }}</div>
                </template>
                <template #default>
                  <NList v-if="item.extra" bordered>
                    <NListItem v-for="(info, index) in item.extra" :key="index">
                      <template #prefix>
                        <NButton strong secondary circle>
                          <template #icon>
                            <NIcon><DocumentFolder /></NIcon>
                          </template>
                        </NButton>
                      </template>
                      <template #suffix>
                        <NButton
                          v-if="!info.content"
                          size="small"
                          tag="a"
                          target="_blank"
                          rel="noopener noreferrer"
                          :href="`https://view.yuesutech.com?fileUrl=${info.url || info.path}`"
                        >
                          预览
                        </NButton>
                      </template>
                      {{ info.content ? info.content : (info.name || item.title) }}
                    </NListItem>
                  </NList>
                  <NList v-if="item.content_files && item.content_files.length > 0" bordered>
                    <NListItem v-for="(info, index) in item.content_files" :key="index">
                      <template #prefix>
                        <NButton strong secondary circle>
                          <template #icon>
                            <NIcon><DocumentFolder /></NIcon>
                          </template>
                        </NButton>
                      </template>
                      <template #suffix>
                        <NButton
                          size="small"
                          tag="a"
                          target="_blank"
                          rel="noopener noreferrer"
                          :href="`https://view.yuesutech.com?fileUrl=${info.path}`"
                        >
                          预览
                        </NButton>
                      </template>
                      {{ info.name }}
                    </NListItem>
                  </NList>
                  <NEllipsis v-else expand-trigger="click" line-clamp="2">
                    {{ item.content }}
                    <template #tooltip>点击展开</template>
                  </NEllipsis>
                </template>
                <template #footer>
                  <div class="page-foot">
                    <div class="page-foot-left">来自：{{ item.real_name }}</div>
                    <div class="page-foot-right">{{ item.created_at }}</div>
                  </div>
                </template>
              </NTimelineItem>
            </NTimeline>
          </div>
        </div>
      </NGridItem>
      <NGridItem span="8 m:8 l:3">
        <div class="page-main">
          <div class="page-main-card">
            <NForm ref="formRef" :model="model" :rules="rules">
              <NFormItem label="标题" path="name">
                <NInput v-model:value="model.name" clearable placeholder="请填写跟进标题" />
              </NFormItem>
              <NFormItem label="预约时间" path="reminded_at">
                <NDatePicker v-model:value="model.reminded_at" style="width: 100%;" type="datetime" clearable placeholder="请选择预约提醒时间" />
              </NFormItem>
              <NFormItem label="描述" path="record_text">
                <NInput
                  v-model:value="model.record_text"
                  type="textarea"
                  :autosize="{ minRows: 3 }"
                  maxlength="2000"
                  show-count
                  clearable
                  placeholder="请填写跟进描述"
                />
              </NFormItem>
              <NFormItem label="资料" path="record_json">
                <MyUpload v-model:value="model.record_json" :default-file-list="model.record_json" title="上传资料" />
              </NFormItem>
              <NSpace :size="16" justify="end">
                <NButton @click="closeDrawer">关闭</NButton>
                <NButton type="primary" @click="handleSubmit">提交</NButton>
              </NSpace>
            </NForm>
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
.page-card {
  width: 980px;
  padding: 6px 0;
  background-color: #f5f5f5;
}
.page-main {
  height: calc(100vh - 300px);
  overflow-y: auto;
}
.page-main-card {
    background-color: #fff;
    border-radius: 5px;
    padding: 16px;
    margin-bottom: 16px;
    .page-main-card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      .page-main-card-top-left {
        font-size: 14px;
        font-weight: bold;
      }
      .page-main-card-top-right {
        font-size: 14px;
        color: #666;
      }
    }
    .page-main-card-main {
      .page-main-card-main-tag {
        display: flex;
        align-items: center;
        margin-right: 8px;
        font-size: 14px;
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
    font-size: 12px;
    color: #333;
    font-weight: 500;
  }
  .page-remark{
    font-size: 14px;
    color: #999;
    font-weight: 400;
    margin: 6px 0;
    background-color: #f9f9f9;
    padding: 10px;
    border-radius: 5px;
  }
  .page-foot{
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #ccc;
  }
</style>
