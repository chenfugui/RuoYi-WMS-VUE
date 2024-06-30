import request from '@/utils/request'

// 查询服装生产尺码列表
export function listErpProSize(query, pageReq) {
  return request({
    url: '/base/erpProSize/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询服装生产尺码详细
export function getErpProSize(id) {
  return request({
    url: '/base/erpProSize/' + id,
    method: 'get'
  })
}

// 新增服装生产尺码
export function addErpProSize(data) {
  return request({
    url: '/base/erpProSize',
    method: 'post',
    data: data
  })
}

// 修改服装生产尺码
export function updateErpProSize(data) {
  return request({
    url: '/base/erpProSize',
    method: 'put',
    data: data
  })
}

// 删除服装生产尺码
export function delErpProSize(id) {
  return request({
    url: '/base/erpProSize/' + id,
    method: 'delete'
  })
}

// 导出服装生产尺码
export function exportErpProSize(query) {
  return request({
    url: '/base/erpProSize/export',
    method: 'get',
    params: query
  })
}
