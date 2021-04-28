/* eslint-disable no-unused-vars */
import { del, get, post, put } from '@/util/axios'

/***
 * @desc  创建或编辑资源下的分类列表
 * @params params.source  分类来源（live：直播；course：课程；train：培训；knowledge：知识库，classroom：教室,teacher讲师，questionnaire：问卷
 * */
export const queryCategoryOrgList = (params) =>
  post('/api/blade-manage/v1/classroom/queryCategoryOrgList', params)
