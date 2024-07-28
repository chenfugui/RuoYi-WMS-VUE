import request from '@/utils/request'

// 查询产品颜色管理列表
export function listErpProColor(query, pageReq) {
  return request({
    url: '/base/erpProColor/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询产品颜色管理详细
export function getErpProColor(id) {
  return request({
    url: '/base/erpProColor/' + id,
    method: 'get'
  })
}

// 新增产品颜色管理
export function addErpProColor(data) {
  return request({
    url: '/base/erpProColor',
    method: 'post',
    data: data
  })
}

// 修改产品颜色管理
export function updateErpProColor(data) {
  return request({
    url: '/base/erpProColor',
    method: 'put',
    data: data
  })
}

// 删除产品颜色管理
export function delErpProColor(id) {
  return request({
    url: '/base/erpProColor/' + id,
    method: 'delete'
  })
}

// 导出产品颜色管理
export function exportErpProColor(query) {
  return request({
    url: '/base/erpProColor/export',
    method: 'get',
    params: query
  })
}
