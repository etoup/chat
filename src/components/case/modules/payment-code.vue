<script setup lang="ts">
import { ref, watch } from 'vue';
import { NModal, NCard, NGrid, NGridItem, NQrCode} from 'naive-ui'

defineOptions({
  name: 'EnterpriseCaseOrderPaymentCode'
});

interface Props {
  rowData?: any;
}

const props = defineProps<Props>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const url = ref<string>('');

watch(visible, () => {
  if (visible.value) {
    url.value = `https://huifu.yuesutech.com/?code=${props.rowData?.out_trade_no}`;
  }
});
</script>

<template>
  <NModal v-model:show="visible" display-directive="show">
    <NCard class="page-card" :bordered="false" size="small" role="dialog" aria-modal="true">
      <NGrid cols="8" x-gap="12" item-responsive responsive="screen">
        <NGridItem span="8 m:8 l:8">
          <div class="page-main">
            <div class="page-main-top">
              <div class="text-center">
                <h2 class="text-2xl font-bold">手机扫描二维码支付</h2>
                <p class="">请在手机上打开微信或支付宝扫码支付</p>
              </div>
              <div class="text-center">
                <p class="mb-1">{{ props.rowData?.out_trade_no }}</p>
              </div>
            </div>
            <NQrCode
              class="n-qr-code"
              :size="235"
              :value="url"
              icon-src="https://yuesu.oss-cn-beijing.aliyuncs.com/files/huifilogo.png"
              type="svg"
              :icon-size="32"
              error-correction-level="H"
            />
          </div>
        </NGridItem>
      </NGrid>
    </NCard>
  </NModal>
</template>

<style scoped>
.page-card {
  width: 380px;
  padding: 40px;
  background-color: #646cff;
}

.page-main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
  .page-main-top {
    color: aliceblue;
  }
  .n-qr-code {
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
</style>
