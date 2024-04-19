import request from '@/utils/request'

// 查询库存结算单列表
export function listInventorySettlement(query, pageReq) {
  return request({
    url: '/wms/inventorySettlement/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询库存结算单详细
export function getInventorySettlement(id) {
  return request({
    url: '/wms/inventorySettlement/' + id,
    method: 'get'
  })
}

// 新增库存结算单
export function addInventorySettlement(data) {
  return request({
    url: '/wms/inventorySettlement',
    method: 'post',
    data: data
  })
}

// 修改库存结算单
export function updateInventorySettlement(data) {
  return request({
    url: '/wms/inventorySettlement',
    method: 'put',
    data: data
  })
}

// 删除库存结算单
export function delInventorySettlement(id) {
  return request({
    url: '/wms/inventorySettlement/' + id,
    method: 'delete'
  })
}

// 导出库存结算单
export function exportInventorySettlement(query) {
  return request({
    url: '/wms/inventorySettlement/export',
    method: 'get',
    params: query
  })
}
