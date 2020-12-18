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
}
