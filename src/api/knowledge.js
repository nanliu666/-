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

/**
 * 保存知识库学分
 * */
export const saveKnowledgeOperateCredit = (params) =>
  get('/manage/v1/knowledge/manage/saveKnowledgeOperateCredit', params)

/**
 *
 *一点分享
 */
export const addKnowledge = (params) => post('/api/blade-manage/v1/knowledge/front/add', params)

/**
 *  查询知识库分类
 */
export const getNextCatalogsById = (params) =>
  get('/api/manage/v1/knowledge/catalog/front/list', params)
// 获取知识详情
export const getDetailsById = (params) => get('/api/manage/v1/knowledge/manage/details', params)

export const updateKnowledge = (params) =>
  post('/api/blade-manage/v1/knowledge/front/update', params)
// 下载次数
export const loadNum = (params) => put('/api/manage/v1/web/knowledge/downloadOperate', params)

export const getKnowledgeCatalogList = (params) =>
  post('/api/blade-resource/v1/category/getKnowledgeCatalogList', params)

export const getTrainList = (params) => get('/v1/web/getTrainList', params)

export const collectOperate = (params) => get('/api/manage/v1/knowledge/manage/collectOperate',params)
//查询前台知识搜藏列表
export const getCollectionList = (params) => get('/api/manage/v1/user/collect/knowledge/list',params)
//查询前台知识搜藏列表(返回全部的数据)
export const getAllKnowledgeCatalogList = (params) => post('/api/blade-resource/v1/category/getAllKnowledgeCatalogList',params)

//取消收藏知识库
export const addCollection = (params) => get('/api/manage/v1/knowledge/manage/collectOperate',params)

