/*
 * @Author: etoupcom etoupcom@126.com
 * @Date: 2024-09-05 15:58:41
 * @LastEditors: etoupcom etoupcom@126.com
 * @LastEditTime: 2024-09-05 17:53:32
 * @FilePath: /web/src/hooks/useAccessPrompt.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export const useAccessPrompt = () => {
  // 3秒后获取用户浏览器权限
  setTimeout(() => {
    window['$notification'].create({
      title: '友情提示',
      content: '此站点为悦诉律服管理系统，请勿进行非法操作、上传或发布违法资讯。',
      duration: 30000
    })
  }, 3000)
}
