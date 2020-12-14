import request from '@/router/axios'

export const getDictionary = (params) => {
  return request({
    url: '/api/blade-system/v1/dict/code',
    method: 'get',
    params
  })
}
/**
 * 七牛云上传凭证获取接口
 * @param {Object} params - 不需要参数
 * */
export const getQiniuToken = (params) => {
  return request({
    url: '/api/common/v1/upload/token',
    method: 'get',
    params
  })
}
