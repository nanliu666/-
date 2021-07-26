import { get, post, del } from '@/util/axios'

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
export const addComment = (params) => post('/manage/v1/web/course/addCourseScope', params)

/**
 * 查询学员学习课程记录
 * @param {Object} params
 * @param {Number} params.courseId 课程ID
 */
export const getLearnRecord = (params) => get('/manage/v1/web/course/getCourseRecord', params)

/**
 * 更新学员学习课程记录
 * @param {Object} params
 * @param {Number} params.contentRecords 已学章节ids,用逗号隔开。比如：xxx:50,XXX2:30,数字为每个章节的完成百分比。(除视频课件外，其他课件0:表示从没学习过，1表示学习过)
 * @param {Number} params.courseId 课程ID
 * @param {Number} params.period 学习时长，单位是分钟
 */
export const updateLearnRecord = (params) =>
  post('/manage/v1/web/course/saveCourseUserRecord', params)

/**
 * 新增学员浏览课程记录
 * @param {Object} params
 */
export const addViewLog = (params) => post('/manage/v1/study/plan/course/addLog', params)
/**
 * 热门课程
 */
export const queryCourseList = (params) => get('/manage/v1/web/index/queryCourseList', params)
/**
 * 前台课程中心讲师列表下拉框
 */
export const listForegroundTeacherComboBox = (params) =>
  get('/manage/v1/web/course/listForegroundTeacherComboBox', params)
/**
 * 查询课程作业
 * @param {String} params.courseId 课程ID
 * @param {String} params.userId 学员ID
 */
export const taskInfo = (params) => get('/manage/v1/web/coursecenter/coursework/info', params)

/**
 * 课程作业上传
 * @param {string}params.id              主键ID
 * @param {string}params.userId          学员id
 * @param {string}params.courseId        课程id
 * @param {string}params.jobId           作业id
 * @param {string}params.fileCategory    文件归类：用户提交的附件user、还是讲师评改的附件teacher
 * @param {string}params.fileSize        文件大小
 * @param {string}params.fileName         文件名称，包括扩展名
 * @param {string}params.filePath         文件所在路径
 * @param {string}params.creatorId        创建人id
 * @param {string}params.createTime       创建时间
 * @param {string}params.updateId         最后修改人
 * @param {string}params.updateTime       最后修改时间
 */
export const upSave = (params) => post('/manage/v1/web/coursecenter/coursework/save', params)
/**
 * 查询学员学习心得
 * @param {String} params.courseId 课程ID
 */
export const queryExperience = (params) =>
  get('/manage/v1/web/coursecenter/experience/query', params)
/**
 * 学习心得上传
 * @param {string} params.id  默认值    请输入描述
 * @param {string} params.userId  默认值    学员ID
 * @param {string} params.courseId  默认值    课程id
 * @param {string} params.fileSize  默认值    文件大小
 * @param {string} params.fileName  默认值    文件名称，包括扩展名
 * @param {string} params.filePath  默认值    文件所在路径
 * @param {string} params.creatorId  默认值    创建人id
 * @param {string} params.createTime  默认值    创建时间
 * @param {string} params.updateId  默认值    最后修改人
 * @param {string} params.updateTime  默认值    最后修改时间
 */
export const saveExperience = (params) =>
  post('/manage/v1/web/coursecenter/experience/save', params)
/**
 * 学习心得删除
 * @param {String} params.id 主键ID
 */
export const removeExperience = (params) =>
  del('/manage/v1/web/coursecenter/experience/remove', params)
/**
 * pc端查询课程笔记
 * @param {String} params.courseId 课程id
 * @param {Number} params.pageNo 页码
 * @param {Number} params.pageSize 页面数量
 */
export const getCourseNotesListPC = (params) =>
  get('/manage/v1/web/course/getCourseNotesListPC', params)
/**
 * PC端保存课程笔记
 * @param {String} params.courseId 课程id
 * @param {String} params.remark 笔记内容
 * @param {String} params.contentId 章节Id
 */
export const saveCourseNotePC = (params) => post('/manage/v1/web/course/saveCourseNotePC', params)
/**
 * 编辑课程笔记
 * @param {String} params.id
 * @param {String} params.remark 笔记内容
 */
export const editCourseNote = (params) => post('api/manage/v1/web/course/editCourseNote', params)
/**
 * 删除课程笔记
 * @param {String} params.id
 */
export const deleteCourseNote = (params) => get('api/manage/v1/web/course/deleteCourseNote', params)
/**
 * 增加学习次数
 * @param {String} params.courseId 课程id
 */
export const addStudyTimes = (params) => get('api/manage/v1/web/course/addStudyTimes', params)
/**
 * 收藏课程列表
 * 
 */
 export const getCollectionCourseList = (params) => get('api/manage/v1/user/collect/course/list', params)
 /**
 * 取消收藏课程
 * 
 */
  export const cancelCollectionCourse = (params) => del(`api/manage/v1/collection/cancel`, params)
  /**
 * 收藏课程
 * 
 */
 export const collectionCourse = (params) => post('api/manage/v1/collection/save', params)
 /**
 * 学习详情接口
 * 
 */
  export const getCourseStudyDetail = (params) => get('api/manage//v1/course/getCourseStudyDetail', params)