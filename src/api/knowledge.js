/* eslint-disable no-unused-vars */
import { del, get, post, put } from '@/util/axios'
/**
 * 知识库列表
 * */
export const getKnowledgeList = (params) =>
  get('/manage/v1/web/knowledge/getForegroundKnowledgeList', params)
/**
 * 查询知识库目录
 * */
export const getKnowledgeCatalog = (params) =>
  get('/manage/v1/web/knowledge/getNextCatalogsById', params)
/**
 * 查询知识详情
 * */
export const getKnowledgeDetails = (params) => get('/manage/v1/knowledge/manage/details', params)
/**
 * 查询知识库评价
 * */
export const getEvaluateList = (params) => get('/manage/v1/web/knowledge/getScopeList', params)
/**
 * 增加查看人数
 * */
export const putWatchOperate = (params) => put('/manage/v1/web/knowledge/watchOperate', params)
/**
 * 增加下载人数
 * */
export const putDownloadOperate = (params) =>
  put('/manage/v1/web/knowledge/downloadOperate', params)
/**
 * 添加知识库评价
 * */
export const addCourseScope = (params) => post('/manage/v1/web/knowledge/addCourseScope', params)
