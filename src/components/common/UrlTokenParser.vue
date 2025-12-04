<script setup>
import { onMounted, onBeforeMount, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vue-router';
import { bus } from '@/utils/event-bus';
import { isLoggedIn } from '@/utils/auth';

const route = useRoute();
let loginInProgress = false;

function parseUrlParams() {
  try {
    // 如果已经登录成功，则可以清理URL参数
    if (isLoggedIn() && window.location.search.includes('token=')) {
      cleanUrl();
      return true;
    }
    
    // 如果登录流程已经开始但尚未完成，不做任何处理
    if (loginInProgress) {
      return false;
    }
    
    // 检查URL参数 - 优先检查查询参数（search部分）
    const urlParams = new URLSearchParams(window.location.search);
    
    // 检查是否有token参数
    const token = urlParams.get('token');
    const refreshToken = urlParams.get('refreshToken');
    const expiresIn = urlParams.get('expiresIn');
    
    // 如果找到token参数，则处理它
    if (token) {
      loginInProgress = true;
      
      // 构建用户数据
      const userData = {
        token,
        refreshToken: refreshToken || '',
        expiresIn: expiresIn ? parseInt(expiresIn, 10) : 7200
      };
      
      // 发送事件
      bus.emit('auth:token_from_url', userData);
      
      // 不立即清除URL，等待登录成功后再清除
      
      return true;
    }
    
    return false;
  } catch (error) {
    return false;
  }
}

// 清理URL中的参数
function cleanUrl() {
  try {
    // 保留hash部分（路由），但移除所有查询参数
    const cleanUrl = window.location.origin + 
                     window.location.pathname + 
                     window.location.hash.split('?')[0]; // 只保留hash中的路由部分
    
    // 使用replaceState更新URL，不会触发页面刷新
    window.history.replaceState({}, document.title, cleanUrl);
    
    loginInProgress = false;
  } catch (error) {
    console.error('UrlTokenParser: 清理URL时出错:', error);
  }
}

// 订阅认证成功事件
bus.subscribe('auth:token_updated', () => {
  console.log('UrlTokenParser: 收到认证成功事件');
  setTimeout(() => {
    if (isLoggedIn() && window.location.search.includes('token=')) {
      console.log('UrlTokenParser: 登录成功，现在清除URL参数');
      cleanUrl();
    }
  }, 1000); // 延迟1秒，确保登录完全处理完成
});

// 创建一个监视器，只在登录成功后检查URL变化
function setupUrlMonitor() {
  // 定期检查URL中是否包含敏感参数
  const checkInterval = setInterval(() => {
    // 只有在已登录状态才清除URL参数
    if (isLoggedIn() && (window.location.search.includes('token=') || 
        window.location.hash.includes('token='))) {
      console.log('UrlTokenParser: 已登录状态下检测到URL中仍有token参数，清理');
      cleanUrl();
    }
  }, 2000); // 每2秒检查一次
  
  // 组件卸载时清除定时器
  onBeforeUnmount(() => {
    clearInterval(checkInterval);
  });
}

// 在组件挂载时检查URL参数
onMounted(() => {
  console.log('UrlTokenParser: 组件已挂载');
  // 解析URL参数
  parseUrlParams();
  // 设置URL监视器
  setupUrlMonitor();
});

// 监视路由变化，确保在路由变化后也检查URL参数
watch(() => route.fullPath, (newPath, oldPath) => {
  if (newPath !== oldPath) {
    console.log('UrlTokenParser: 路由已变化，重新检查URL参数');
    setTimeout(parseUrlParams, 100);
  }
});
</script>

<template>
  <!-- 此组件不渲染任何内容，只负责处理URL参数 -->
</template> 