import request from '@/utils/request'

// 查询库存结算明细列表
export function listInventorySettlementDetail(query, pageReq) {
  return request({
    url: '/wms/inventorySettlementDetail/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询库存结算明细详细
export function getInventorySettlementDetail(id) {
  return request({
    url: '/wms/inventorySettlementDetail/' + id,
    method: 'get'
  })
}

// 新增库存结算明细
export function addInventorySettlementDetail(data) {
  return request({
    url: '/wms/inventorySettlementDetail',
    method: 'post',
    data: data
  })
}

// 修改库存结算明细
export function updateInventorySettlementDetail(data) {
  return request({
    url: '/wms/inventorySettlementDetail',
    method: 'put',
    data: data
  })
}

// 删除库存结算明细
export function delInventorySettlementDetail(id) {
  return request({
    url: '/wms/inventorySettlementDetail/' + id,
    method: 'delete'
  })
}

// 导出库存结算明细
export function exportInventorySettlementDetail(query) {
  return request({
    url: '/wms/inventorySettlementDetail/export',
    method: 'get',
    params: query
  })
}
