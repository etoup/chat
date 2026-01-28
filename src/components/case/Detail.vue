<!--
 * @Author: etoupcom etoupcom@126.com
 * @Date: 2025-03-21 14:27:23
 * @LastEditors: etoupcom etoupcom@126.com
 * @LastEditTime: 2025-03-26 17:30:41
 * @FilePath: /console/src/views/enterprise-case/modules/detail?.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue';
import { NModal, NCard, NGrid, NGridItem, NSpace, NBadge, NDivider, NImage, NGi, NTabs, NTabPane, NTimeline, NTimelineItem, NEllipsis, NList, NListItem, NButton, NDropdown, NTable, NEmpty} from 'naive-ui'
import { useClipboard } from '@vueuse/core';
import { useCaseDetailStore, useUserStore } from '@/store';
import InformationSave from './modules/information-save.vue';
import Payment from './modules/payment.vue';
import Transfer from './modules/transfer.vue';
import Close from './modules/close.vue';
import Refund from './modules/refund.vue';
import PaymentCode from './modules/payment-code.vue';

defineOptions({
  name: 'EnterpriseCaseDetail'
});

interface Props {
  gid?: any;
}

const props = defineProps<Props>();


const visible = defineModel<boolean>('visible', {
  default: false
});

const caseDetailStore = useCaseDetailStore()
const userStore = useUserStore()
const showModal = ref(false)
const options = ref([]);
const paymentCodeData = ref<any>({});
const paymentCodeVisible = ref(false);

async function getOptions() {
    let list: any = []

    list.push({
        label: '补充资料',
        key: 'a',
        props: {
            onClick: () => caseDetailStore.setInformationVisible(true)
        }
    })

    list.push({
        label: '补收尾款',
        key: 'b',
        props: {
            onClick: () => caseDetailStore.setPaymentVisible(true, 3)
        }
    })

    list.push({
        label: '律师收费',
        key: 'l',
        props: {
            onClick: () => caseDetailStore.setPaymentVisible(true, 6)
        }
    })

    list.push({
        label: '诉讼收费',
        key: 'l',
        props: {
            onClick: () => caseDetailStore.setPaymentVisible(true, 7)
        }
    })

    if (userStore.roles.includes('enterprise_admin') || userStore.roles.includes('mediator')) {
        list.push({
          label: '转交督查',
          key: 'c',
          props: {
              onClick: () => caseDetailStore.setSuperviseVisible(true)
          }
        })
        if (caseDetailStore.detail.status < 7) {
            
            list.push({
                label: '交付结案',
                key: 'd',
                props: {
                    onClick: () => caseDetailStore.setCloseVisible(true)
                }
            })
        }
        
    }

    if (userStore.roles.includes('supervise')) {
        await caseDetailStore.getTransferDetail(caseDetailStore.detail.id)
        if (caseDetailStore.detail.status === 7) {
            
            list.push({
                label: '撤回调解',
                key: 'e',
                props: {
                    onClick: () => {
                        if (caseDetailStore.transferDetail.id > 0) {
                            showModal.value = true
                        } else {
                            window['$message']?.error('督查数据不存在');
                        }
                    }
                }
            })
            list.push({
                label: '退费结案',
                key: 'f',
                props: {
                    onClick: () => {
                        if (caseDetailStore.transferDetail.id > 0) {
                            caseDetailStore.setRefundVisible(true)
                        } else {
                            window['$message']?.error('督查数据不存在');
                        }
                    }
                }
            })
        }
    }

    options.value = list
}

async function handleBack() {
  caseDetailStore.caseCaseTransferBack({id: caseDetailStore.detail.id, relation: 1})
}

function getFileExtension(url) {
    if (!url) return ''; 
    return url.split('.').pop().toLowerCase(); // 转换为小写以确保兼容性
}

function isImageUrl(url) {
    const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'svg', 'webp', 'tiff']; // 可根据需求添加更多图片格式
    const extension = getFileExtension(url);
    return imageExtensions.includes(extension);
}


const { copy, isSupported } = useClipboard();

async function handleCopy(e: string) {
  if (!isSupported) {
    window['$message']?.error('您的浏览器不支持Clipboard API');
    return;
  }

  if (!e) {
    window['$message']?.error('请输入要复制的内容');
    return;
  }

  await copy(e);
  window['$message']?.success(`复制成功`);
}

