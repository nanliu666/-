import { del, get, post } from '@/util/axios'

/***
 * @desc  我的导师
 * @params params
 * */
export const myTutorList = (params) =>
  post('/api/blade-manage/v1/tutorManage/foreGround/myTutorList', params)

/***
 * @desc  评价导师
 * @params params
 * */
export const evaluationTutor = (params) =>
  post('/api/blade-manage/v1/tutorManage/foreGround/evaluationTutor', params)

/***
 * @desc  导师详情
 * @params params.id  导师主键（取strId的值）
 * @params params.platFlag  前台我的徒弟只需要入参这个参数，传值1
 * */
export const tutorDetail = (params) => post('/api/blade-manage/v1/tutorManage/tutorDetail', params)

/***
 * @desc  徒弟列表
 * @params params.id              导师id
 * @params params.flag            编辑导师时查询学徒列表，这个字段传1，其他情况不用传值
 * @params params.pageSize        10
 * @params params.pageNo          1
 * @params params.queryCondition  搜索条件（按姓名或手机号）
 * */
export const studentList = (params) => post('/api/blade-manage/v1/tutorManage/studentList', params)

/***
 * @desc  我的档案
 * @params params.userId              用户ID
 * */
export const statistics = (params) => get('/api/blade-manage/v1/personal/center/statistics', params)

/***
 * @desc  查询当前用户含有笔记的课程
 * @params params.pageSize        10
 * @params params.pageNo          1
 * */
export const getNoteCourseList = (params) =>
  get('/api/manage/v1/web/course/getNoteCourseList', params)

/***
 * @desc  操作学徒出师或解约
 * @params params.ids              操作出师时入参（多个，逗号隔开）
 * @params params.completeStatus   出师 （1-是，0-否）
 * @params params.isCancelled      是否解约（1-是，0-否）
 * @params params.cancelReason     解约理由
 * */
export const updateStatus = (params) =>
  post('/api/blade-manage/v1/tutorManage/updateStatus', params)

/***
 * @desc  评价学徒
 * @params params.id        学徒列表主键（从strId取值）
 * @params params.comment   评语
 * @params params.score     评分
 * */
export const evaluateStudent = (params) =>
  post('/api/blade-manage/v1/tutorManage/evaluateStudent', params)

/***
 * @desc  我的分享列表
 * @params params.pageSize        10
 * @params params.pageNo          1
 * */
export const myShareList = (params) => get('/api/manage/v1/knowledge/manage/myShareList', params)

/***
 * @desc  删除知识
 * @params params.id
 * */
export const knowledgeDelete = (params) => del('/api/manage/v1/knowledge/list/delete', params)

/***
 * @desc  查询审批编号
 * @params params.formKey
 * @params params.bizId
 * */
export const getApprInfo = (params) => get('/api/manage/v1/knowledge/manage/getApprInfo', params)
