/* eslint-disable no-console */

import Mock from 'mockjs'

const normalData = {
  code: 200,
  success: true,
  msg: '操作成功',
  response: ''
}
export default ({ mock }) => {
  if (!mock) return
  Mock.mock(new RegExp('/api/v1/course/getNextCatalogsById' + '(\\?.*)?$'), 'get', () => {
    const list = _.times(20, () =>
      Mock.mock({
        id: '@integer(100000, 10000000000)',
        name: '@cword(2,3)'
      })
    )
    return {
      ...normalData,
      response: list
    }
  })
  Mock.mock(
    new RegExp('/api/manage/v1/web/course/getForegroundCourseList' + '(\\?.*)?$'),
    'get',
    () => {
      const list = _.times(8, () =>
        Mock.mock({
          courseId: '@integer(100000, 10000000000)',
          courseName: '@cword(3,6)',
          coverName: '&QcKv',
          coverUrl: 'https://oa-file-dev.bestgrand.com.cn/c1b23de42f1749e1bba27ade190e7e97.jpg',
          people: '@integer(10, 1000)',
          scope: '@integer(1, 5)',
          teacherId: '@integer(100000, 10000000000)',
          teacherName: '@cname',
          type: '@integer(1,3)'
        })
      )
      return {
        ...normalData,
        response: {
          data: list,
          totalNum: 20
        }
      }
    }
  )
}
