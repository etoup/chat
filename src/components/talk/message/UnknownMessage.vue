<script setup>
const props = defineProps({
  extra: Object,
  data: Object
})
</script>

<template>
  <div class="im-message-unknown">[{{ data.msg_type }}] {{data.msg_type === 15 ? '请到悦诉APP完成支付' : '未知消息类型' }}</div>
</template>

<style lang="less" scoped>
.im-message-unknown {
  height: 35px;
  line-height: 35px;
  border-radius: 20px;
  color: #979191;
  background: #eff0f1;
  min-width: 150px;
  text-align: center;
  padding: 0 10px;
  font-weight: 300;
}
</style>
