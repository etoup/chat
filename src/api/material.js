import { post, get } from '@/utils/request'

export const ServeMaterialSelect = () => {
  return get('/api/v1/material/select')
}

export const ServeMaterialRecordSave = (data) => {
  return post('/api/v1/material/record/save', data)
}

export const ServeMaterialRecordUpdate = (data) => {
  return post('/api/v1/material/record/update', data)
}

export const ServeMaterialRecordPublish = (data) => {
  return post('/api/v1/material/record/publish', data)
}