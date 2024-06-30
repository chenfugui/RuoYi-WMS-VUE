import request from '@/utils/request'

// 查询服装尺码管理列表
export function listErpSize(query, pageReq) {
  return request({
    url: '/base/erpSize/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询服装尺码管理详细
export function getErpSize(id) {
  return request({
    url: '/base/erpSize/' + id,
    method: 'get'
  })
}

// 新增服装尺码管理
export function addErpSize(data) {
  return request({
    url: '/base/erpSize',
    method: 'post',
    data: data
  })
}

// 修改服装尺码管理
export function updateErpSize(data) {
  return request({
    url: '/base/erpSize',
    method: 'put',
    data: data
  })
}

// 删除服装尺码管理
export function delErpSize(id) {
  return request({
    url: '/base/erpSize/' + id,
    method: 'delete'
  })
}

// 导出服装尺码管理
export function exportErpSize(query) {
  return request({
    url: '/base/erpSize/export',
    method: 'get',
    params: query
  })
}
