/* eslint-disable no-unused-vars */
import { del, get, post, put } from '@/util/axios'

// 分类查询接口
export const getcategoryTree = (params) => get('/api/common/v1/category/getCategoryTree', params)

// 分类查询接口
export const getLiveList = (params) => get('/api/common/v1/live/list', params)

/**
 * 讲师端-直播详情
 * */
export const getLiveDetail = (params) => get('/common/v1/live', params)
/**
 * 学员报名直播
 * */
export const userLiveApplyJoin = (params) => post('/common/v1/live/userLiveApplyJoin', params)

/**
 * 查询评论列表
 * */
export const getCommentList = (params) => get('/common/v1/live/comment/commentList', params)
/**
 * 保存评论
 * */
export const postComment = (params) => post('/common/v1/live/comment/comment', params)
/**
 * 讲师直播详情-学员列表
 * liveId 直播id
 * pageNo 请求页码
 * pageSize 每页条数
 */
export const getStudentList = (params) => get('/common/v1/live/student', params)
/**
 * 用户角色判定
 * liveId 直播id
 */
export const getUserRole = (params) => get('/common/v1/live/user/role', params)

export const getSummary = (params) => get('/common/v1/live/data/summary', params)

export const getAudience = (params) => get('/common/v1/live/data/audience', params)

// 查看单个直播回放列表
export const liveReplayList = (params) => get('/api/common/v1/live/replay/videoList', params)

// 查看单个直播回放列表
export const setReplayStatus = (params) => get('/api/common/v1/live/replay/status', params)


// 获取子频道单点登陆token-D
export const getSonChannelToken = (params) => get('/api/common/v1/live/plan/getSonChannelToken', params)
// 获取频道单点登陆token-D
export const getChannelToken = (params) => get('/api/common/v1/live/plan/getChannelToken', params)


// 成功设置token接口后，调用单点登录后台接口进行授权登录操作。
export const authLogin = (params) => get('https://live.polyv.net/teacher/auth-login', params)

// 查看直播收藏列表
export const getCollectionLiveList = (params) => get('/api/manage/v1/user/collect/live/list', params)
// 收藏直播
export const saveCollect = (params) => post('/api/blade-resource/v1/live/saveCollect', params)
//取消收藏直播
export const cancelCollect = (params) => post('/api/blade-resource/v1/live/cancelCollect', params)
//查询当前用户直播是否收藏
export const getIsCollectLive = (params) => get('/api/blade-resource/v1/live/getIsCollectLive', params)

