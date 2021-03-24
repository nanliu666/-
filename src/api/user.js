import request, { get } from '@/util/axios'
import website from '@/config/website'

// 保存登录学分
export const saveLoginCredit = (params) => {
  return get('/api/manage/v1/login/saveLoginCredit', params)
}
// 通过token获取用户信息
export const userDetailByToken = (params) => {
  return get('/blade-auth/oauth/userdetail/taken', params)
}
// 邮箱和手机号可用性校验
export const checkUserInfo = (params) => {
  return request({
    url: '/api/user/v1/user/info/check',
    method: 'post',
    params: params
  })
}
export const loginByUsername = (tenantId, username, password, type, key, code, account) =>
  request({
    url: '/api/blade-auth/oauth/token',
    method: 'post',
    headers: {
      'Tenant-Id': tenantId,
      'Captcha-Key': key,
      'Captcha-Code': code
    },
    params: {
      tenantId,
      account,
      username,
      password,
      grant_type: website.captchaMode ? 'captcha' : 'password',
      scope: 'all',
      type,
      user_type: 'staff'
    }
  })

export const refreshToken = (refresh_token, tenantId) =>
  request({
    url: '/api/blade-auth/oauth/token',
    method: 'post',
    headers: {
      'Tenant-Id': tenantId
    },
    params: {
      tenantId,
      refresh_token,
      grant_type: 'refresh_token',
      scope: 'all',
      user_type: 'staff'
    }
  })
export const getUserPrivilege = (userId) => {
  return request({
    url: '/api/sys/v1/user/menu/privilege',
    method: 'get',
    params: {
      userId
    }
  })
}

export const getCaptcha = () =>
  request({
    url: '/api/blade-auth/oauth/captcha',
    method: 'get'
  })

export const logout = () =>
  request({
    url: '/api/blade-auth/oauth/logout',
    method: 'get'
  })

export const getUserInfo = () =>
  request({
    url: '/api/blade-auth/oauth/user-info',
    method: 'get'
  })

export const sendLogs = (list) =>
  request({
    url: '/api/blade-auth/oauth/logout',
    method: 'post',
    data: list
  })

export const clearCache = () =>
  request({
    url: '/api/blade-auth/oauth/clear-cache',
    method: 'get'
  })

export const getTenantInfo = (domain) =>
  request({
    url: '/api/sys/v1/domain/info',
    method: 'get',
    params: domain
  })

//获取手机验证码
export const getCode = (params) => {
  return request({
    url: '/api/common/v1/sms/send',
    method: 'post',
    params: {
      ...params
    }
  })
}

//验证手机验证码
export const checkPhoneCode = (params) => {
  return request({
    url: '/api/common/v1/sms/check',
    method: 'post',
    params: {
      ...params
    }
  })
}

export const checkPassword = (params) => {
  return request({
    url: '/api/user/v1/user/pwd',
    method: 'post',
    params: {
      ...params
    }
  })
}

export const userRegister = (params) => {
  return request({
    url: '/api/user/v1/user/register',
    method: 'post',
    params: {
      ...params
    }
  })
}
/**
 * 我们的任务
 * */
export const queryMyMission = (params) => get('/manage/v1/web/index/queryMyMission', params)
