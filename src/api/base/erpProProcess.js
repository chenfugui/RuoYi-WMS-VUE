import request from '@/utils/request'

// 查询服装工序信息列表
export function listErpProProcess(query, pageReq) {
  return request({
    url: '/base/erpProProcess/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询服装工序信息详细
export function getErpProProcess(id) {
  return request({
    url: '/base/erpProProcess/' + id,
    method: 'get'
  })
}

// 新增服装工序信息
export function addErpProProcess(data) {
  return request({
    url: '/base/erpProProcess',
    method: 'post',
    data: data
  })
}

// 修改服装工序信息
export function updateErpProProcess(data) {
  return request({
    url: '/base/erpProProcess',
    method: 'put',
    data: data
  })
}

// 删除服装工序信息
export function delErpProProcess(id) {
  return request({
    url: '/base/erpProProcess/' + id,
    method: 'delete'
  })
}

// 导出服装工序信息
export function exportErpProProcess(query) {
  return request({
    url: '/base/erpProProcess/export',
    method: 'get',
    params: query
  })
}
