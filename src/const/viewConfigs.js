const TYPE_PATH_MAP = {
  LiveBroadcastBegin: '/live/list', // 直播开始通知
  LiveBroadcastPlanGust: '/live/list', // 直播计划安排通知: 讲师通知
  LiveBroadcastPlan: '/live/list', // 直播计划安排通知: 指定学员观看
  LiveBroadcastEveryOne: '/live/list', // 直播计划安排通知: 所有人或通过验证码观看
  LearnCompulsoryNotify: '/learn/list', // 学习必修安排通知
  LearnCompulsoryRemind: '/learn/list', // 学习必修安排提醒
  GrantCertificate: '/my/record', // 证书发放通知
  GetCreditCompleteCourse: '/my/record', // 学分获得通知: 完成课程获得学分
  GetCreditCompleteExam: '/my/record', // 学分获得通知: 完成考试获得学分
  GetCreditCompleteTrain: '/my/record', // 学分获得通知: 完成培训获得学分
  GetCreditEverydaySignIn: '/my/record', // 学分获得通知: 完成每日登录获得学分
  GetCreditOnlineLearning: '/my/record', // 学分获得通知: 在线学习时长超过15分钟获得学分
  GetCreditLearningArticles: '/my/record', // 学分获得通知: 知识库学习一篇文章/视频获得学分
  GetCreditResourceDownloaded: '/my/record', // 学分获得通知: 资源共享被下载十次获得学分
  PassApproval: '/approvalCenter/center', // 审批通过通知: 申请人审批通过
  ApprovalNotify: '/approvalCenter/center', // 审批通知: 有新的审批代办
  FlowWaitApprove: '/approvalCenter/center', // 审批通知: 有新的审批代办
  FlowPass: '/approvalCenter/center', // 审批通过通知: 申请人审批通过
  FlowReject: '/approvalCenter/center', // 审批通知
  ApprovalReturn: '/approvalCenter/center', // 审批退回通知: 申请人审批被退回
  ExamAchievement: '/approvalCenter/center', // 考试成绩通知: 发布考试成绩
  ExamNotify: '/exam/middle', // 考试通知: 考试发布
  ExamRemind: '/exam/middle', // 考试提醒: 开考前N分钟
  CourseLearning: '/myTask/myLearn', // 课程学习的通知: 发布课程安排
  CourseRemind: '/myTask/myLearn', // 课程学习提醒: 课程开始前N分钟
  TrainArrange: '/train/index', // 培训安排的通知: 发布培训安排
  QuestionnaireArrangement: '/myTask/myLearn?clickData=questionnaire' // 培训安排的通知: 发布培训安排
}
export default TYPE_PATH_MAP
