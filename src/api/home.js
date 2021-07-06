import { get, post } from '@/util/axios'
// 查询banner
export const getBanners = (params) => {
  return get('/api/common/v1/base/banner/user', params)
}
// 搜索
export const homeSearch = (params) => {
  return get('/manage/v1/web/index/homeSearch', params)
}
// 前台查询制度列表接口
export const getRegulationList = (params) => {
  return post('/api/blade-margin/v1/regulation/front/list', params)
}
// pc-首页+讲师风采列表
export const queryTeacherMienList = (params) => {
  return post('/manage/v1/teacher/foreground/queryTeacherMienList', params)
}
// 讲师详情
export const queryTeacherMienDetail = (params) => {
  return post('/manage/v1/teacher/foreground/queryTeacherMienDetail', params)
}
// 讲师授课情况
export const queryTeachCourseInfo = (params) => {
  return post('/manage/v1/teacher/foreground/queryTeachCourseInfo', params)
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
/**
 * 首页制度清单列表
 * */
export const getHomeSystemList = (params) =>
  post('/api/blade-margin/v1/regulation/front/list', params)

/**
 * 首页制度积分排行
 * */
export const queryRanking = (params) => get('/api/manage/v1/personal/center/queryRanking', params)

/**
 * 首页制度积分排行
 * */
export const queryMyRanking = (params) =>
  get('/api/manage/v1/personal/center/queryMyRanking', params)
