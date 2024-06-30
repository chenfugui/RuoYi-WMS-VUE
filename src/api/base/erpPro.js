import request from '@/utils/request'

// 查询服装产品管理列表
export function listErpPro(query, pageReq) {
  return request({
    url: '/base/erpPro/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询服装产品管理详细
export function getErpPro(proId) {
  return request({
    url: '/base/erpPro/' + proId,
    method: 'get'
  })
}

// 新增服装产品管理
export function addErpPro(data) {
  return request({
    url: '/base/erpPro',
    method: 'post',
    data: data
  })
}

// 修改服装产品管理
export function updateErpPro(data) {
  return request({
    url: '/base/erpPro',
    method: 'put',
    data: data
  })
}

// 删除服装产品管理
export function delErpPro(proId) {
  return request({
    url: '/base/erpPro/' + proId,
    method: 'delete'
  })
}

// 导出服装产品管理
export function exportErpPro(query) {
  return request({
    url: '/base/erpPro/export',
    method: 'get',
    params: query
  })
}
