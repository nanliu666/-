import request, { get } from '@/util/axios'

/**
 * 查询岗位（通过父节点id差子节点）
 */
 export const getStationParent = (params) => {
  return request({
    url: '/api/manage/v1/source/base/position/page',
    method: 'get',
    params: {
      ...params
    }
  })
}

// 组织管理-列表
export const getOrganization = (params) => get('/api/blade-resource/v1/organization', params)
