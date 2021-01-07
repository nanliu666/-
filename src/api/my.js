import { get, post } from '@/util/axios'
/**
 * 查询个人信息
 * */
export const getuserInfo = (params) => get('/manage/v1/personal/center/userInfo', params)
/**
 * 修改个人信息
 * */
export const setuserInfo = (params) => post('/manage/v1/personal/center/userInfo', params)
/**
 * 修改密码
 * */
export const password = (params) => post('/manage/v1/personal/center/password', params)
/**
 * 我的课程
 * */
export const courseList = (params) => get('/manage/v1/personal/center/courseList', params)
/**
 * 我的考试
 * */
export const examList = (params) => get('/manage/v1/personal/center/examList', params)
/**
 * 我的培训
 * */
export const queryTrainList = (params) => get('/manage/v1/web/queryTrainList', params)
/**
 * 学分学时汇总
 * */
export const summary = (params) => get('/manage/v1/personal/center/summary', params)
/**
 * 我的学分列表
 * */
export const scoreList = (params) => post('/manage/v1/personal/center/scoreList', params)
/**
 * 我的证书
 * */
export const certificateList = (params) => get('/manage/v1/personal/center/certificateList', params)
