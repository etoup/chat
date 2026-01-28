<script lang="ts" setup>
import { ref } from 'vue'
import {  ITalkRecord } from '@/types/chat'
import { Right} from '@icon-park/vue-next'
import { get } from '@/utils/request'

defineProps<{
  extra: any
  data: ITalkRecord
  maxWidth?: Boolean
}>()

let show = ref(false)

async function onClick(url: string) {
  await get(url)
} 

</script>
<template>
  <section class="im-message-group-notice pointer" @click="show = !show">
    <div class="title">
      {{ extra.title }}
    </div>
    <div class="remark" v-if="extra.remark">
      {{ extra.remark }}
    </div>
    <div class="file" :class="{ ellipsis: !show }">
      <a :href="extra.file_url" target="_blank">
        {{ extra.file_name }}
      </a>
      <n-icon
        class="icon"
        :component="Right"
        :size="16"
        :style="{ transform: show ? 'rotate(90deg)' : 'rotate(0deg)' }"
        :class="{ rotate: show }"
        :color="'#999'"
      />
    </div>
    <div class="button" :class="{ ellipsis: !show }">
      <n-button
        size="small"
        type="primary"
        @click="onClick(extra.api_url)"
        :style="{ width: '100%' }"
      >
        {{ extra.button_txt }}
      </n-button>
    </div>
  </section>
</template>

<style lang="less" scoped>
.im-message-group-notice {
  min-width: 200px;
  max-width: 500px;
  min-height: 10px;
  border-radius: 10px;
  padding: 8px 10px;
  border: 1px solid var(--im-message-border-color);
  user-select: none;

  .title {
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 400;
    margin-bottom: 5px;
    position: relative;
  }

  .file{
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    a {
      color: #0647d2;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
      flex: 1;
    }
  }

}
</style>
