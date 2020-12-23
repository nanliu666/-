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

  Mock.mock(new RegExp('/api/blade-auth/oauth/token' + '.*'), 'post', () => {
    return {
      access_token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOiJiZXN0Z3JhbmQiLCJjb21wYW55X2lkIjoiMTI1MjUyMzU5OTkwMzA3MjI1NyIsInVzZXJfbmFtZSI6IjAwMDEiLCJ3b3JrX25vIjoiMDAwMSIsImF1dGhvcml0aWVzIjpbIjExMjM1OTg4MTY3Mzg2NzUyMDEiXSwiY2xpZW50X2lkIjoic2FiZXIiLCJyb2xlX25hbWUiOm51bGwsImxpY2Vuc2UiOiJwb3dlcmVkIGJ5IGVwcm8iLCJhdmF0YXJfdXJsIjoiaHR0cHM6Ly9vYS1maWxlLWRldi5iZXN0Z3JhbmQuY29tLmNuL2E2NDI0MmFhNGI2MDQxNjM4NjA2NGFjOGNhMjhlODY4LmpwZyIsInVzZXJfaWQiOiIxMjU4MjQ0OTQ0MDMwOTE2NjA5Iiwicm9sZV9pZCI6IiIsIm9yZ19pZCI6IiIsInNjb3BlIjpbImFsbCJdLCJuaWNrX25hbWUiOiJaZXVzIiwiZXhwIjoxNTk1OTA5NTY2LCJqdGkiOiIzOWFmZjhjZi0zODNiLTQ0MmItODQ2NC1jMmI3NzQwZjE2ZTkiLCJwb3NpdGlvbl9pZCI6IjEyNjI5OTMyNTU3NDcwODAxOTMifQ.4iqM3DAktOMB0aotu7yXNGjhWBjjVNTCeZDKi5eoXuQ',
      token_type: 'bearer',
      refresh_token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOiJiZXN0Z3JhbmQiLCJjb21wYW55X2lkIjoiMTI1MjUyMzU5OTkwMzA3MjI1NyIsInVzZXJfbmFtZSI6IjAwMDEiLCJ3b3JrX25vIjoiMDAwMSIsImF1dGhvcml0aWVzIjpbIjExMjM1OTg4MTY3Mzg2NzUyMDEiXSwiY2xpZW50X2lkIjoic2FiZXIiLCJyb2xlX25hbWUiOm51bGwsImxpY2Vuc2UiOiJwb3dlcmVkIGJ5IGVwcm8iLCJhdmF0YXJfdXJsIjoiaHR0cHM6Ly9vYS1maWxlLWRldi5iZXN0Z3JhbmQuY29tLmNuL2E2NDI0MmFhNGI2MDQxNjM4NjA2NGFjOGNhMjhlODY4LmpwZyIsInVzZXJfaWQiOiIxMjU4MjQ0OTQ0MDMwOTE2NjA5Iiwicm9sZV9pZCI6IiIsIm9yZ19pZCI6IiIsInNjb3BlIjpbImFsbCJdLCJuaWNrX25hbWUiOiJaZXVzIiwiYXRpIjoiMzlhZmY4Y2YtMzgzYi00NDJiLTg0NjQtYzJiNzc0MGYxNmU5IiwiZXhwIjoxNTk2NTEwNzY2LCJqdGkiOiJmYjkzMmVhNi01NDFiLTQ5ZjMtODhjYi0yNmE1Y2FiZDhmMGUiLCJwb3NpdGlvbl9pZCI6IjEyNjI5OTMyNTU3NDcwODAxOTMifQ.t2i8DXxTjvkstS1vVLNWOYHWepwRChMp3kyiEPfY5go',
      expires_in: 3599,
      scope: 'all',
      tenant_id: 'bestgrand',
      company_id: '1252523599903072257',
      user_name: '0001',
      work_no: '0001',
      client_id: 'saber',
      role_name: null,
      license: 'powered by epro',
      avatar_url: 'https://oa-file-dev.bestgrand.com.cn/a64242aa4b60416386064ac8ca28e868.jpg',
      user_id: '1258244944030916609',
      role_id: '',
      org_id: '',
      nick_name: 'Zeus',
      position_id: '1262993255747080193',
      jti: '39aff8cf-383b-442b-8464-c2b7740f16e9'
    }
  })
}
