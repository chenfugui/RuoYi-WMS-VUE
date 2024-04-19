import request from '@/utils/request'

// 查询供应商账户流水列表
export function listSupplierTransaction(query, pageReq) {
  return request({
    url: '/wms/supplierTransaction/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询供应商账户流水详细
export function getSupplierTransaction(id) {
  return request({
    url: '/wms/supplierTransaction/' + id,
    method: 'get'
  })
}

// 新增供应商账户流水
export function addSupplierTransaction(data) {
  return request({
    url: '/wms/supplierTransaction',
    method: 'post',
    data: data
  })
}

// 修改供应商账户流水
export function updateSupplierTransaction(data) {
  return request({
    url: '/wms/supplierTransaction',
    method: 'put',
    data: data
  })
}

// 删除供应商账户流水
export function delSupplierTransaction(id) {
  return request({
    url: '/wms/supplierTransaction/' + id,
    method: 'delete'
  })
}

// 导出供应商账户流水
export function exportSupplierTransaction(query) {
  return request({
    url: '/wms/supplierTransaction/export',
    method: 'get',
    params: query
  })
}
