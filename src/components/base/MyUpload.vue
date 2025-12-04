<!--
 * @Author: etoupcom etoupcom@126.com
 * @Date: 2024-11-19 18:33:19
 * @LastEditors: etoupcom etoupcom@126.com
 * @LastEditTime: 2025-01-08 22:49:46
 * @FilePath: /console/src/components/base/Avatar.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { ServeUserUploadPolicy } from '@/api/user';
import { NUpload, NButton } from 'naive-ui'

interface Props {
  title?: string;
  value?: any;
  defaultFileList: any;
}

interface Emits {
  (e: 'update:value', value: any): void;
}

const props = withDefaults(defineProps<Props>(), {
  title: '上传图片',
  value: []
});
const emit = defineEmits<Emits>();
const action = ref('');
const key = ref();
const data = ref<any>({});
const fileList = ref(props.value || []);

watch(
  () => props.value,
  newValue => {
    fileList.value = newValue || [];
  }
);

onMounted(async () => {
  const res: any = await ServeUserUploadPolicy();
  if (res.code === 200) {
    action.value = res.data.url;
    key.value = res.data.key;
    data.value = {
      policy: res.data.policy,
      OSSAccessKeyId: res.data.accessKeyId,
      Signature: res.data.signature
    };
  }
});

const handleChange = (e: any) => {
  const { fileList: newFileList } = e;
  const list = newFileList.map((item: any) => {
    const url = `${action.value}/${key.value}/${item.id}${item.batchId}/${item.name}`;
    return {
      ...item,
      url,
      path: url,
      fullPath: url,
      key: key.value,
      size: item?.file?.size || item?.size
    };
  });
  emit('update:value', list);
};
const handleBeforeUpload = (e: any) => {
  const { file } = e;
  if (file.status === 'pending') {
    data.value.key = `${key.value}/${file.id}${file.batchId}/${file.name}`;
  }
};
</script>

<template>
  <NUpload
    :action="action"
    :data="data"
    :file-list="fileList"
    :default-file-list="defaultFileList"
    @change="handleChange"
    @before-upload="handleBeforeUpload"
  >
    <NButton>{{ title }}</NButton>
  </NUpload>
</template>

<style scoped></style>
