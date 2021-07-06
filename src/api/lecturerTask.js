/* eslint-disable no-unused-vars */
import {
  del,
  get,
  post,
  put
} from '@/util/axios'

// 必须课

/***
 * @desc  考试详情
 * @params params
 * */
export const getExamDetail = (params) => get('/api/manage/v1/web/teacher/getExamDetail', params)

/***
 * @desc  创建或编辑资源下的分类列表
 * @params params.source  分类来源（live：直播；course：课程；train：培训；knowledge：知识库，classroom：教室,teacher讲师，questionnaire：问卷
 * */
export const queryCategoryOrgList = (params) =>
  post('/api/blade-manage/v1/classroom/queryCategoryOrgList', params)

/***
 * @desc  必修课列表
 * @params params.pageNo  当前页
 * @params params.pageSize  每页显示条数
 * */
export const getRequiredList = (params) => get('/api/manage/v1/web/teacher/getRequiredList', params)

/***
 * @desc  必修课详情
 * @params params.id
 * */
export const getRequiredDetail = (params) =>
  get('/api/manage/v1/web/teacher/getRequiredDetail', params)

/***
 * @desc  学习情况
 * @params params.id
 * */
export const queryStudyList = (params) => get('/api/manage/v1/study/plan/queryStudyList', params)

/***
 * @desc  学习课程
 * @params params.pageSize
 * @params params.pageNo
 * @params params.id       必修课id
 * */
export const getLearningCourseList = (params) =>
  get('/api/manage/v1/web/teacher/getLearningCourseList', params)

/***
 * @desc  考试情况
 * @params params.pageSize
 * @params params.pageNo
 * @params params.id       必修课id
 * */
export const getExamSituationList = (params) =>
  get('/api/manage/v1/web/teacher/getExamSituationList', params)

/***
 * @desc  考生列表
 * @params params.pageSize
 * @params params.pageNo
 * @params params.examId   考试id
 * */
export const getExamineeList = (params) => get('/api/manage/v1/web/teacher/getExamineeList', params)

/***
 * @desc  学员提交作业或讲师提交评改
    @params  params.courseId         课程id
    @params  params.fileCategory     文件归类：用户提交的附件user、还是讲师评改的附件teacher
    @params  params.fileName         文件名称，包括扩展名
    @params  params.filePath         文件所在路径
    @params  params.fileSize         文件大小
    @params  params.id               对应FileInfoList里的Id，有则回传，没有则传空
    @params  params.jobId            对应课程作业Id
    @params  params.userId           学员id
 * */
export const saveCourseLinkedStudentOrTeacher = (params) =>
  post('/api/manage/v1/web/coursecenter/coursework/saveCourseLinkedStudentOrTeacher', params)

/***
 * @desc  查询课程作业列表
 * @params params.courseId  课程id
 * @params params.stuId  学员Id
 * */
export const listCourseJob = (params) => get('/api/manage/v1/course/listCourseJob', params)

/***
 * @desc  查询上报材料学员学习心得
 * @params params.courseId  课程id
 * @params params.stuId  学员Id
 * */
export const experience = (params) =>
  get('/api/blade-manage/v1/study/plan/learning/experience', params)

//培训

/***
 * @desc  查询讲师培训列表
 * @params params.pageNo  请求页码
 * @params params.pageSize  每页条数
 * */
export const queryTrainList = (params) => get('/api/manage/v1/web/teacher/queryTrainList', params)

//培训-内训

/***
 * @desc  查询讲师培训列表
 * @params params.trainId  培训id
 * */
export const getTrainDetail = (params) => get('/api/manage/v1/web/teacher/getTrainDetail', params)

/***
 * @desc  学员培训列表
 * @params  params.trainId         培训id
 * @params  params.stuName         学员姓名
 * @params  params.deptCode        所属部门code
 * @params  params.onlineProgress  在线学习进度（1：已完成；2：未完成；不传参数则表示全部）
 * @params  params.examStatus      考试情况（1：已通过；2：未通过；3：未开始；不传参数则表示全部）
 * @params  params.evaluate        评估情况（1：已评估；2：未评估；不传参数则表示全部）
 * @params  params.certificate     证书状态（1：已获得；2：未获得；3：未开始；不传参数则表示全部）
 * */
export const studentList = (params) => get('/api/manage/v1/train/studentList', params)

/***
 * @desc  发放学员证书
 * @params params.stuIds  学员id列表
 * @params params.trainId  培训id
 * */
