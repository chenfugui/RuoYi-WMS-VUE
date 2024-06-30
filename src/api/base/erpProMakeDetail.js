import request from '@/utils/request'

// 查询服装生产明细列表
export function listErpProMakeDetail(query, pageReq) {
  return request({
    url: '/base/erpProMakeDetail/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询服装生产明细详细
export function getErpProMakeDetail(id) {
  return request({
    url: '/base/erpProMakeDetail/' + id,
    method: 'get'
  })
}

// 新增服装生产明细
export function addErpProMakeDetail(data) {
  return request({
    url: '/base/erpProMakeDetail',
    method: 'post',
    data: data
  })
}

// 修改服装生产明细
export function updateErpProMakeDetail(data) {
  return request({
    url: '/base/erpProMakeDetail',
    method: 'put',
    data: data
  })
}

// 删除服装生产明细
export function delErpProMakeDetail(id) {
  return request({
    url: '/base/erpProMakeDetail/' + id,
    method: 'delete'
  })
}

// 导出服装生产明细
export function exportErpProMakeDetail(query) {
  return request({
    url: '/base/erpProMakeDetail/export',
    method: 'get',
    params: query
  })
}
