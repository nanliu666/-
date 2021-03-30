import moment from 'moment'
class ExamUtils {
  constructor() {}
  JoinDisabled(row) {
    // 参加考试置灰条件：
    // 未开考(status1)、缺考(status4)、已考试且考试成绩为未发布(isPass2)、已考试(status3)考试次数到达其上限(joinNum&&joinNumValue>=examTimes),考试结束时间在今天之前
    const isJoinDisabled =
      row.status === 1 ||
      row.status === 4 ||
      row.isPass === 2 ||
      moment(moment(row.examEndTime)).diff(new Date(), 'seconds') < 0 ||
      (row.status === 3 && row.joinNum && row.joinNumValue === row.examTimes)
    return isJoinDisabled
  }
  // 参加考试前的逻辑判断
  getJoinExamTips(row) {
    let isShowConfirm = true // 默认显示确认按钮
    const joinTips = '您确定现在参加考试吗？'
    const isPassAndJoin = '你已通过考试，重复考试将取成绩最好一次为最终结果。您确定现在参加考试吗？'
    // 通过精确到秒来比较迟到
    const lateSeconds = moment(new Date()).diff(moment(row.examBeginTime), 'seconds')
    const lateMinutes = lateSeconds / 60
    // console.log('迟到分钟==', lateMinutes)
    const lateMinutesText = `${Math.floor(lateMinutes)}分钟`
    const lateTimeTips = `你已迟到${lateMinutesText}不得进入参加考试！`
    const isLateTips = `本考试设置了迟到限制，${lateTimeTips}`
    const abnormalYips = '检测到你上次考试退出异常，系统已保留上次退出考试前的信息,可继续进行考试。'
    let tips = joinTips
    // 第一次参加考试(examTimes=0)或未通过考试(isPass=1)时
    if (row.examTimes === 0 || row.isPass === 1) {
      tips = joinTips
    }
    // 若已通过考试，且在限定次数内，点击出现弹框
    // 不限次数可以参加、限制了次数且参加次数在限次之内可以参加
    if (row.isPass === 3 && (!row.joinNum || (row.joinNum && row.joinNumValue > row.examTimes))) {
      tips = isPassAndJoin
    }
    //若创建考试时设置了迟到或迟到n分钟内禁止考试,并且已经开考
    if (row.lateBanExam && lateMinutes - row.lateBanExamValue > 0) {
      tips = isLateTips
      isShowConfirm = false
    }
    // 断网存贮考试，检测本地存在考试信息, 并且当前考试id与考生id是同一个
    const offLineExam = JSON.parse(localStorage.getItem('offLineExam'))
    let isReNew = false
    if (
      !_.isEmpty(offLineExam) &&
      offLineExam.examId === row.examId &&
      this.userId === row.examineeId
    ) {
      tips = abnormalYips
      isReNew = true
    }
    return { tips, isReNew, isShowConfirm }
  }
}
const examUtils = new ExamUtils()
export default examUtils
