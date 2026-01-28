/*
 * @Author: etoupcom etoupcom@126.com
 * @Date: 2024-09-05 15:58:41
 * @LastEditors: etoupcom etoupcom@126.com
 * @LastEditTime: 2024-09-11 15:26:32
 * @FilePath: /web/src/api/user.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { post, get } from '@/utils/request'

// 修改密码服务接口
export const ServeUpdatePassword = (data) => {
  return post('/api/v1/user/change/password', data)
}

// 修改手机号服务接口
export const ServeUpdateMobile = (data) => {
  return post('/api/v1/user/change/mobile', data)
}

// 修改手机号服务接口
export const ServeUpdateEmail = (data) => {
  return post('/api/v1/user/change/email', data)
}

// 修改个人信息服务接口
export const ServeUpdateUserDetail = (data) => {
  return post('/api/v1/user/change/detail', data)
}

// 查询用户信息服务接口
export const ServeGetUserDetail = () => {
  return get('/api/v1/user/detail')
}

// 获取用户相关设置信息
export const ServeGetUserSetting = () => {
  return get('/api/v1/user/setting')
}

export const ServeCollectHandle = (data = {}) => {
  return post('/api/v1/user/collect', data)
}

export const ServeTalkMessageOpen = (data = {}) => {
  return post('/api/v1/talk/message/open', data)
}

export const ServeCaseDetail = (data = {}) => {
  return post('/api/v1/user/caseDetail', data)
}

export const ServeCaseSignList = (data = {}) => {
  return get('/api/v1/user/signList', data)
}

export const ServeCaseOrderItems = (data = {}) => {
  return get('/api/v1/user/orderItems', data)
}

export const ServeCaseInformationList = (data = {}) => {
  return get('/api/v1/user/informationList', data)
}

export const ServeCaseRecordList = (data = {}) => {
  return get('/api/v1/user/recordList', data)
}

export const ServeUserUploadPolicy = (data = {}) => {
  return get('/api/v1/user/policy', data)
}

export const ServeUserWorkTimeOpen = (data = {}) => {
  return get('/api/v1/user/workTimeOpen', data)
}

export const ServeUserWorkTimeClose = (data = {}) => {
  return get('/api/v1/user/workTimeClose', data)
}

export const ServeUserClearGroups = (data = {}) => {
  return get('/api/v1/user/clearGroups', data)
}

export const ServeUserClearSuperviseGroups = (data = {}) => {
  return get('/api/v1/user/clearSuperviseGroups', data)
}

export const ServeCaseComponentSave = (data = {}) => {
  return post('/api/v1/enterprise/case/component/save', data)
}

export const ServePaymentChannelSelect = (data = {}) => {
  return get('/api/v1/enterprise/payment/channel/select', data)
}

export const ServeProgressItemSelect = (data = {}) => {
  return get('/api/v1/user/progressItemSelect', data)
}


export const ServeCaseBalanceOrder = (data = {}) => {
  return post('/api/v1/enterprise/case/balanceOrder', data)
}

export const ServeCaseDepartments = (data = {}) => {
  return post('/api/v1/enterprise/case/departments', data)
}

export const ServeCaseSupervise = (data = {}) => {
  return post('/api/v1/enterprise/case/supervise', data)
}

export const ServeCaseClose = (data = {}) => {
  return post('/api/v1/enterprise/case/close', data)
}

export const ServeCaseContracts = (data = {}) => {
  return post('/api/v1/enterprise/case/contracts', data)
}

export const ServeCaseTransferBack = (data = {}) => {
  return post('/api/v1/enterprise/case/transfer/back', data)
}

export const ServeCaseRefund = (data = {}) => {
  return post('/api/v1/enterprise/case/refund', data)
}

export const ServeCaseTransferDetail = (data = {}) => {
  return post('/api/v1/enterprise/case/transfer/detail', data)
}

export const ServeCaseTransferComponentSave = (data = {}) => {
  return post('/api/v1/enterprise/case/transfer/componentSave', data)
}
