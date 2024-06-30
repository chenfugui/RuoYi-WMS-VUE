import request from '@/utils/request'

// 查询服装生产进度列表
export function listErpProBatchExe(query, pageReq) {
  return request({
    url: '/base/erpProBatchExe/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询服装生产进度详细
export function getErpProBatchExe(id) {
  return request({
    url: '/base/erpProBatchExe/' + id,
    method: 'get'
  })
}

// 新增服装生产进度
export function addErpProBatchExe(data) {
  return request({
    url: '/base/erpProBatchExe',
    method: 'post',
    data: data
  })
}

// 修改服装生产进度
export function updateErpProBatchExe(data) {
  return request({
    url: '/base/erpProBatchExe',
    method: 'put',
    data: data
  })
}

// 删除服装生产进度
export function delErpProBatchExe(id) {
  return request({
    url: '/base/erpProBatchExe/' + id,
    method: 'delete'
  })
}

// 导出服装生产进度
export function exportErpProBatchExe(query) {
  return request({
    url: '/base/erpProBatchExe/export',
    method: 'get',
    params: query
  })
}