const shouldScrollToFoot = ref(false);

// function scrollToFoot() {
//   const footElement = document.getElementById('foot');
//   if (footElement) {
//     footElement.scrollIntoView({ behavior: 'smooth' });
//   }
// }

function handlePaymentCode(row: any) {
  paymentCodeData.value = row;
  paymentCodeVisible.value = true;
}

watch(shouldScrollToFoot, (newValue) => {
  if (newValue) {
    // scrollToFoot();
    shouldScrollToFoot.value = false;
  }
});

watchEffect(async () => {
  if (props.gid && caseDetailStore.visible) {
    caseDetailStore.getDetail(props.gid)
  }
});

watch(() => caseDetailStore.detail.code, async (newVal) => {
  if (newVal.length > 0) {

    await caseDetailStore.getSignList(newVal)
    await caseDetailStore.getOrderItems(newVal)
    await caseDetailStore.getRecordList(newVal)
    await caseDetailStore.getInformationList({code: newVal, type: 1})

    getOptions()
  }
})

watch(() => caseDetailStore.informationReload, async (newVal) => {
  if (newVal){
    await caseDetailStore.getInformationList({code: caseDetailStore.detail.code, type: 1})
    shouldScrollToFoot.value = true;
  }
})

watch(() => caseDetailStore.orderReload, async (newVal) => {
  if (newVal){
    await caseDetailStore.getOrderItems(caseDetailStore.detail.code)
  }
})

watch(() => caseDetailStore.detailReload, async (newVal) => {
  if (newVal){
    await caseDetailStore.getDetail(props.gid)
  }
})
</script>

