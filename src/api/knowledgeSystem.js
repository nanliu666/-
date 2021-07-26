import { get, post } from '@/util/axios'

export const getKnowledgeCatalogList = (data) =>
  post('/api/blade-resource/v1/category/getKnowledgeCatalogList', data)

export const queryPlan = (params) => get('/api/manage/v1/study/plan/queryPlan', params)

export const getLiveList = (params) => get('api/common/v1/live/plan/getLivePlanList', params)

export const getKnowledgeList = (params) =>
  get('/api/manage/v1/web/knowledge/getForegroundKnowledgeList', params)

export const getPcKsCourseList = (params) => get('/api/manage/v1/course/getPcKsCourseList', params)

export const getKsRequiredList = (params) =>
  get('/api/manage/v1/study/plan/getKsRequiredList', params)

export const getTrainList = (params) => get('/api/manage/v1/web/getTrainList', params)