export const grantCertificate = (params) =>
  post('/api/manage/v1/web/teacher/grantCertificate', params)

/***
 * @desc  撤回学员证书
 * @params params.stuIds  学员id列表
 * @params params.trainId  培训id
 * */
export const revokeCertificate = (params) =>
  post('/api/manage/v1/web/teacher/revokeCertificate', params)

/***
 * @desc  培训内训报名情况
 * @params params.trainId  培训id
 * @params params.pageNo   页码
 * @params params.pageSize  每页大小
 * */
export const queryTrainApplyJoinList = (params) =>
  get('/api/manage/v1/web/teacher/queryTrainApplyJoinList', params)

/***
 * @desc  报名情况人数统计
 * @params params.trainId  培训id
 * */
export const statistics = (params) => get('/api/manage/v1/train/people/statistics', params)

/***
 * @desc  培训签到情况列表
 * @params params.trainId  培训id
 * @params params.name  姓名- 搜索的值
 * @params params.pageNo  页码
 * @params params.pageSize  页大小
 * */
export const trainSignList = (params) => get('/api/manage/v1/web/teacher/trainSignList', params)

/***
 * @desc  培训线下日程二维码信息获取接口
 * @params params.trainId  培训id
 * */
export const getQrcode = (params) => get('/api/manage/v1/web/teacher/trainOfflineQrcode', params)

/***
 * @desc  查询培训线下日程
 * @params params.trainId  培训id
 * */
export const queryTrainOfflineTodoList = (params) =>
  get('/api/manage/v1/web/teacher/queryTrainOfflineTodoList', params)

/***
 * @desc  查询培训线上课
 * @params params.trainId  培训id
 * */
export const queryTrainOnlineCourseList = (params) =>
  get('/api/manage/v1/web/teacher/queryTrainOnlineCourseList', params)

/***
 * @desc  查询培训考试安排列表
 * @params params.trainId  培训id
 * */
export const queryExamList = (params) => get('/api/manage/v1/web/teacher/queryExamList', params)

/***
 * @desc  查询培训考试安排列表
 * @params params.trainId  培训id
 * @params params.userType  0:学员,1:讲师
 * */
export const getTrainEvaluate = (params) => get('/api/manage/v1/train/queryEvaluate', params)

// 选修课
/***
 * @desc  查询讲师选修课程
 * @params params.pageNo  页码
 * @params params.pageSize  页大小
 * */
export const queryElectiveCourseList = (params) =>
  get('/api/manage/v1/web/teacher/queryElectiveCourseList', params)

/***
 * @desc  学习人员列表
 * @params  params.courseId        课程Id
 * @params  params.jobSubmitRate    作业提交率（0或100，0：未完成；100：已完成）
 * @params  params.orgId            组织Id
 * @params  params.pageNo           请求页码
 * @params  params.pageSize         每页条数
 * @params  params.progress         学习进度（0或100，0：未完成；100：已完成）
 * @params  params.name             用户姓名
 * */
export const getStudyList = (params) => get('/api/manage/v1/course/getStudyList', params)

// 直播

/***
 * @desc  讲师端查询我的任务
 * @params params.pageNo  页码
 * @params params.pageSize  页大小
 * */
export const lectureLiveTaskList = (params) =>
  get('/api/common/v1/live/lectureLiveTaskList', params)

/***
 * @desc  组织机构查询
 * @params params.pageNo  页码
 * @params params.pageSize  页大小
 * */
export const getOrgTreeSimple = (params) => get('/api/org/v1/organization/tree', params)

/***
 * @desc  查询学习计划下的所有课程
 * @params params.pageNo  页码
 * @params params.pageSize  页大小
 * */
export const queryStudyAllCorseList = (params) =>
  get('/api/blade-manage/v1/study/plan/queryStudyAllCorseList', params)

/***
 * @desc  查询上报材料学员课程作业
 * @params params.studyPlanId  学习计划id
 * @params params.courseId     课程id
 * @params params.userId       用户id
 * */
export const work = (params) => get('/api/blade-manage/v1/study/plan/course/work', params)

/***
 * @desc  上报材料详情
 * @params params.studyPlanId  学习计划id
 * @params params.stuId         学员id
 * */
export const getMaterialsDetail = (params) =>
  get('/api/manage/v1/web/teacher/getMaterialsDetail', params)

