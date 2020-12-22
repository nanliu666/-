import { get } from '@/util/axios'

/**
 * 新闻列表
 * @param {Object} params
 */
export const newsList = (params) => get('/manage/v1/web/newsList', params)
/**
 * 新闻详情
 * @param {Object} params
 */
export const newsInfo = (params) => get('/manage/v1/web/newsInfo', params)
