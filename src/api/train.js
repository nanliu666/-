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
// 查询培训安排(线上课程/线下课程/考试信息)
export function getTrainDate(params) {
  return request({
    url: '/api/blade-manage/v1/web/train/queryTrainDate',
    method: 'get',
    params
  })
}
// 查询培训安排(线上课程/线下课程/考试信息)
export function getTrainInfo(params) {
  return request({
    url: '/api/blade-manage/v1/web/train/queryTrainInfo',
    method: 'get',
    params
  })
}
// 获取报名状态
export function getTrainState(params) {
  return request({
    url: '/manage/v1/train/join/state',
    method: 'get',
    params
  })
}
// 立即报名课程
export function signUp(data) {
  return request({
    url: '/manage/v1/train/apply/join',
    method: 'post',
    data
  })
}
// 查询培训上报材料
export function getFileLists(params) {
  return request({
    url: 'api/manage/v1/trainsubmitfile/listSubmitFile',
    method: 'get',
    params
  })
}
// 保存培训上报材料
export function saveFile(data) {
  return request({
    url: 'api/manage/v1/trainsubmitfile/saveFile',
    method: 'post',
    data
  })
}
// 删除培训上报材料
export function deleteSubmitFile(params) {
  return request({
    url: 'api/manage/v1/trainsubmitfile/deleteSubmitFile',
    method: 'get',
    params
  })
}
