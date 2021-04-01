import { get, post } from '@/util/axios'

/**
 * 查询学习待办条数
 */
export const studyTodoNum = (params) => get('/manage/v1/study/studyTodoNum', params)
/**
 * 查询考试待办条数
 */
export const examTodoNum = (params) => get('/manage/v1/study/examTodoNum', params)
/**
 * 查询我的课程目录
 * @param {Object} params
 * @param {string} params.studyType  0：必修课；1：选修课
 */
export const myCourseCatalog = (params) => get('/manage/v1/study/myCourseCatalog', params)
/**
 * 学员端我的直播列表
 * @param {number} params.pageSize 页面数量
 * @param {number} params.pageNo  页码
 */
export const liveStudentList = (params) => get('api/common/v1/live/liveStudentList', params)
/**
 * 我的任务-选修课接口
 * @param {number} params.pageSize 页面数量
 * @param {number} params.pageNo  页码
 */
export const electiveCourse = (params) => post('api/manage/v1/study/myElectiveCourse', params)
