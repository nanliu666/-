import Mock from 'mockjs'

const normalData = {
  code: 200,
  success: true,
  msg: '操作成功',
  response: ''
}
export default ({ mock }) => {
  if (!mock) return
  Mock.mock(new RegExp('/manage/v1/study/getStudyCenterMenu' + '(\\?.*)?$'), 'get', () => {
    const list = _.times(10, () =>
      Mock.mock({
        id: '@integer(100000, 10000000000)',
        menuName: '@cword(2,3)',
        num: '@natural(0, 10)',
        'studyType|+1': [0, 1]
      })
    )
    return {
      ...normalData,
      response: list
    }
  })
  Mock.mock(new RegExp('/manage/v1/study/myRequireCourse' + '(\\?.*)?$'), 'get', () => {
    const times = Mock.Random.natural(0, 6)
    const attachList = _.times(times, () => {
      return Mock.mock({
        // downloadDeadline: '2021-12-12',
        downloadDeadline: '@date',
        fileName: '@first',
        fileUrl: '@url',
        id: '@integer(100000, 10000000000)'
      })
    })
    const examList = _.times(times, () => {
      return Mock.mock({
        effectiveTime: '@date',
        examName: '@first',
        'status|+1': [1, 2, 3],
        id: '@integer(100000, 10000000000)'
      })
    })
    const list = _.times(10, () =>
      Mock.mock({
        attachList,
        attachNum: _.size(attachList),
        courseId: '@integer(100000, 10000000000)',
        courseName: '@title(3, 5)',
        coverName: '@title(3, 5)',
        coverUrl: Mock.Random.image('200x100'),
        examList,
        examNum: _.size(examList),
        learnRange: '@date',
        progress: '@integer(0, 100)',
        'status|+1': [1, 2, 3]
      })
    )
    return {
      ...normalData,
      response: list
    }
  })
}
