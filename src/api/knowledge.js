/* eslint-disable no-unused-vars */
import { del, get, post, put } from '@/util/axios'
/**
 * 分类查询接口
 * */
export const getKnowledgeList = (params) =>
  get('/manage/v1/web/knowledge/getForegroundKnowledgeList', params)
