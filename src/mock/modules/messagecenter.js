import Mock from 'mockjs'

const normalData = {
  code: 200,
  success: true,
  msg: '操作成功',
  response: ''
}
const message = {
  ...normalData,
  response: {
    data: [
      {
        id: '13214121239948228801',
        type: 'CourseNotify',
        bizId: '',
        title: '关于参加新员工入职考试的的通知',
        content: '胡景海发起的单个并行 在审批，请知晓',
        isRead: 0,
        createTime: '2020-10-28 19:22:56'
      },
      {
        id: '13214121239948283801',
        type: 'TrainNotify',
        bizId: '',
        title: '关于参加新员工入职考试的的通知',
        content: '胡景海发起的单个并行 在审批，请知晓',
        isRead: 0,
        createTime: '2020-10-28 19:22:56'
      },
      {
        id: '13214121239948288041',
        type: 'ExamNotify',
        bizId: '',
        title: '关于参加新员工入职考试的的通知',
        content: '胡景海发起的单个并行 在审批，请知晓',
        isRead: 1,
        createTime: '2020-10-28 19:22:56'
      },
      {
        id: '13214121239948288015',
        type: '',
        bizId: '',
        title: '关于参加新员工入职考试的的通知',
        content: '胡景海发起的单个并行 在审批，请知晓',
        isRead: 1,
        createTime: '2020-10-28 19:22:56'
      }
    ],
    totalNum: 13,
    totalPage: 13
  }
}
const unreadCount = {
  ...normalData,
  response: {
    unreadCount: 24
  }
}
export default ({ mock }) => {
  if (!mock) return
  Mock.mock(new RegExp('/msg/v1/msg/notify/count' + '.*'), 'get', () => {
    unreadCount.response.unreadCount++
    return unreadCount
  })
  Mock.mock(new RegExp('/msg/v1/msg/notify' + '.*'), 'get', () => {
    return message
  })

  Mock.mock(new RegExp('/msg/v1/msg/notify' + '.*'), 'post', () => {
    return normalData
  })
}
