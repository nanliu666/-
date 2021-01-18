/* eslint-disable no-unused-vars */
import { del, get, post, put } from '@/util/axios'
/**
 * 讲师端-直播详情
 * */
export const getLiveDetail = (params) => get('/common/v1/live', params)
