/*
 * @Description: 前台社区模块接口
 * @Version: 3.30
 * @Autor: Xie Mingwei
 * @Date: 2021-06-16 09:27:16
 * @LastEditors: Xie Mingwei
 * @LastEditTime: 2021-07-07 17:12:44
 */

import request, { get, post } from '@/util/axios'
const baseUrl = '/blade-margin/v1/community/' // 公共地址

// 推荐页面
/**
 * @description: 查询关注的专区
 * @param {*} pageSize:每页条数,pageNo:页数
 * @return {*}
 */
export const queryFocus = (params) => get(`${baseUrl}area/queryFocus`, params)

/**
 * @description: 查询热门动态
 * @param {*} pageSize:每页条数,pageNo:页数
 * @return {*}
 */
export const queryHotTopics = (params) => get(`${baseUrl}area/queryHotTopics`, params)

/**
 * @description: 收藏帖子
 * @param {*} topicId
 * @return {*}
 */
export const topicCollect = (topicId) => {
    return request({
        url: `${baseUrl}topic/topicCollect?topicId=` + topicId,
        method: 'post'
    })
}

/**
 * @description: 取消收藏帖子
 * @param {*} topicId
 * @return {*}
 */
export const cancelTopicCollect = (topicId) => {
    return request({
        url: `${baseUrl}topic/cancelTopicCollect?topicId=` + topicId,
        method: 'post'
    })
}

/**
 * @description: 点赞帖子
 * @param {*} topicId
 * @return {*}
 */
export const topicHit = (topicId) => {
    return request({
        url: `${baseUrl}topic/topicHit?topicId=` + topicId,
        method: 'post'
    })
}

/**
 * @description: 取消点赞帖子
 * @param {*} topicId
 * @return {*}
 */
export const cancelTopicHit = (topicId) => {
    return request({
        url: `${baseUrl}topic/cancelTopicHit?topicId=` + topicId,
        method: 'post'
    })
}

/**
 * @description: 查询全部专区
 * @param {*} pageSize:每页条数,pageNo:页数
 * @return {*}
 */
export const queryAllAreas = (params) => get(`${baseUrl}area/queryAllAreas`, params)

/**
 * @description: 关注专区
 * @param {*} areaId
 * @return {*}
 */
export const areaFollow = (areaId) => {
    return request({
        url: `${baseUrl}area/areaFollow?areaId=` + areaId,
        method: 'post'
    })
}

/**
 * @description: 取消关注专区
 * @param {*} areaId
 * @return {*}
 */
export const cancelAreaFollow = (areaId) => {
    return request({
        url: `${baseUrl}area/cancelAreaFollow?areaId=` + areaId,
        method: 'post'
    })
}

/**
 * @description: 回复帖子
 * @param {*} topicId:帖子的ID,content:回复的内容,imgUrl:图片地址，多个以逗号分隔,parentId:如果是对帖子回复为0，如果是对回复的回复，为上一级回复记录的ID,userToId:
如果是对帖子回复为0，对回复的回复时，@了谁，就为谁的用户ID
 * @return {*}
 */
export const replyTopic = (params) => post(`${baseUrl}topic/replyTopic`, params)

/**
 * @description: 查询用户管理的专区
 * @param {*} pageSize,pageNo
 * @return {*}
 */
export const queryManageAreas = (params) => get(`${baseUrl}area/queryManageAreas`, params)

/**
 * @description: 删除帖子
 * @param {*} topicId
 * @return {*}
 */
export const deleteTopic = (topicId) => {
    return request({
        url: `${baseUrl}topic/deleteTopic?topicId=` + topicId,
        method: 'post'
    })
}

/**
 * @description: 专区详情
 * @param {*} areaId
 * @return {*}
 */
export const queryAreaDetail = (params) => get(`${baseUrl}topic/areaDetail`, params)

/**
 * @description: 查询帖子列表
 * @param {*} pageSize,pageNo,startDate,endDate,userId,content,isExpert,isFine,isCollect
 * @return {*}
 */
export const queryTopics = (params) => get(`${baseUrl}topic/queryTopics`, params)

/**
 * @description: 发布帖子
 * @param {*} title,content,areaId,imgUrl,expertHelp
 * @return {*}
 */
export const addTopic = (params) => post(`${baseUrl}topic/addTopic`, params)

/**
 * @description: 查询待审核帖子列表
 * @param {*} pageSize,pageNo,startDate,endDate,areaId
 * @return {*}
 */
export const queryUnauditedTopicList = (params) =>
    get(`${baseUrl}area/queryUnauditedTopicList`, params)

/**
 * @description: 审批通过帖子
 * @param {*} topicIds
 * @return {*}
 */
export const approvedTopic = (topicIds) => {
    return request({
        url: `${baseUrl}topic/approved?topicIds=` + topicIds,
        method: 'post'
    })
}

