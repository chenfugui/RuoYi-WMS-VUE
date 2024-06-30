import request from '@/utils/request'

// 查询服装生产批次列表
export function listErpProMakeBatch(query, pageReq) {
  return request({
    url: '/base/erpProMakeBatch/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询服装生产批次详细
export function getErpProMakeBatch(id) {
  return request({
    url: '/base/erpProMakeBatch/' + id,
    method: 'get'
  })
}

// 新增服装生产批次
export function addErpProMakeBatch(data) {
  return request({
    url: '/base/erpProMakeBatch',
    method: 'post',
    data: data
  })
}

// 修改服装生产批次
export function updateErpProMakeBatch(data) {
  return request({
    url: '/base/erpProMakeBatch',
    method: 'put',
    data: data
  })
}

// 删除服装生产批次
export function delErpProMakeBatch(id) {
  return request({
    url: '/base/erpProMakeBatch/' + id,
    method: 'delete'
  })
}

// 导出服装生产批次
export function exportErpProMakeBatch(query) {
  return request({
    url: '/base/erpProMakeBatch/export',
    method: 'get',
    params: query
  })
}
