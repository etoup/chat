
import { post, get } from '@/utils/request'


export const PhraseEdit = (data) => {
    return post('/api/v1/phrase/edit', data)
}
export const CaseRecordCreate = (data) => {
    return post('/api/v1/case/record/create', data)
}

export const PhraseSave = (data) => {
    return post('/api/v1/user/phraseSave', data)
}

export const PhraseList = (data) => {
    return get('/api/v1/user/phraseList', data)
}

export const PhraseRemove = (data) => {
    return post('/api/v1/user/phraseRemove', data)
}
export const CaseProgressSet = (data) => {
    return post('/api/v1/enterprise/case/progressSet', data)
}

export const CaseDetail = (data) => {
    return post('/api/v1/user/caseDetail', data)
}

export const CaseProgress = (data) => {
    return post('/api/v1/user/caseProgress', data)
}

export const CaseComponentList = (data) => {
    return get('/api/v1/enterprise/case/component/list', data)
}
export const CaseSignList = (data) => {
    return get('/api/v1/enterprise/case/signList', data)
}

export const CaseRecords = (data) => {
    return get('/api/v1/enterprise/case/records', data)
}