/* eslint-disable no-unused-vars */
import { del, get, post, put } from '@/util/axios'
/**
 * 查询考试列表
 * */
export const getExamList = (params) => post('/manage/v1/exam/center/examList', params)
/**
 * 查询试卷详情（参加考试）
 * */
export const getTakeExam = (params) => get('/manage/v1/exam/center/takeExam', params)
/**
 * 提交试卷
 * */
export const postSubmitPaper = (params) => post('/manage/v1/exam/center/submitPaper', params)
/**
 * 查看答卷
 * */
export const getViewAnswer = (params) => get('/manage/v1/exam/center/viewAnswer', params)
/**
 * 考试详情服务
 * id=1379677543136813057 (batchId)
 * */
export const getViewExamInfo = (params) => get('/manage/v1/exam/center/viewExamInfo', params)
/**
 * 考试详情服务
 *   "examId": "1379677543015178241",
    "batchId": "1379677543136813057",
    "pageNo": "1",
  	"pageSize":"10"
 * */
export const examSessionList = (params) => post('/manage/v1/exam/center/examSessionList', params)
