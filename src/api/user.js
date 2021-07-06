import request, { get } from '@/util/axios'
import website from '@/config/website'

/**
 * 获取子组织岗位和直属员工接口
 * @param {object} params 参数
 * @param {string} params.parentId 父组织ID，顶级父节点为"0"
 * @param {string} [params.search] 工号或姓名，支持模糊查询
 * @returns {{orgs: Array<any>; users: Array<any>}}
 */
 export const getPostionUserChild2 = (params) => get('/manage/v1/position/user/child', params)
/**
 * 获取子组织架构和直属员工接口
 * @param {object} params 参数
 * @param {string} params.parentId 父组织ID，顶级父节点为"0"
 * @param {string} [params.search] 工号或姓名，支持模糊查询
 * @returns {{orgs: Array<any>; users: Array<any>}}
 */
export const getOrgUserChild = (params) => get('/org/v1/org/user/child', params)

/**
 * 获取外部用户
 * @param {object} params 参数
 * @param {string} params.pageNo
 * @param {string} params.pageSize
 */
export const getOuterUser = (params) => get('/user/v1/user/outer', params)

/**
 * 获取当前组织下的所有人
 */
export const getUserList = (params) => get('/user/v1/user/basis', params)

// 获取用户的组织id（包括当前和当前以上的）
export const getOrgIds = (params) => {
  return get('/api/manage/v1/web/index/queryOrgIds', params)
}
// 获取用户的logo banner 首页布局等信息
export const getDiyInfor = (params) => {
  return get('/api/manage/v1/cms/plan/my', params)
}
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
      device_type: 'pc',
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

/**
 * 获取当前岗位下的所有人
 */
 export const getPositionUserList1 = (params) => get('/manage/v1/user/info/position', params)
 export const getPositionUserList = (params) => get('/manage/v1/positions/user/child', params)

 /**
 * @desc 分组列表
 */
export const getGroup = (params) => get('/api/user/v1/usergroup/list', params)

/**
 * 获取当前分组下的所有人
 */
// export const getUsergroupList = (params) => get('/manage/v1/usergroup/queryUserList', params)
export const getUsergroupList = (params) => get('/api/user/v1/usergroup/queryUserList', params)