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