/***
 * @desc  培训内训报名审批
 * @params params.signUpId  报名情况id
 * @params params.trainId         培训id
 * @params params.type         申请类型 reject-拒绝  agree-同意
 * @params params.rejectDesc         拒绝原因
 * */
export const approvalTrainApplyJoin = (params) =>
  put('/api/manage/v1/web/teacher/approvalTrainApplyJoin', params)

/***
 * @desc  查询上报材料学员课程作业
 * @params params.studyPlanId  学习计划id
 * @params params.courseId     课程id
 * @params params.userId       用户id
 * */
export const workTeacher = (params) => get('/api/manage/v1/study/plan/course/workTeacher', params)

/***
 * @desc  报名情况（外训）
 * @params params.trainId  外训ID
 * @params params.pageNo     页数
 * @params params.pageSize       条数
 * */
export const signUp = (params) =>
  get('/api/manage/v1/web/teacher/train/outer/analysis/signUp', params)

/***
 * @desc  参加学员（外训）
 * @params params.trainId  外训ID
 * @params params.pageNo     页数
 * @params params.pageSize       条数
 * */
export const students = (params) =>
  get('/api/manage/v1/web/teacher/train/outer/analysis/students', params)

/***
 * @desc 讲师/学员角色切换
 *  返回参数 identity number 0 学员 1 讲师
 * */
export const judgeTeacherStudent = () => get('/api/manage/v1/judgeTeacherStudent')

/***
 * */
export const queryCourseWork = (params) => get('/api/manage/v1/train/course/workFront', params)

/***
 * */
export const materials = (params) => get('/api/manage/v1/train/report/materials', params)

/***
 * */
export const queryStudyPlanWork = (params) =>
  get('/api/blade-manage/v1/study/plan/course/workFront', params)

/***
 * */
export const queryStudyPlanExperience = (params) =>
  get('/api/blade-manage/v1/study/plan/learning/experience', params)

/**
 * 查询培训线上课程
 * @param {Object} courseId - 参数
 * */
export const getOnlineCourse = (params) => get('/api/manage/v1/train/getOnlineCourse', params)

/**
 * PC-查询培训协议详情
 * @param params.pageSize          10
 * @param params.pageNo            1
 * @param params.id                trainID，培训ID
 * @param params.name              学员姓名
 * @param params.position          岗位
 * @param params.orgName           组织名称
 * @param params.status            状态
 * */
export const getTrainAgreementDetail = (params) =>
  get('/api/blade-margin/v1/trainAgreement/getTrainAgreementDetail', params)

/***
 **岗位管理新建岗位
 * */
export const queryStation = (params) => get('/api/manage/v1/source/base/position/info', params)

/**
 *  查询用户心得体会列表
 * @param {Object} params - 参数
 * */
export const courseFeelListByUserId = (params) =>
  get('api/manage/v1/course/courseFeelListByUserId', params)

/**
 *  签订培训协议
 * @param {Object} params.ids - 培训协议用户关联ID
 * @param {Object} params.signTime - 时间，
 * */
export const trainAgreementSign = (params) =>
  post('api/blade-margin/v1/trainAgreement/trainAgreementSign', params)

/**
 *  违约培训协议
 * @param {Object} params.ids - 培训协议用户关联ID
 * @param {Object} params.signTime - 时间，
 * @param {Object} params.breakAmount -
 * */
export const trainAgreementBreak = (params) =>
  post('api/blade-margin/v1/trainAgreement/trainAgreementBreak', params)

/**
 *  报名概况
 * @param {Object} params.trainId 外训ID
 * */
export const count = (params) =>
  get('api/manage/v1/web/teacher/train/outer/analysis/count', params)

/**
 *  直播-考试情况
 * @param {Object} params.bizId 业务ID，直播ID
 * @param params.pageSize          10
 * @param params.pageNo            1
 * */
export const liveExamInfo = (params) =>
  get('api/manage/v1/web/teacher/liveExamInfo', params)

/**
 *  直播报名情况
 * @param params.livePlanId          直播id
 * @param params.pageNo            1
 * @param params.pageSize            10
 * */
export const liveApplyJoin = (params) =>
  get('api/manage/v1/web/teacher/liveApplyJoin', params)

  /**
 *  报名审批操作
 * @param params.signUpId         报名情况id数组
 * @param params.type             申请类型 2-拒绝  1-同意
 * @param params.liveId           直播安排id
 * @param params.approvalDesc     审批描述
 * */
export const approvalLiveApplyJoin = (params) =>
post('api/common/v1/live/approvalLiveApplyJoin', params)
