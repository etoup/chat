<script lang="ts" setup>
import '@icon-park/vue-next/styles/index.css'
import { IconProvider, DEFAULT_ICON_CONFIGS } from '@icon-park/vue-next'
import {
  NNotificationProvider,
  NMessageProvider,
  NDialogProvider,
  NConfigProvider,
  zhCN,
  dateZhCN,
  NLayoutContent
} from 'naive-ui'
import hljs from 'highlight.js/lib/core'
import { useUserStore, useTalkStore } from '@/store'
import ws from '@/connect'
import { bus } from '@/utils/event-bus'
import { isLoggedIn, getAccessToken } from '@/utils/auth'
import { NotificationApi, MessageApi, DialogApi } from '@/components/common'
import TokenReceiver from '@/components/common/TokenReceiver.vue'
import UrlTokenParser from '@/components/common/UrlTokenParser.vue'
import UserCardModal from '@/components/user/UserCardModal.vue'
import { ContactConst } from '@/constant/event-bus'
import { watch, ref, onMounted } from 'vue'
import {
  useProvideUserModal,
  useThemeMode,
  useVisibilityChange,
  // useAccessPrompt,
  useUnreadMessage,
  useConnectStatus,
  useClickEvent
} from '@/hooks'



IconProvider({
  ...DEFAULT_ICON_CONFIGS,
  theme: 'outline',
  size: 24,
  strokeWidth: 3,
  strokeLinejoin: 'bevel',
  fill: '#646cff',
  stroke: '#646cff'
})

const { uid: showUserId, isShow: isShowUser } = useProvideUserModal()
const { getDarkTheme, getThemeOverride } = useThemeMode()

const userStore = useUserStore()
const talkStore = useTalkStore()
const tokenLoaded = ref(false)
const currentToken = ref(getAccessToken())

// 监听token更新事件
bus.subscribe('auth:token_updated', (data) => {
  console.log('检测到 token 更新，初始化应用', data);
  currentToken.value = getAccessToken();
  initializeApp();
});

const onChangeRemark = (value) => {
  bus.emit(ContactConst.UpdateRemark, value)
  talkStore.setRemark(value)
}

// 初始化应用
function initializeApp() {
  console.log('初始化应用');
  
  if (isLoggedIn()) {
    console.log('用户已登录，初始化连接');
    
    // 连接WebSocket
    if (!ws.isConnect()) {
      console.log('WebSocket 连接中...');
      ws.connect();
    }
    
    // 加载用户设置
    if (!tokenLoaded.value) {
      console.log('加载用户设置');
      userStore.loadSetting();
      tokenLoaded.value = true;
    }
  } else {
    console.log('用户未登录');
  }
}

// 在组件挂载时执行初始化
onMounted(() => {
  console.log('App 组件已挂载');
  // 检查是否已登录，如果已登录则初始化应用
  if (isLoggedIn() && !tokenLoaded.value) {
    console.log('用户已登录，初始化应用');
    initializeApp();
  }
});

// 初始化其他功能
useVisibilityChange()
// useAccessPrompt()
useUnreadMessage()
useConnectStatus()
useClickEvent()
</script>

<template>
  <!--接收信息提示音-->
  <audio id="audio" preload="preload" muted>
    <source src="@/assets/music.mp3" type="audio/mp3" />
  </audio>

  <!-- 调整 naive-ui 的字重配置 -->
  <n-config-provider
    :theme="getDarkTheme"
    :theme-overrides="getThemeOverride"
    :locale="zhCN"
    :date-locale="dateZhCN"
    :hljs="hljs"
  >
    <n-message-provider>
      <message-api />
    </n-message-provider>

    <n-notification-provider>
      <notification-api />
    </n-notification-provider>

    <n-dialog-provider>
      <dialog-api />
    </n-dialog-provider>

    <n-layout-content>
      <router-view />

      <UserCardModal
        v-model:show="isShowUser"
        v-model:uid="showUserId"
        @update-remark="onChangeRemark"
      />

      <TokenReceiver />
      <UrlTokenParser />
    </n-layout-content>
  </n-config-provider>
</template>

