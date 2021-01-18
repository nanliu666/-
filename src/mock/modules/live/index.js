import Mock from 'mockjs'

const normalData = {
  code: 200,
  success: true,
  msg: '操作成功',
  response: ''
}
export default ({ mock }) => {
  if (!mock) return
  Mock.mock(new RegExp('/common/v1/live' + '(\\?.*)?$'), 'get', () => {
    const loginInfo = _.times(3, () =>
      Mock.mock({
        userId: '@integer(100000, 10000000000)',
        userName: '@cword(2,3)',
        'roleName|+1': ['Guest', 'Assistant', 'Lecturer'], //Guest-嘉宾 Assistant-助教 Lecturer-主讲师
        loginPassword: '@integer(100000, 10000000000)'
      })
    )
    const list = Mock.mock({
      liveTime: '@date()',
      livePlanId: '@integer(100000, 10000000000)',
      channelId: '@integer(100000, 10000000000)',
      channelName: '@cword(2,3)',
      categoryName: '@cword(2,3)',
      lecturerId: '@integer(100000, 10000000000)',
      lecturerName: '@cword(2,3)',
      coverImageUrl: Mock.Random.image(),
      liveRemark: '@cparagraph',
      qcodeImageUrl: '@url',
      watchLink: '@url',
      viewersNumber: 1,
      loginInfo
    })
    return {
      ...normalData,
      response: list
    }
  })
}
