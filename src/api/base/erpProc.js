import request from '@/utils/request'

// 查询服装工序管理列表
export function listErpProc(query, pageReq) {
  return request({
    url: '/base/erpProc/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询服装工序管理详细
export function getErpProc(id) {
  return request({
    url: '/base/erpProc/' + id,
    method: 'get'
  })
}

// 新增服装工序管理
export function addErpProc(data) {
  return request({
    url: '/base/erpProc',
    method: 'post',
    data: data
  })
}

// 修改服装工序管理
export function updateErpProc(data) {
  return request({
    url: '/base/erpProc',
    method: 'put',
    data: data
  })
}

// 删除服装工序管理
export function delErpProc(id) {
  return request({
    url: '/base/erpProc/' + id,
    method: 'delete'
  })
}

// 导出服装工序管理
export function exportErpProc(query) {
  return request({
    url: '/base/erpProc/export',
    method: 'get',
    params: query
  })
}
