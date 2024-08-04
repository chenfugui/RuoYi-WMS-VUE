import request from '@/utils/request'

// 查询app功能菜单列表
export function listErpAppMenu(query, pageReq) {
  return request({
    url: '/base/erpAppMenu/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询app功能菜单详细
export function getErpAppMenu(id) {
  return request({
    url: '/base/erpAppMenu/' + id,
    method: 'get'
  })
}

// 新增app功能菜单
export function addErpAppMenu(data) {
  return request({
    url: '/base/erpAppMenu',
    method: 'post',
    data: data
  })
}

// 修改app功能菜单
export function updateErpAppMenu(data) {
  return request({
    url: '/base/erpAppMenu',
    method: 'put',
    data: data
  })
}

// 删除app功能菜单
export function delErpAppMenu(id) {
  return request({
    url: '/base/erpAppMenu/' + id,
    method: 'delete'
  })
}

// 导出app功能菜单
export function exportErpAppMenu(query) {
  return request({
    url: '/base/erpAppMenu/export',
    method: 'get',
    params: query
  })
}

// 查询app功能菜单详细
export function getErpAppMenuByRoleId(id) {
  return request({
    url: '/base/erpAppMenu/listByRole?roleId=' + id,
    method: 'get'
  })
}

// 查询app功能菜单详细
export function getErpAppMenuGroup() {
  return request({
    url: '/base/erpAppMenu/listAppMenu',
    method: 'get'
  })
}
