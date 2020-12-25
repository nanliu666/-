import { get, post } from '@/util/axios'
/**
 * 查询个人信息
 * */
export const getuserInfo = (params) => get('/manage/v1/personal/center/userInfo', params)
/**
 * 修改个人信息
 * */
export const setuserInfo = (params) => post('/manage/v1/personal/center/userInfo', params)
