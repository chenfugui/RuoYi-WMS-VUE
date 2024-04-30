import request from '@/utils/request'

// 查询产品生产表列表
export function listMake(query, pageReq) {
  return request({
    url: '/base/make/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询产品生产表详细
export function getMake(makeId) {
  return request({
    url: '/base/make/' + makeId,
    method: 'get'
  })
}

// 新增产品生产表
export function addMake(data) {
  return request({
    url: '/base/make',
    method: 'post',
    data: data
  })
}

// 修改产品生产表
export function updateMake(data) {
  return request({
    url: '/base/make',
    method: 'put',
    data: data
  })
}

// 删除产品生产表
export function delMake(makeId) {
  return request({
    url: '/base/make/' + makeId,
    method: 'delete'
  })
}

// 导出产品生产表
export function exportMake(query) {
  return request({
    url: '/base/make/export',
    method: 'get',
    params: query
  })
}
