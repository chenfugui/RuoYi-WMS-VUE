import request from '@/utils/request'

// 查询App版本列表
export function listErpAppVer(query, pageReq) {
  return request({
    url: '/base/erpAppVer/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询App版本详细
export function getErpAppVer(id) {
  return request({
    url: '/base/erpAppVer/' + id,
    method: 'get'
  })
}

// 新增App版本
export function addErpAppVer(data) {
  return request({
    url: '/base/erpAppVer',
    method: 'post',
    data: data
  })
}

// 修改App版本
export function updateErpAppVer(data) {
  return request({
    url: '/base/erpAppVer',
    method: 'put',
    data: data
  })
}

// 删除App版本
export function delErpAppVer(id) {
  return request({
    url: '/base/erpAppVer/' + id,
    method: 'delete'
  })
}

// 导出App版本
export function exportErpAppVer(query) {
  return request({
    url: '/base/erpAppVer/export',
    method: 'get',
    params: query
  })
}
