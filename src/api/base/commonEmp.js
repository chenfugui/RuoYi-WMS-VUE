import request from "@/utils/request";

// 查询单位信息列表
export function listCommonEmp(query, pageReq) {
  return request({
    url: "/base/commonEmp/list",
    method: "post",
    data: query,
    params: pageReq,
  });
}
// 查询单位树
export function selectTreeEmp() {
  return request({
    url: "/base/commonEmp/treeselect",
    method: "get",
  });
}

// 查询单位信息详细
export function getCommonEmp(empId) {
  return request({
    url: "/base/commonEmp/" + empId,
    method: "get",
  });
}

// 新增单位信息
export function addCommonEmp(data) {
  return request({
    url: "/base/commonEmp",
    method: "post",
    data: data,
  });
}

// 修改单位信息
export function updateCommonEmp(data) {
  return request({
    url: "/base/commonEmp",
    method: "put",
    data: data,
  });
}

// 删除单位信息
export function delCommonEmp(empId) {
  return request({
    url: "/base/commonEmp/" + empId,
    method: "delete",
  });
}

// 导出单位信息
export function exportCommonEmp(query) {
  return request({
    url: "/base/commonEmp/export",
    method: "get",
    params: query,
  });
}
