import { get } from '@/util/axios'

/**
 * 根据课程分类查询下一级分类
 * @param {Object} params
 * @param {String} params.id 分类ID
 */
export const newsList = (params) => get('/manage/v1/web/newsList', params)
