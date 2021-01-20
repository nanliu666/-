/* eslint-disable no-unused-vars */
import { del, get, post, put } from '@/util/axios'
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
