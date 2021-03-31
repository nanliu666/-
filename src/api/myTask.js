import { post, get } from '@/util/axios'

/**
 * 查询我的选修课程
 * @param {Object} params
 * @param {Number} params.pageNo 请求页码
 * @param {Number} params.pageSize 每页条数
 */
export const myElectiveCourse = (params) => post('/manage/v1/study/myElectiveCourse', params)

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