<template>
  <NModal
    v-model:show="visible"
    display-directive="show"
    preset="card"
    class="page-modal"
    title="案件详情"
    :style="{ width: '1280px', backgroundColor: '#f9f9f9' }"
  >
    <NGrid cols="8" x-gap="12" item-responsive responsive="screen">
      <NGridItem span="8 m:8 l:5">
        <div class="page-main">
          
          <div class="page-main-card">
            <div class="page-main-card-top">
              <div class="page-main-card-top-left">案件状态</div>
              <div class="page-main-operate" v-if="userStore.isStaff">
                <NDropdown trigger="hover" :options="options" placement="bottom-end">
                    <NButton type="info" size="small">
                        操作
                    </NButton>
                </NDropdown>
              </div>
            </div>
            <div class="page-main-card-main">
              <NSpace>
                <div class="page-main-card-main-tag">
                  <NBadge dot type="warning" />
                  <span class="page-main-card-main-tag-span">{{ caseDetailStore.detail?.status_txt }}</span>
                </div>
              </NSpace>
              <NDivider />
              <div class="page-main-list">
                <div v-for="(item, index) in caseDetailStore.signList" :key="index" class="page-main-li">
                  <div class="page-main-li-top">
                    <div class="page-main-li-top-left">签约信息</div>
                    <div class="page-main-li-top-right">
                      <NButton
                        size="small"
                        type="info"
                        tag="a"
                        target="_blank"
                        rel="noopener noreferrer"
                        :href="item.signature_url"
                      >
                        合同
                      </NButton>
                    </div>
                  </div>
                  <div class="page-main-li-main">
                    <div class="page-main-li-main-dl">
                      <div class="page-main-li-main-dt">合同名称：</div>
                      <div class="page-main-li-main-dd">
                        {{ item.contract_name }}
                      </div>
                    </div>
                    <div class="page-main-li-main-dl">
                      <div class="page-main-li-main-dt">签约状态：</div>
                      <div v-if="item.status == 1" class="page-main-li-main-dd page-main-li-main-tag page-main-li-c1">
                        {{ item.status_txt }}
                      </div>
                      <div v-if="item.status == 2" class="page-main-li-main-dd page-main-li-main-tag page-main-li-c2">
                        {{ item.status_txt }}
                      </div>
                    </div>
                    <div v-if="item.status == 2" class="page-main-li-main-dl">
                      <div class="page-main-li-main-dt">签字内容：</div>
                      <NImage class="page-image" :src="item.signature_file" />
                    </div>
                    <div v-if="item.status == 2" class="page-main-li-main-dl">
                      <div class="page-main-li-main-dt">签约时间：</div>
                      <div class="page-main-li-main-dd">
                        {{ item.created_at }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <NDivider />
              <div class="page-main-list">
                <div class="page-main-li-top">
                  <div class="page-main-li-top-left">订单信息</div>
                </div>
                <NTable striped :bordered="true" :single-line="false" class="page-main-li-main-table">
                  <thead>
                    <tr>
                      <th>类型</th>
                      <th>渠道</th>
                      <th>凭证</th>
                      <th>金额</th>
                      <th>状态</th>
                      <th>时间</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in caseDetailStore.orderItems" :key="index">
                      <td>{{ item.type_txt }}</td>
                      <td>{{ item.enterprise_payment_channel_name }}</td>
                      <td>
                        <NImage v-for="(i, k) in item.service_files" :key="k" class="page-order-image" :src="i.path" />
                      </td>
                      <td>{{ item.amount }}</td>
                      <td>{{ item.status_txt }}</td>
                      <td>{{ item.created_at }}</td>
                      <td>
                        <NButton type="primary" text tag="a" size="small" @click="() => handlePaymentCode(item)" v-if="item.payment_method === 1 && item.status === 1">
                          收款码
                        </NButton>
                      </td>
                    </tr>
                  </tbody>
                </NTable>
              </div>
              <NDivider />
              <NGrid x-gap="12" y-gap="16" :cols="4">
                <NGi span="4">
                  <div class="page-main-dl">
                    <div class="page-main-dt">案件编号：</div>
                    <div class="page-main-dd">
                      <div>{{ caseDetailStore.detail?.serial_no }}</div>
                      <NButton type="info" size="small" class="copy" @click="() => handleCopy(caseDetailStore.detail?.serial_no)">
                        复制
                      </NButton>
                    </div>
                  </div>
                </NGi>
                <NGi span="4">
                  <div class="page-main-dl">
                    <div class="page-main-dt">客户姓名：</div>
                    <div class="page-main-dd">{{ caseDetailStore.detail?.real_name }}</div>
                  </div>
                </NGi>
                <NGi span="4">
                  <div class="page-main-dl">
                    <div class="page-main-dt">客户电话：</div>
                    <div class="page-main-dd">{{ caseDetailStore.detail?.mobile }}</div>
                  </div>
                </NGi>
                <NGi span="4">
                  <div class="page-main-dl">
                    <div class="page-main-dt">身份证号：</div>
                    <div class="page-main-dd">{{ caseDetailStore.detail?.card_no }}</div>
                  </div>
                </NGi>
              </NGrid>
              <NDivider /> 
              <NGrid cols="s:1 m:2 l:2" responsive="screen" :x-gap="16" :y-gap="16">
                <NGi>
                  <div class="page-card-li page-card-li-a">
                    <div class="page-card-li-top">合同金额</div>
                    <div class="page-card-li-mian">{{Number.parseFloat(caseDetailStore.detail?.contract_amount)}}</div>
                  </div>
                  
                </NGi>
                <NGi>
                  <div class="page-card-li page-card-li-b">
                    <div class="page-card-li-top">服务费金额</div>
                    <div class="page-card-li-mian">{{Number.parseFloat(caseDetailStore.detail?.service_amount)}}</div>
                  </div>
                </NGi>
                <NGi>
                  <div class="page-card-li page-card-li-c">
                    <div class="page-card-li-top">已收款金额</div>
                    <div class="page-card-li-mian">{{Number.parseFloat(caseDetailStore.detail?.amount)}}</div>
                  </div>
                </NGi>
                <NGi>
                  <div class="page-card-li page-card-li-d">
                    <div class="page-card-li-top">待收款金额</div>
                    <div class="page-card-li-mian">{{Number.parseFloat(caseDetailStore.detail?.service_additional_amount)}}</div>
                  </div>
                </NGi>
              </NGrid>
              
              <NDivider />
              <NGrid x-gap="12" y-gap="16" :cols="4">
                <NGi span="4">
                  <div class="page-main-dl">
                    <div class="page-main-dt">尾款比例：</div>
                    <div class="page-main-dd">{{ caseDetailStore.detail?.payment_ratio }}%</div>
                  </div>
                </NGi>
                <NGi span="4">
                  <div class="page-main-dl">
                    <div class="page-main-dt">案件所属：</div>
                    <div class="page-main-dd">{{ caseDetailStore.detail?.enterprise_product_name }}</div>
                  </div>
                </NGi>
                <NGi span="4">
                  <div class="page-main-dl">
                    <div class="page-main-dt">案件描述：</div>
                    <div class="page-main-dd">{{ caseDetailStore.detail?.description }}</div>
                  </div>
                </NGi>
                <NGi span="4">
                  <div class="page-main-dl">
                    <div class="page-main-dt">补充协议：</div>
                    <div class="page-main-dd">{{ caseDetailStore.detail?.agreed_content }}</div>
                  </div>
                </NGi>
                <NGi span="4">
                  <div class="page-main-dl">
                    <div class="page-main-dt">备注信息：</div>
                    <div class="page-main-dd">{{ caseDetailStore.detail?.remark }}</div>
                  </div>
                </NGi>
              </NGrid>
              <NDivider />
              <NGrid x-gap="12" y-gap="16" :cols="4">
                <NGi span="4">
                  <div class="page-main-dl">
                    <div class="page-main-dt">顾问姓名：</div>
                    <div class="page-main-dd">{{ caseDetailStore.detail?.consultant_real_name }}</div>
                  </div>
                </NGi>
                <NGi span="4">
                  <div class="page-main-dl">
                    <div class="page-main-dt">顾问电话：</div>
                    <div class="page-main-dd">{{ caseDetailStore.detail?.consultant_mobile }}</div>
                  </div>
                </NGi>
                <NGi span="4">
                  <div class="page-main-dl">
                    <div class="page-main-dt">顾问部门：</div>
                    <div class="page-main-dd">{{ caseDetailStore.detail?.enterprise_department_name }}</div>
                  </div>
                </NGi>
              </NGrid>

            </div>
          </div>
        </div>
      </NGridItem>
      <NGridItem span="8 m:8 l:3">
        <div class="page-main">
          
          <div class="page-main-card">
            <NTabs type="line" animated>
              <template #suffix>
                  
              </template>
              <NTabPane name="information" tab="案件资料">
                <NEmpty v-if="caseDetailStore.informationList.length === 0" :description="caseDetailStore.informationTip" class="page-content-empty" />
                <NCard
                  v-for="item in caseDetailStore.informationList"
                  :key="item.id"
                  :title="item.name"
                  size="small"
                  class="page-content-card"
                >
                  <NSpace vertical>
                    <div>{{ item.description }}</div>
                    <div>{{ item.record_text }}</div>
                    <NList v-if="item.extra" bordered>
                      <NListItem v-for="(info, index) in item.extra" :key="index">
                        <NSpace align="center" justify="space-between" style="width: 100%;">
                          <NImage class="page-img" v-if="isImageUrl(info.url || info.path)" style="width: 60px; height: 60px;  background-color: #eee; overflow: hidden;" :src="info.url || info.path" />
                          <div>{{ info.name || item.name }}</div>
                          <NButton
                            size="small"
                            tag="a"
                            target="_blank"
                            rel="noopener noreferrer"
                            :href="`https://view.yuesutech.com?fileUrl=${info.url || info.path}`"
                          >
                            预览
                          </NButton>
                        </NSpace>
                      </NListItem>
                    </NList>
                  </NSpace>
                  <template #footer>
                    <div class="page-li-foot">{{ item?.created_at }}</div>
                  </template>
                  <template #action></template>
                </NCard>
                <!-- <div id="foot"></div> -->
              </NTabPane>
              <NTabPane name="progress" tab="案件进度">
                <NEmpty v-if="caseDetailStore.recordList.length === 0" :description="caseDetailStore.recordTip" class="page-content-empty" />
                <NTimeline v-else class="page-content-timeline">
                  <NTimelineItem
                    v-for="item in caseDetailStore.recordList"
                    :key="item.id"
                    type="info"
                    :title="item.title || item.content"
                    :time="item.created_at"
                  >
                    <template #default>
                      <NList v-if="item.extra" bordered>
                        <NListItem v-for="(info, index) in item.extra" :key="index">
                          <NSpace align="center" justify="space-between" style="width: 100%;">
                              <NImage class="page-img" v-if="isImageUrl(info.url)" style="width: 60px; height: 60px;  background-color: #eee; overflow: hidden;" :src="info.url || info.path" />
                              <div>{{ info.content ? info.content : (info.name || item.title) }}</div>
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
                          </NSpace>
                        </NListItem>
                      </NList>
                      <NEllipsis v-else expand-trigger="click" line-clamp="2">
                        {{ item.content }}
                        <template #tooltip>点击展开</template>
                      </NEllipsis>
                    </template>
                  </NTimelineItem>
                </NTimeline>
              </NTabPane>
            </NTabs>
          </div>
        </div>
      </NGridItem>
    </NGrid>
  </NModal>
  <InformationSave v-model:visible="caseDetailStore.informationVisible" :operate-type="caseDetailStore.informationOperateType" />
  <Payment  v-model:visible="caseDetailStore.paymentVisible" />
  <Transfer  v-model:visible="caseDetailStore.superviseVisible" />
  <Close  v-model:visible="caseDetailStore.closeVisible" />
  <Refund v-model:visible="caseDetailStore.refundVisible" />
  <PaymentCode v-model:visible="paymentCodeVisible" :row-data="paymentCodeData" />
  <NModal
    v-model:show="showModal"
    preset="dialog"
    title="提示"
    content="你确认要将该案件撤回给调解?"
    positive-text="确认"
    negative-text="算了"
    @positive-click="handleBack"
  />
</template>

<style scoped>
.page-content-card{
  margin-top: 5px;
}
.page-card {
  width: 1280px;
  padding: 6px 0;
  background-color: #f5f5f5;
}

.page-card-li{
  
  color: #fff;
  padding: 10px;
  border-radius: 3px;
  .page-card-li-top {
    font-size: 14px;
  }
  .page-card-li-mian {
    font-size: 24px;
  }
}

.page-card-li-a{
  background: linear-gradient(to bottom, #ec4786, #b955a4);
}

.page-card-li-b{
  background: linear-gradient(to bottom, #865ec0, #5144b4);
}

.page-card-li-c{
  background: linear-gradient(to bottom, #56cdf3, #719de3);
}

.page-card-li-d{
  background: linear-gradient(to bottom, #fcbc25, #f68057);
}

.page-main {
  height: calc(100vh - 100px);
  overflow-y: auto;
  .page-main-list {
    margin-top: 16px;
    .page-main-li-main-table {
      margin: 15px 0 30px;
    }

    

    .page-order-image {
      border-radius: 3px;
      background: #f5f5f5;
      height: 28px;
      margin-top: 5px;
    }
    .page-main-li-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .page-main-li-top-left {
        font-weight: bold;
      }
    }
    .page-main-li-main {
      .page-main-li-main-dl {
        margin: 10px 0;
        display: flex;
        align-items: center;
        .page-main-li-main-dt {
          color: #999;
          margin-right: 8px;
        }
        .page-main-li-main-dd {
          color: #333;
        }
        .page-main-li-main-tag {
          font-size: 12px;
          height: 28px;
          width: 60px;
          line-height: 28px;
          text-align: center;
          border-radius: 3px;
        }
        .page-main-li-c1 {
          background: #ff9900;
          color: #fff;
        }
        .page-main-li-c2 {
          background: #18a058;
          color: #fff;
        }
        .page-image {
          border-radius: 3px;
          background: #f5f5f5;
          padding-bottom: 2px;
          height: 30px;
          width: 60px;
        }
      }
    }
  }
  .page-main-dl {
    display: flex;
    align-items: center;
    .page-main-dt {
      color: #999;
      margin-right: 8px;
    }
    .page-main-dd {
      color: #333;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .page-main-number {
      font-size: 18px;
      font-weight: bold;
      color: #646cff;
    }
  }
  .page-main-d {
    display: unset;
    .page-main-dt {
      margin-bottom: 5px;
    }
    .page-main-dd {
      .page-main-dd-img {
        display: block;
        height: 128px;
        width: 128px;
        border-radius: 5px;
      }
    }
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
}
</style>
