import request from '@/utils/request'

// 查询产品信息表列表
export function listProduct(query, pageReq) {
  return request({
    url: '/base/product/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询产品信息表详细
export function getProduct(proId) {
  return request({
    url: '/base/product/' + proId,
    method: 'get'
  })
}

// 新增产品信息表
export function addProduct(data) {
  return request({
    url: '/base/product',
    method: 'post',
    data: data
  })
}

// 修改产品信息表
export function updateProduct(data) {
  return request({
    url: '/base/product',
    method: 'put',
    data: data
  })
}

// 删除产品信息表
export function delProduct(proId) {
  return request({
    url: '/base/product/' + proId,
    method: 'delete'
  })
}

// 导出产品信息表
export function exportProduct(query) {
  return request({
    url: '/base/product/export',
    method: 'get',
    params: query
  })
}
