<!--
 * @Author: etoupcom etoupcom@126.com
 * @Date: 2024-09-05 15:58:41
 * @LastEditors: etoupcom etoupcom@126.com
 * @LastEditTime: 2025-01-06 16:17:24
 * @FilePath: /web/src/views/auth/layout.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script lang="ts" setup>
import { isElectronMode } from '@/utils/common'
</script>

<template>
  <div id="logo-name" v-if="!isElectronMode()"></div>

  <section class="section">
    <router-view />
  </section>

  <div class="copyright">
    <span>©2020 - 2025 悦诉律服管理系统</span>
    <span><a href="http://beian.miit.gov.cn" target="_blank">鄂ICP备2025091252号</a></span>
  </div>

  <div class="fly-box">
    <div class="fly bg-fly-circle1"></div>
    <div class="fly bg-fly-circle2"></div>
    <div class="fly bg-fly-circle3"></div>
    <div class="fly bg-fly-circle4"></div>
  </div>
</template>

<style lang="less" scoped>
body {
  -webkit-app-region: drag;
}
@import '@/assets/css/login.less';

.section {
  height: 100vh;
  width: 100vw;
}

#logo-name {
  font-size: 12px;
  font-family: serif;
}
</style>
