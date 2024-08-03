import request from '@/utils/request'

// 查询角色菜单表列表
export function listErpAppRoleMenu(query, pageReq) {
  return request({
    url: '/base/erpAppRoleMenu/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询角色菜单表详细
export function getErpAppRoleMenu(id) {
  return request({
    url: '/base/erpAppRoleMenu/' + id,
    method: 'get'
  })
}

// 新增角色菜单表
export function addErpAppRoleMenu(data) {
  return request({
    url: '/base/erpAppRoleMenu',
    method: 'post',
    data: data
  })
}

// 修改角色菜单表
export function updateErpAppRoleMenu(data) {
  return request({
    url: '/base/erpAppRoleMenu',
    method: 'put',
    data: data
  })
}

// 删除角色菜单表
export function delErpAppRoleMenu(id) {
  return request({
    url: '/base/erpAppRoleMenu/' + id,
    method: 'delete'
  })
}

// 导出角色菜单表
export function exportErpAppRoleMenu(query) {
  return request({
    url: '/base/erpAppRoleMenu/export',
    method: 'get',
    params: query
  })
}
