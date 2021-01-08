import request from '@/util/axios'

export const getList = (params) => {
  return request({
    url: '/api/blade-manage/v1/web/queryTrainList',
    method: 'get',
    params
  })
}
export const getDetail = (params) => {
  return request({
    url: '/api/blade-manage/v1/train/getTrainDetail',
    method: 'get',
    params
  })
}

export function getCourseList(params) {
  return request({
    url: '/api/blade-manage/v1/web/course/queryCourseList',
    method: 'get',
    params
  })
}

export function queryExamList(params) {
  return request({
    url: '/api/blade-manage/v1/web/course/queryExamList',
    method: 'get',
    params
  })
}

export function getOfflineTodo(params) {
  return request({
    url: '/api/blade-manage/v1/train/getOfflineTodo',
    method: 'get',
    params
  })
}
export function getOnlineCourse(params) {
  return request({
    url: '/api/blade-manage/v1/train/getOnlineCourse',
    method: 'get',
    params
  })
}
export function getTrainExamList(params) {
  return request({
    url: '/api/blade-manage/v1/train/examList',
    method: 'get',
    params
  })
}

export function getExamDetail(params) {
  return request({
    url: '/api/blade-manage/v1/train/examDetail',
    method: 'get',
    params
  })
}

export function getTrainEvaluate(params) {
  return request({
    url: '/api/blade-manage/v1/train/queryEvaluate',
    method: 'get',
    params
  })
}

export function addEvaluate(data) {
  return request({
    url: '/api/blade-manage/v1/train/addEvaluate',
    method: 'post',
    data
  })
}

export function studentList(params) {
  return request({
    url: '/api/blade-manage/v1/web/course/studentList',
    method: 'get',
    params
  })
}

export function examResult(params) {
  return request({
    url: '/api/blade-manage/v1/train/examResult',
    method: 'get',
    params
  })
}
