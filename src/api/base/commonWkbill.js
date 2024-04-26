import request from '@/utils/request'

// 查询工单信息列表
export function listCommonWkbill(query, pageReq) {
  return request({
    url: '/base/commonWkbill/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询工单信息详细
export function getCommonWkbill(wkbillId) {
  return request({
    url: '/base/commonWkbill/' + wkbillId,
    method: 'get'
  })
}

// 新增工单信息
export function addCommonWkbill(data) {
  return request({
    url: '/base/commonWkbill',
    method: 'post',
    data: data
  })
}

// 修改工单信息
export function updateCommonWkbill(data) {
  return request({
    url: '/base/commonWkbill',
    method: 'put',
    data: data
  })
}

// 删除工单信息
export function delCommonWkbill(wkbillId) {
  return request({
    url: '/base/commonWkbill/' + wkbillId,
    method: 'delete'
  })
}

// 导出工单信息
export function exportCommonWkbill(query) {
  return request({
    url: '/base/commonWkbill/export',
    method: 'get',
    params: query
  })
}
