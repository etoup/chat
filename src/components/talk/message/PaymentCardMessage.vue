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
    <div class="main" :class="{ ellipsis: !show }">
      <div class="main_unit">¥</div>
      <div class="main_amount">{{ extra.amount }}</div>
    </div>
    <div class="button" :class="{ ellipsis: !show }">
      <n-button
        size="small"
        type="primary"
        :style="{ width: '100%' }"
      >
        客户需在悦诉APP完成支付
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
    font-size: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: bold;
    margin-bottom: 5px;
    position: relative;
    text-align: center;
  }

  .remark{
    color: #666;
    text-align: center;
    font-weight: 300;
  }

  .main{
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    margin: 15px 0 20px;
    &.ellipsis {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .main_unit {
      margin-right: 5px;
      color: #666;
    }

    .main_amount {
      font-size: 32px;
      font-weight: 400;
      color: #000000;
    }
  }

}
</style>
