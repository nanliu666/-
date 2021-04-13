import { get } from '@/util/axios'
// 查询banner
export const getBanners = (params) => {
  return get('/api/common/v1/base/banner/user', params)
}

/**
 * 首页我的培训
 * */
export const homeQueryTrainList = (params) => get('/manage/v1/web/index/queryTrainList', params)

/**
 * 首页新闻
 * */
export const homeNewsList = (params) => get('/manage/v1/web/index/newsList', params)
/**
 * 首页查询学分等个人信息
 * */
export const homePInfo = (params) => get('/manage/v1/web/index/queryCredit', params)
/**
 * 首页查询学习中的课程
 * */
export const homeLearningCourse = (params) =>
  get('/manage/v1/web/index/queryLearnedCourseList', params)

/**
 * 首页月度学分排行榜
 * */
export const homeMonthlyCredit = (params) => get('/manage/v1/web/index/queryMonthlyCredit', params)
/**
 * 首页月度学时排行榜
 * */
export const homeMonthlyPeriod = (params) => get('/manage/v1/web/index/queryMonthlyPeriod', params)

/**
 * 首页我的直播
 * */
export const homeMyLiveList = (params) => get('/manage/v1/web/index/queryLiveStreamingList', params)
