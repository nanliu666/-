import {
  get,
  post
} from '@/util/axios'
/**
 * 待我审批-列表
 * */
export const waitApproveList = (params) => get('/api/appr/v2/appr/wait/approve/list', params)
/**
 * 我已审批列表
 * */
export const hasApproveList = (params) => get('/api/appr/v2/appr/has/approve/list', params)
/**
 * 我发起的审批列表
 * */
export const myApproveList = (params) => get('/api/appr/v2/appr/my/approve/list', params)
/**
 * 抄送我的审批列表
 * */
export const ccApproveList = (params) => get('/api/appr/v2/appr/cc/approve/list', params)
/**
 * 待我审批->详情编辑
 * @param {String} params.apprNo 
 * */
export const detail = (params) => get('/api/appr/v2/appr/process/apply/detail', params)
/**
 * 流程节点审批记录（针对每个节点的审批记录）
 * @param {String} params.apprNo 
 * */
export const record = (params) => get('/api/appr/v2/appr/apply/record', params)
/**
 * 催一下
 * @param {String} params.apprNo 
 * @param {String} params.processInstanceId 
 * */
export const urge = (params) => post('/api/appr/v2/appr/apply/urge', params)
/**
 * 同意审批
 * @param {String} params.userId 
 * @param {String} params.taskId 
 * @param {String} params.processInstanceId 
 * @param {String} params.comment 
 * */
export const pass = (params) => post('/api/appr/v2/appr/apply/pass', params)
/**
 * 同意审批
 * @param {String} params.userId 
 * @param {String} params.taskId 
 * @param {String} params.processInstanceId 
 * @param {String} params.comment 
 * */
export const reject = (params) => post('/api/appr/v2/appr/apply/reject', params)
/**
 * 课程审核列表-撤回
 * @param {String} params.processInstanceId  
 * */
export const cancel = (params) => get('/api/v2/appr/approve/course/cancel', params)
/**
 * 用户申请详情查询接口
 * @param {object} params 参数
 * @param {string} params.apprNo 审批编号
 * @returns {object}
 */
export const getApprDetail = (params) => get('/appr/v2/appr/process/apply/detail', params)
// 审批历史记录、审批进度
export const getApprRecord = (params) => get('/appr/v2/appr/apply/record', params)
// 撤销
export const createApprCancel = (params) => post('/appr/v2/appr/apply/cancel', params)
// 同意审批
export const createApprPass = (params) => post('/appr/v2/appr/apply/pass', params)
// 审批拒绝
export const createApprReject = (params) => post('/appr/v2/appr/apply/reject', params)
// 催一下
export const createApprUrge = (params) => post('/appr/v2/appr/apply/urge', params)
/**
 * 审批流程查询接口
 * @param {Object} params - 参数
 * @param {String} params.processId - 流程ID
 * */
export const getProcessDetail = (params) => get('/appr/v2/appr/process', params)
