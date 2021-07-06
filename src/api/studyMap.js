/*
 * @Description:
 * @Version: 3.30
 * @Autor: Xie Mingwei
 * @Date: 2021-05-15 15:33:47
 * @LastEditors: Xie Mingwei
 * @LastEditTime: 2021-06-18 16:46:15
 */
import { get, post, del } from '@/util/axios'
const baseUrl = '/api/margin/v1/position/route/user/my/'

/**
 * @description: 晋升路线
 * @param {*} No params
 * @return {*}
 */
export const getPromotionRoute = (params) => get(`${baseUrl}route`, params)

/**
 * @description: 岗位胜任情况
 * @param {*} positionId:岗位id
 * @return {*}
 */
export const getCompetentSituation = (params) => get(`${baseUrl}situation`, params)

/**
 * @description: 能力图谱
 * @param {*} positionId:岗位id
 * @return {*}
 */
export const getAbilityMap = (params) => get(`${baseUrl}way`, params)

/**
 * @description: 切换晋升路线
 * @param {*} userRoteId:路线id
 * @return {*}
 */
export const switchRoutes = (params) => post(`${baseUrl}way/choose`, params)

/**
 * @description: 查询课程简况
 * @param {*} courseId:课程ID
 * @return {*}
 */
export const getSimpleCourse = (params) =>
    get('/api/manage/v1/web/coursecenter/getSimpleCourse', params)

/**
 * @description: 查询考试简况
 * @param {*} id
 * @return {*}
 */
export const getExamById = (params) => get('/api/manage/v1/exam/center/examById', params)

/**
 * @description: 查询培训简况
 * @param {*} trainId
 * @return {*}
 */
export const getTrainDetail = (params) => get('api/manage/v1/train/getTrainDetail', params)

/**
 * @description: 查询直播简况
 * @param {*} liveId
 * @return {*}
 */
export const getLiveDetail = (params) => get('/api/common/v1/simple/live', params)

/**
 * @description: 查看材料
 * @param {*} ablrIds
 * @return {*}
 */
export const getMaterialReport = (params) =>
    get('/api/margin/v1/position/route/user/ability/file/my', params)

/**
 * @description: 上报材料
 * @param {*} bizId,fileName,fileUrl,fileSize
 * @return {*}
 */
export const uploadMaterialReport = (params) =>
    post('/api/margin/v1/position/route/user/ability/file/add', params)

/**
 * @description: 上报材料
 * @param {*} ablrId
 * @return {*}
 */
export const deleteMaterialReport = (params) =>
    del('/api/margin/v1/position/route/user/ability/file/delete', params)

/**
* @description: 根据考试查询批次列表
* @param {*} examId
* @return {*}
*/
export const getTestBatch = (params) =>
    get('/api/manage/v1/exam/batch/list', params)
