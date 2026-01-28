<script lang="ts" setup>
import { Peoples, Announcement, MenuUnfoldOne, MenuFoldOne , MoreTwo } from '@icon-park/vue-next'
import { useDialogueStore } from '@/store'
import { ref, watch } from 'vue'
import {NPopselect} from 'naive-ui'
import { CaseProgress, CaseProgressSet } from '@/api/case'

const props = defineProps({
  type: {
    type: Number,
    default: 1
  },
  username: {
    type: String,
    default: ''
  },
  online: {
    type: Boolean,
    default: false
  },
  keyboard: {
    type: Boolean,
    default: false
  },
  num: {
    type: Number,
    default: 0
  },
  status: {
    type: Number,
    default: 0
  },
  options: {
    type: Array<any>,
    default: () => []
  }
})

const dialogueStore = useDialogueStore()
const emit = defineEmits(['evnet'])

const case_progress_item_id = ref(0)

const label = ref('进度待标记')

const onSetMenu = () => {
  dialogueStore.isShowSessionList = !dialogueStore.isShowSessionList
}

const handleUpdate = async (val: string) => {
  const res = await CaseProgressSet({group_id: dialogueStore.talk.receiver_id, enterprise_case_progress_item_id: case_progress_item_id.value})
  if (res.code === 200) {
    const i = props.options.findIndex((item: any) => item.value === val)
    const selectedOption: any = props.options[i]
    label.value = selectedOption.label
    case_progress_item_id.value = selectedOption.value  
  }
}

watch(
  () => [dialogueStore.talk.receiver_id, props.options],
  async ([talk, options]) => {
    if (talk && Array.isArray(options) && options.length > 0) {
      const res = await CaseProgress({ group_id: talk });
      if (res.code === 200) {
        const { enterprise_case_progress_item_id } = res.data;
        if (enterprise_case_progress_item_id == 0) {
          label.value = '进度待标记';
          case_progress_item_id.value = 0;
          return;
        }
        const selectedOption = options.find((item: any) => item.value === enterprise_case_progress_item_id);
        if (selectedOption) {
          label.value = selectedOption.label;
          case_progress_item_id.value = selectedOption.value;
        }
      } else {
        label.value = '进度待标记';
        case_progress_item_id.value = 0;
      }
    }
  },
  { immediate: true }
);

</script>

<template>
  <header class="el-header box-header">
    <div class="menu bdr-r pointer" @click="onSetMenu">
      <n-icon
        :component="dialogueStore.isShowSessionList ? MenuUnfoldOne : MenuFoldOne"
        :size="22"
      />
    </div>

    <div class="module left-module">
      <span class="tag" :class="{ red: type == 1 }">
        {{ type == 1 ? '好友' : '群聊' }}
      </span>

      <span v-if="status === 10" class="tag" :class="{ red: type !== 1 }">
        已结案
      </span>

      <n-popselect v-else-if="type !== 1" v-model:value="case_progress_item_id" :options="options" trigger="click" @update:value="handleUpdate">
        <span class="tag" :class="{ red: type !== 1 }">
          {{ label }}
        </span>
      </n-popselect>
     
      <span class="nickname">{{ username }}</span>
      <span class="num" v-show="type == 2 && num">({{ num }})</span>
      <span class="mr10"></span>
      
    </div>

    <div class="module center-module" v-if="type == 1">
      <p class="online">
        <span class="online-status" v-show="online"></span>
        <span>{{ online ? '在线' : '离线' }}</span>
      </p>
      <p class="keyboard-status" v-show="keyboard">对方正在输入 ...</p>
    </div>

    <div class="module right-module">
      <n-icon
        v-show="type == 2"
        :component="Announcement"
        :size="18"
        class="icon"
        @click="emit('evnet', 'notice')"
      />
      <n-icon
        v-show="type == 2"
        :component="Peoples"
        :size="18"
        class="icon"
        @click="emit('evnet', 'group')"
      />
      <n-icon
        v-show="type == 2"
        :component="MoreTwo"
        :size="18"
        class="icon"
        @click="emit('evnet', 'caseDetail')"
      />
      
    </div>
  </header>
</template>

<style lang="less" scoped>
.box-header {
  height: 60px;
  padding: 0 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  -webkit-app-region: drag;
  position: relative;

  .mr10{
    margin-right: 10px;
  }
  .menu {
    width: 50px;
    position: absolute;
    // height: inherit;
    display: flex;
    align-items: center;
    left: 0;
    justify-content: center;
  }

  .module {
    height: 100%;
    display: flex;
    align-items: center;
  }

  .left-module {
    padding-right: 5px;
    padding-left: 50px;

    .tag {
      background: rgb(81 139 254);
      height: 18px;
      line-height: 18px;
      padding: 1px 5px;
      font-size: 10px;
      color: white;
      border-radius: 3px;
      margin-right: 8px;
      flex-shrink: 0;
      cursor: pointer;

      &.red {
        background: #f97348;
      }
    }

    .nickname {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .center-module {
    flex-direction: column;
    justify-content: center;

    width: 100px;

    .online {
      color: #cccccc;
      font-weight: 300;
      font-size: 15px;
      width: 50px;
      text-align: center;

      &.color {
        color: #1890ff;
      }

      .online-status {
        position: relative;
        top: -1px;
        display: inline-block;
        width: 6px;
        height: 6px;
        vertical-align: middle;
        border-radius: 50%;
        position: relative;
        background-color: #1890ff;
        margin-right: 5px;

        &:after {
          position: absolute;
          top: -1px;
          left: -1px;
          width: 100%;
          height: 100%;
          border: 1px solid #1890ff;
          border-radius: 50%;
          -webkit-animation: antStatusProcessing 1.2s ease-in-out infinite;
          animation: antStatusProcessing 1.2s ease-in-out infinite;
          content: '';
        }
      }
    }

    .keyboard-status {
      height: 20px;
      line-height: 18px;
      font-size: 10px;
      animation: inputfade 600ms infinite;
      -webkit-animation: inputfade 600ms infinite;
    }
  }

  .right-module {
    width: 200px;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    p {
      cursor: pointer;
      margin: 0 8px;
      font-size: 20px;
      color: #828f95;
      &:active i {
        font-size: 26px;
        transform: scale(1.3);
        transition: ease 0.5s;
        color: red;
      }
    }

    .icon {
      cursor: pointer;
      margin: 0 8px;
    }
  }
}

/* css 动画 */
@keyframes inputfade {
  from {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }

  to {
    opacity: 1;
  }
}

@-webkit-keyframes inputfade {
  from {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }

  to {
    opacity: 1;
  }
}

@-webkit-keyframes antStatusProcessing {
  0% {
    -webkit-transform: scale(0.8);
    transform: scale(0.8);
    opacity: 0.5;
  }

  to {
    -webkit-transform: scale(2.4);
    transform: scale(2.4);
    opacity: 0;
  }
}

@keyframes antStatusProcessing {
  0% {
    -webkit-transform: scale(0.8);
    transform: scale(0.8);
    opacity: 0.5;
  }

  to {
    -webkit-transform: scale(2.4);
    transform: scale(2.4);
    opacity: 0;
  }
}

.tag {
  background: rgb(81 139 254);
  height: 18px;
  line-height: 18px;
  padding: 1px 3px;
  font-size: 10px;
  color: white;
  border-radius: 3px;
  margin-right: 8px;
  flex-shrink: 0;

  &.red-color {
    background: #f97348;
  }
}
</style>
