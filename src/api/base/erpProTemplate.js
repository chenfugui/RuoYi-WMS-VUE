import request from '@/utils/request'

// 查询模板表列表
export function listErpProTemplate(query, pageReq) {
  return request({
    url: '/base/erpProTemplate/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询模板表详细
export function getErpProTemplate(id) {
  return request({
    url: '/base/erpProTemplate/' + id,
    method: 'get'
  })
}

// 新增模板表
export function addErpProTemplate(data) {
  return request({
    url: '/base/erpProTemplate',
    method: 'post',
    data: data
  })
}

// 修改模板表
export function updateErpProTemplate(data) {
  return request({
    url: '/base/erpProTemplate',
    method: 'put',
    data: data
  })
}

// 删除模板表
export function delErpProTemplate(id) {
  return request({
    url: '/base/erpProTemplate/' + id,
    method: 'delete'
  })
}

// 导出模板表
export function exportErpProTemplate(query) {
  return request({
    url: '/base/erpProTemplate/export',
    method: 'get',
    params: query
  })
}