/**
 * @description: 审批拒绝帖子
 * @param {*} topicIds
 * @return {*}
 */
export const rejectedTopic = (topicIds) => {
    return request({
        url: `${baseUrl}topic/rejected?topicIds=` + topicIds,
        method: 'post'
    })
}

/**
 * @description: 查询用户管理列表
 * @param {*} pageSize,pageNo,name,areaId
 * @return {*}
 */
export const queryAreaUserList = (params) => get(`${baseUrl}area/queryAreaUserList`, params)

/**
 * @description: 禁言
 * @param {*} areaId,userId,hours
 * @return {*}
 */
export const forbidPost = (params) => post(`${baseUrl}area/forbidPost`, params)

/**
 * @description: 解除禁言
 * @param {*} areaId,userId
 * @return {*}
 */
export const removeForbidPost = (params) => post(`${baseUrl}area/removeForbidPost`, params)

/**
 * @description: 查询发帖用户信息
 * @param {*} userId
 * @return {*}
 */
export const postUserInfo = (params) => get(`${baseUrl}topic/userInfo`, params)

/**
 * @description: 查询专家答复列表
 * @param {*} pageSize,pageNo,startDate,endDate,content,areaId
 * @return {*}
 */
export const expertsAnswer = (params) => get(`${baseUrl}topic/expertsAnswer`, params)

/**
 * @description: 查询通知信息列表
 * @param {*} pageSize,pageNo
 * @return {*}
 */
export const getNotificationList = (params) => get(`${baseUrl}aite/query`, params)

/**
 * @description: 查询帖子详情
 * @param {*} pageSize,pageNo,topicId
 * @return {*}
 */
export const getPostDetails = (params) => get(`${baseUrl}topic/detail`, params)

/**
 * @description: 帖子取消置顶
 * @param {*} topicId
 * @return {*}
 */
export const cancelTop = (topicId) => {
    return request({
        url: `${baseUrl}topic/cancelTop?topicId=` + topicId,
        method: 'post'
    })
}

/**
 * @description: 帖子置顶
 * @param {*} topicId
 * @return {*}
 */
export const placedTop = (topicId) => {
    return request({
        url: `${baseUrl}topic/top?topicId=` + topicId,
        method: 'post'
    })
}

/**
 * @description: 取消帖子加精
 * @param {*} topicId
 * @return {*}
 */
export const cancelFine = (topicId) => {
    return request({
        url: `${baseUrl}topic/cancelFine?topicId=` + topicId,
        method: 'post'
    })
}

/**
 * @description: 帖子加精
 * @param {*} topicId
 * @return {*}
 */
export const highQualityFine = (topicId) => {
    return request({
        url: `${baseUrl}topic/fine?topicId=` + topicId,
        method: 'post'
    })
}

/**
 * @description: 查询单个帖子内容
 * @param {*} topicId
 * @return {*}
 */
export const queryTopicById = (params) => get(`${baseUrl}topic/queryTopicById`, params)

/**
 * @description: 查询回复信息
 * @param {*} topicId,pageSize,pageNo
 * @return {*}
 */
export const queryTopicReply = (params) => get(`${baseUrl}topic/queryReply`, params)

/**
 * @description: 查询回复的回复列表
 * @param {*} topicId,parentId,pageSize,pageNo
 * @return {*}
 */
export const querySubReply = (params) => get(`${baseUrl}topic/querySubReply`, params)

/**
 * @description: 查询专家回复
 * @param {*} topicId,pageSize,pageNo
 * @return {*}
 */
export const queryExpertReply = (params) => get(`${baseUrl}topic/queryExpertReply`, params)

/**
 * @description: 查询发贴人回复
 * @param {*} topicId,pageSize,pageNo
 * @return {*}
 */
export const queryPostReply = (params) => get(`${baseUrl}topic/queryPostReply`, params)

/**
 * @description: 查询未读通知数量
 * @param {*}
 * @return {*}
 */
export const queryUnreadCount = (params) => get(`${baseUrl}aite/queryUnreadCount`, params)

/**
 * @description: 更新通知已读
 * @param {*} ids
 * @return {*}
 */
export const updateBeenRead = (params) => post(`${baseUrl}aite/read`, params)

/**
 * @description: 删除帖子的回复
 * @param {*} replyId
 * @return {*}
 */
export const deleteReply = (replyId) => {
    return request({
        url: `${baseUrl}topic/deleteReply?replyId=` + replyId,
        method: 'post'
    })
}

/**
 * @description: 查询登陆用户信息
 * @param {*}
 * @return {*}
 */
export const loginUserInfo = (params) => get(`${baseUrl}topic/loginUserInfo`, params)

/**
 * @description: 检查禁言
 * @param {*}
 * @return {*}
 */
export const checkForbidPost = (params) => get(`${baseUrl}area/checkForbidPost`, params)
