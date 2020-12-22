import { get, post } from '@/util/axios'
/***
 * @author guanfenda
 * @desc 获取消息列表
 * @params params
 * */
export const getMsgNotify = (params) => get('/msg/v1/msg/notify', params)

/***
 * @author guanfenda
 * @desc 已读消息
 * @params params
 * */
export const postMsgNotify = (params) => post('/msg/v1/msg/notify', params)
/***
 * @author guanfenda
 * @desc  未读消息统计
 * @params params
 * */
export const postMsgNotifyCount = (params) => get('/msg/v1/msg/notify/count', params)
