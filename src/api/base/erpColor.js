import request from '@/utils/request'

// 查询服装颜色管理列表
export function listErpColor(query, pageReq) {
  return request({
    url: '/base/erpColor/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询服装颜色管理详细
export function getErpColor(id) {
  return request({
    url: '/base/erpColor/' + id,
    method: 'get'
  })
}

// 新增服装颜色管理
export function addErpColor(data) {
  return request({
    url: '/base/erpColor',
    method: 'post',
    data: data
  })
}

// 修改服装颜色管理
export function updateErpColor(data) {
  return request({
    url: '/base/erpColor',
    method: 'put',
    data: data
  })
}

// 删除服装颜色管理
export function delErpColor(id) {
  return request({
    url: '/base/erpColor/' + id,
    method: 'delete'
  })
}

// 导出服装颜色管理
export function exportErpColor(query) {
  return request({
    url: '/base/erpColor/export',
    method: 'get',
    params: query
  })
}
