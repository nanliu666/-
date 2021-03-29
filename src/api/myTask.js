import { post } from '@/util/axios'

/**
 * 查询我的选修课程
 * @param {Object} params
 * @param {Number} params.pageNo 请求页码
 * @param {Number} params.pageSize 每页条数
 */
export const myElectiveCourse = (params) => post('/manage/v1/study/myElectiveCourse', params)
