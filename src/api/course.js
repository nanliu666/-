import { get, post } from '@/util/axios'

/**
 * 根据课程分类查询下一级分类
 * @param {Object} params
 * @param {String} params.id 分类ID
 */
export const getCategories = (params) => get('/manage/v1/web/course/getNextCatalogsById', params)

/**
 * 查询课程列表
 * @param {Object} params
 * @param {String} params.teacherId 讲师ID
 * @param {String} params.catalogId 分类ID
 * @param {String} params.type 类型
 * @param {String} params.choice 分类ID
 * @param {String} params.pageNo 页码
 * @param {String} params.size 每页条数
 */
export const getCourseList = (params) =>
  get('/manage/v1/web/course/getForegroundCourseList', params)

/**
 *
 * @param {Object} params
 * @param {Number} params.currentPage 页码
 * @param {Number} params.size 每页条数
 * @param {Number} params.categoryId 分类ID
 * @param {Number} params.likeQuery 模糊查询
 */
export const getTeacherList = (params) => post('/manage/v1/teacher/listTeacher', params)

/**
 * 查询课程详情
 * @param {Object} params
 * @param {String} params.courseId 课程ID
 */
export const getCourseDetail = (params) => get('/manage/v1/course/getCourse', params)

/**
 * 查询课程笔记
 * @param {Object} params
 * @param {Number} params.courseId 课程ID
 */
export const getNotesList = (params) => get('/manage/v1/web/course/getCourseNotesList', params)

/**
 * 添加课程笔记
 * @param {Object} params
 * @param {String} params.courseId 课程ID
 * @param {Number} params.content 内容
 */
export const addNote = (params) => post('/manage/v1/web/course/saveCourseNote', params)

/**
 * 查询课程评价
 * @param {Object} params
 * @param {Number} params.pageNo 页码
 * @param {Number} params.size 每页条数
 * @param {Number} params.courseId 课程ID
 */
export const getCommentList = (params) => get('/manage/v1/web/course/getCourseScopeList', params)

/**
 * 添加课程评价
 * @param {Object} params
 * @param {Number} params.content  内容
 */
export const addComment = (params) => get('/manage/v1/web/course/addCourseScope', params)

/**
 * 查询学员学习课程记录
 * @param {Object} params
 * @param {Number} params.courseId 课程ID
 */
export const getLearnRecord = (params) => get('/manage/v1/web/course/getCourseRecord', params)
