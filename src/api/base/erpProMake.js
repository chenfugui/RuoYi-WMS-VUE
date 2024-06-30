import request from '@/utils/request'

// 查询服装生产管理列表
export function listErpProMake(query, pageReq) {
  return request({
    url: '/base/erpProMake/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询服装生产管理详细
export function getErpProMake(id) {
  return request({
    url: '/base/erpProMake/' + id,
    method: 'get'
  })
}

// 新增服装生产管理
export function addErpProMake(data) {
  return request({
    url: '/base/erpProMake',
    method: 'post',
    data: data
  })
}

// 修改服装生产管理
export function updateErpProMake(data) {
  return request({
    url: '/base/erpProMake',
    method: 'put',
    data: data
  })
}

// 删除服装生产管理
export function delErpProMake(id) {
  return request({
    url: '/base/erpProMake/' + id,
    method: 'delete'
  })
}

// 导出服装生产管理
export function exportErpProMake(query) {
  return request({
    url: '/base/erpProMake/export',
    method: 'get',
    params: query
  })
}
