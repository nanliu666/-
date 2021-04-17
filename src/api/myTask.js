import { get, post } from '@/util/axios'

/**
 * 查询学习待办条数
 */
export const studyTodoNum = (params) => get('/manage/v1/study/studyTodoNum', params)
/**
 * 查询考试待办条数
 */
export const examTodoNum = (params) => get('/manage/v1/study/examTodoNum', params)
/**
 * 查询我的课程目录
 * @param {Object} params
 * @param {string} params.studyType  0：必修课；1：选修课
 */
export const myCourseCatalog = (params) => get('/manage/v1/study/myCourseCatalog', params)
/**
 * 学员端我的直播列表
 * @param {number} params.pageSize 页面数量
 * @param {number} params.pageNo  页码
 */
export const liveStudentList = (params) => get('api/common/v1/live/liveStudentList', params)
/**
 * 我的任务-选修课接口
 * @param {number} params.pageSize 页面数量
 * @param {number} params.pageNo  页码
 */
export const myElectiveCourse = (params) => post('/manage/v1/study/myElectiveCourse', params)
/**
 * 查询我的必修详情课程
 * */
export const getRequireCourse = (params) => post('/manage/v1/study/myRequireCourse', params)
/**
 * 查询作业待办数量
 */
export const homeWorkNum = (params) => get('/manage/v1/study/courseworkTodoNum', params)
/**
 * 作业-必修课信息列表查询
 */
export const requiredWorkList = (params) =>
  post('/manage/v1/study/coursework/requiredWorkList', params)
/**
 * 作业-培训信息列表查询
 */
export const trainWorkList = (params) => post('/manage/v1/study/coursework/trainWorkList', params)
/**
 * 作业-选修课信息列表查询
 */
export const electiveWorkList = (params) =>
  post('/manage/v1/study/coursework/electiveWorkList', params)
/**
 * 作业-必修课详情
 */
export const studyWorkDetail = (params) =>
  get('/manage/v1/study/coursework/studyWorkDetail', params)
/**
 * 作业-培训详情
 */
export const trainWorkDetail = (params) =>
  get('/manage/v1/study/coursework/trainWorkDetail', params)
/**
 * 作业-选修课详情
 */
export const electiveWorkDetail = (params) =>
  get('/manage/v1/study/coursework/electiveWorkDetail', params)
/**
 * 作业-选修课详情，课程列表
 */
export const listCourseJob = (params) => get('/api/manage/v1/course/listCourseJob', params)
/**
 * 作业-培训详情，课程列表
 */
export const queryCourseWork = (params) => get('/api/manage/v1/train/course/work', params)
/**
 * 作业-培训详情，线上课程
 */
export const getOnlineCourse = (params) => get('/api/manage/v1/train/getOnlineCourse', params)
/**
 * 作业-必修课详情，课程列表
 */
export const queryStudyPlanWork = (params) =>
  get('/api/blade-manage/v1/study/plan/course/work', params)
/**
 * 作业-必修课详情，线上课程
 */
export const queryStudyAllCorseList = (params) =>
  get('/api/blade-manage/v1/study/plan/queryStudyAllCorseList', params)
/**
 *  学员提交作业或讲师提交评改
 * @param {Object} params.courseId        课程id
 * @param {Object} params.fileCategory    文件归类：用户提交的附件user、还是讲师评改的附件teacher
 * @param {Object} params.fileName        文件名称，包括扩展名
 * @param {Object} params.filePath        文件所在路径
 * @param {Object} params.fileSize        文件大小
 * @param {Object} params.id              对应FileInfoList里的Id，有则回传，没有则传空
 * @param {Object} params.jobId           对应课程作业Id
 * @param {Object} params.userId          学员id
 **/
export const saveCourseLinkedStudentOrTeacher = (params) =>
  post('api/manage/v1/web/coursecenter/coursework/saveCourseLinkedStudentOrTeacher', params)
/**
 *  批量压缩成zip下载
 * @param {Object} params.filePath        多个文件路径url的数组
 * @param {Object} params.fileName        每个文件对应的名称数组
 * @param {Object} params.zipComment      zip包名称
 **/
export const zip = (params) => get('/api/common/oss/download/zip', params)
/**
 * 查询问卷待办条数
 */
export const questionTodoNum = (params) => get('/margin/v1/asq/todo/user', params)
/**
 * 查询问卷列表
 */
export const questionnaireList = (params) => get('/margin/v1/asq/plan/user', params)
