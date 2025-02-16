import request from '@/utils/request'

// 查询模板项目明细管理列表
export function listErpProTemplateDetail(query, pageReq) {
  return request({
    url: '/base/erpProTemplateDetail/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询模板项目明细管理详细
export function getErpProTemplateDetail(id) {
  return request({
    url: '/base/erpProTemplateDetail/' + id,
    method: 'get'
  })
}

// 新增模板项目明细管理
export function addErpProTemplateDetail(data) {
  return request({
    url: '/base/erpProTemplateDetail',
    method: 'post',
    data: data
  })
}

// 修改模板项目明细管理
export function updateErpProTemplateDetail(data) {
  return request({
    url: '/base/erpProTemplateDetail',
    method: 'put',
    data: data
  })
}

// 删除模板项目明细管理
export function delErpProTemplateDetail(id) {
  return request({
    url: '/base/erpProTemplateDetail/' + id,
    method: 'delete'
  })
}

// 导出模板项目明细管理
export function exportErpProTemplateDetail(query) {
  return request({
    url: '/base/erpProTemplateDetail/export',
    method: 'get',
    params: query
  })
}
