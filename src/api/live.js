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
 * 查询评论列表
 * */
export const getCommentList = (params) => get('/common/v1/live/comment/commentList', params)
/**
 * 保存评论
 * */
export const postComment = (params) => post('/common/v1/live/comment/comment', params)
/**
 * 讲师直播详情-学员列表
 * channelId 直播频道id
 * pageNo 请求页码
 * pageSize 每页条数
 */
export const getStudentList = (params) => get('/common/v1/live/student', params)

export const getSummary = (params) => get('/common/v1/live/data/summary', params)

export const getAudience = (params) => get('/common/v1/live/data/audience', params)

// 查看单个直播回放列表
export const liveReplayList = (params) => get('/api/common/v1/live/replay/videoList', params)

// 查看单个直播回放列表
export const setReplayStatus = (params) => get('/api/common/v1/live/replay/status', params)

