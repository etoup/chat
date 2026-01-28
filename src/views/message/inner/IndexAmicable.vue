<!--
 * @Author: etoupcom etoupcom@126.com
 * @Date: 2024-09-05 15:58:41
 * @LastEditors: etoupcom etoupcom@126.com
 * @LastEditTime: 2024-09-05 17:46:36
 * @FilePath: /web/src/views/message/inner/IndexAmicable.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="amicable flex-center">
    <div class="content">
      <img src="@/assets/image/welcome.svg" alt="" />
      <p>欢迎您回到悦诉律服管理系统 (*^__^*)</p>
    </div>
  </div>
</template>

<style lang="less" scoped>
.amicable {
  height: 100%;
  width: 100%;
  -webkit-app-region: drag;
  .content {
    width: 400px;
    height: 300px;
    text-align: center;
    color: #ccc;
    margin-top: -10%;
    font-size: 18px;
    font-weight: 300;
  }
}
</style>
