<script setup>
import { onMounted, onUnmounted } from 'vue';
import { setAccessToken, getAccessToken, isLoggedIn, delAccessToken } from '@/utils/auth';
import { bus } from '@/utils/event-bus';
import { useRouter } from 'vue-router';

const router = useRouter();

// 保存 token 并触发事件通知
function saveTokenAndNotify(token, expiresIn) {
  console.log('TokenReceiver: 保存 token 并通知应用', token ? '有值' : '无值', expiresIn);
  
  if (!token) {
    console.error('TokenReceiver: 尝试保存空token');
    return;
  }
  
  try {
    // 确保expiresIn是数字，如果无效则使用默认值
    const validExpiresIn = typeof expiresIn === 'number' && !isNaN(expiresIn) 
      ? expiresIn 
      : 7200; // 默认2小时
    
    // 先清除可能存在的旧token，避免冲突
    console.log('TokenReceiver: 清除可能存在的旧token');
    try {
      delAccessToken();
    } catch (e) {
      console.warn('TokenReceiver: 清除旧token时出错', e);
    }
    
    // 单点登录场景，简化保存token的逻辑，不需要多次尝试
    console.log('TokenReceiver: 保存token');
    const saveSuccess = setAccessToken(token, validExpiresIn);
    
    if (!saveSuccess) {
      console.error('TokenReceiver: Token保存失败');
      return;
    }
    
    console.log('TokenReceiver: Token保存成功');
    
    // 触发 token 更新事件
    bus.emit('auth:token_updated', { token, expiresIn: validExpiresIn });
    
    // 当 token 保存成功后处理重定向
    handleRedirectAfterTokenSaved();
  } catch (error) {
    console.error('TokenReceiver: 保存token时出错:', error);
  }
}

// 在 token 保存后处理重定向
function handleRedirectAfterTokenSaved() {
  // 单点登录场景，简化登录状态检查和重定向逻辑
  if (isLoggedIn()) {
    console.log('TokenReceiver: 登录状态检查成功，准备重定向');
    redirectToHome();
    return;
  }
  
  // 仅进行一次短延时检查
  console.log('TokenReceiver: 登录状态检查失败，尝试延迟检查');
  
  setTimeout(() => {
    if (isLoggedIn()) {
      console.log('TokenReceiver: 延迟检查成功');
      redirectToHome();
    } else {
      console.error('TokenReceiver: 登录状态检查失败');
    }
  }, 500); // 减少延迟时间
}

// 重定向到首页
function redirectToHome() {
  try {
    // 获取当前路由信息
    const currentRoute = router.currentRoute.value;
    console.log('TokenReceiver: 当前路径:', currentRoute.path);
    
    // 如果当前是登录页或相关认证页面，则重定向到首页
    if (currentRoute.path.includes('/auth/') || currentRoute.path === '/login') {
      console.log('TokenReceiver: 当前在登录相关页面，重定向到首页');
      router.push('/');
    } else if (currentRoute.path === '/') {
      console.log('TokenReceiver: 当前已在首页，不需要重定向或刷新');
      // 移除页面刷新逻辑，避免循环
    } else {
      console.log('TokenReceiver: 当前不在登录页，无需重定向');
    }
  } catch (error) {
    console.error('TokenReceiver: 重定向时出错:', error);
  }
}

// 消息处理函数 - 简化仅处理URL参数中的token
function handleToken(token, userData) {
  console.log('TokenReceiver: 处理token');
  
  if (token) {
    // 处理userData中的过期时间
    let expiresIn = 7200; // 默认2小时
    
    if (userData) {
      // 兼容expires_in和expiresIn两种写法
      expiresIn = userData.expiresIn || userData.expires_in || expiresIn;
      console.log('TokenReceiver: 用户数据:', JSON.stringify(userData, null, 2));
    }
    
    // 保存 token 并通知应用
    saveTokenAndNotify(token, expiresIn);
  } else {
    console.error('TokenReceiver: 收到空token');
  }
}

// 在组件挂载时设置事件订阅
onMounted(() => {
  console.log('TokenReceiver: 组件已挂载');
  
  // 检查 electron API 是否可用
  if (window.electron && typeof window.electron.receiveAuthToken === 'function') {
    console.log('TokenReceiver: Electron API 可用');
    
    try {
      // 使用 Electron API 注册消息处理函数
      window.electron.receiveAuthToken(handleToken);
      console.log('TokenReceiver: 成功注册 receiveAuthToken 回调');
    } catch (error) {
      console.error('TokenReceiver: 注册 receiveAuthToken 回调时出错:', error);
    }
  } else {
    console.log('TokenReceiver: Electron API 不可用或不完整，将使用URL参数认证');
  }
  
  // 订阅URL token事件
  bus.subscribe('auth:token_from_url', (userData) => {
    console.log('TokenReceiver: 收到URL token事件');
    if (userData && userData.token) {
      // 保存token并通知应用
      saveTokenAndNotify(userData.token, userData.expiresIn);
    } else {
      console.error('TokenReceiver: URL token事件数据无效');
    }
  });
});

// 清理事件订阅
onUnmounted(() => {
  console.log('TokenReceiver: 组件卸载，移除事件订阅');
  
  // 取消事件订阅
  bus.unsubscribe('auth:token_from_url');
});
</script>

<template>
  <!-- 此组件不渲染任何内容，只负责处理 token -->
</template> 