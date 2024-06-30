import request from '@/utils/request'

// 查询服装工价信息列表
export function listErpProPrice(query, pageReq) {
  return request({
    url: '/base/erpProPrice/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询服装工价信息详细
export function getErpProPrice(id) {
  return request({
    url: '/base/erpProPrice/' + id,
    method: 'get'
  })
}

// 新增服装工价信息
export function addErpProPrice(data) {
  return request({
    url: '/base/erpProPrice',
    method: 'post',
    data: data
  })
}

// 修改服装工价信息
export function updateErpProPrice(data) {
  return request({
    url: '/base/erpProPrice',
    method: 'put',
    data: data
  })
}

// 删除服装工价信息
export function delErpProPrice(id) {
  return request({
    url: '/base/erpProPrice/' + id,
    method: 'delete'
  })
}

// 导出服装工价信息
export function exportErpProPrice(query) {
  return request({
    url: '/base/erpProPrice/export',
    method: 'get',
    params: query
  })
}
