import request from '@/utils/request'

// 查询工序信息列表
export function listCommonStep(query, pageReq) {
  return request({
    url: '/base/commonStep/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询工序信息详细
export function getCommonStep(stepId) {
  return request({
    url: '/base/commonStep/' + stepId,
    method: 'get'
  })
}

// 新增工序信息
export function addCommonStep(data) {
  return request({
    url: '/base/commonStep',
    method: 'post',
    data: data
  })
}

// 修改工序信息
export function updateCommonStep(data) {
  return request({
    url: '/base/commonStep',
    method: 'put',
    data: data
  })
}

// 删除工序信息
export function delCommonStep(stepId) {
  return request({
    url: '/base/commonStep/' + stepId,
    method: 'delete'
  })
}

// 导出工序信息
export function exportCommonStep(query) {
  return request({
    url: '/base/commonStep/export',
    method: 'get',
    params: query
  })
}
