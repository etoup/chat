<script lang="ts" setup>
import { ServeTalkMessageOpen } from '@/api/user';
import { useTalkStore } from '@/store';
import { ITalkRecordExtraMention, ITalkRecord } from '@/types/chat'
import { useRouter } from 'vue-router';

defineProps<{
  extra: ITalkRecordExtraMention
  data: ITalkRecord
  maxWidth?: Boolean
}>()

const router = useRouter()
const talkStore = useTalkStore()

const onToTalk = async (data: ITalkRecord) => {
  if (data.extra.receiver_id > 0) {
    console.log(data)
    const res = await ServeTalkMessageOpen({
      receiver_id: data.receiver_id,
      talk_type: data.talk_type,
      msg_ids: [data.msg_id],
    })
    if (res.code ===200) {
      talkStore.toTalk(2, data.extra.receiver_id, router)
    }
  }
}

</script>
<template>
  <section class="im-message-mention" @click="onToTalk(data)">
    <h4 :class="data.is_open === 1 ? 'page-color-green' : 'page-color-red'">重要消息通知</h4>
    <p>时间：{{ extra.datetime }} (CST)</p>
    <p v-if="extra.type === 1">提示：{{ extra.name }}@了你</p>
    <p v-if="extra.type === 1">消息：{{ extra.content }}</p>
    <p v-if="extra.type === 2">提示：{{ extra.name }}</p>
    <p v-if="extra.type === 2">说明：{{ extra.content }}</p>
    <p>备注：{{ extra.remark }}</p>
  </section>
</template>
<style lang="less" scoped>
.im-message-mention {
  width: 300px;
  min-height: 50px;
  background: var(--im-message-bg-color);
  border-radius: 5px;
  padding: 15px;
  color: var(--im-text-color);
  .page-color-red {
    color: #ff6600;
  }
  .page-color-green {
    color: #00cc00;
  }
  p {
    font-size: 13px;
    margin: 10px 0;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
