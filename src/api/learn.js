/* eslint-disable no-unused-vars */
import { del, get, post, put } from '@/util/axios'
/**
 * 查询我的必修课程
 * */
export const getRequireCourse = (params) => post('/manage/v1/study/myRequireCourse', params)
/**
 * 查询我的选修课程
 * */
export const getElectiveCourseList = (params) => post('/manage/v1/study/myElectiveCourse', params)
/**
 * 查询学习中心课程菜单
 * */
export const getStudyCenterMenu = (params) => get('/manage/v1/study/myCourseCatalog', params)
