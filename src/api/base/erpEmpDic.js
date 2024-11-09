import request from '@/utils/request'

// 查询常用字典管理列表
export function listErpEmpDic(query, pageReq) {
  return request({
    url: '/base/erpEmpDic/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询常用字典管理详细
export function getErpEmpDic(id) {
  return request({
    url: '/base/erpEmpDic/' + id,
    method: 'get'
  })
}

// 新增常用字典管理
export function addErpEmpDic(data) {
  return request({
    url: '/base/erpEmpDic',
    method: 'post',
    data: data
  })
}

// 修改常用字典管理
export function updateErpEmpDic(data) {
  return request({
    url: '/base/erpEmpDic',
    method: 'put',
    data: data
  })
}

// 删除常用字典管理
export function delErpEmpDic(id) {
  return request({
    url: '/base/erpEmpDic/' + id,
    method: 'delete'
  })
}

// 导出常用字典管理
export function exportErpEmpDic(query) {
  return request({
    url: '/base/erpEmpDic/export',
    method: 'get',
    params: query
  })
}
