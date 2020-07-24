// * 权限（角色管理）*//
import { postRequest, postRequestJson } from '@/utils/request'

// * 资源管理 * //

// 查询资源树
export function getResource(data) {
  return postRequest('contract-api/contract/resource/select/tree', data)
}

// 添加资源
export function addResource(data) {
  return postRequest('contract-api/contract/resource/add', data)
}

// 更新资源
export function updateResource(data) {
  return postRequest('contract-api/contract/resource/update', data)
}

// 删除资源
export function deleteResource(data) {
  return postRequest('contract-api/contract/resource/delete', data)
}

// * 权限组 * //

// 获取角色列表
export function getRole(data) {
  return postRequestJson('contract-api/contract/role/select/page', data)
}

// 添加角色
export function addRole(data) {
  return postRequest('contract-api/contract/role/add', data)
}

// 给角色添加权限
export function addResourceInRole(data) {
  return postRequestJson('contract-api/contract/role/assign/resource', data)
}

// 角色拥有的权限
export function getResourceInRole(data) {
  return postRequest('contract-api/contract/role/select/roleresource', data)
}

// 编辑角色
export function updateRole(data) {
  return postRequest('contract-api/contract/role/update', data)
}

// 删除角色
export function deleteRole(data) {
  return postRequest('contract-api/contract/role/delete', data)
}

// 禁用/启用角色
export function enableRole(data) {
  return postRequest('contract-api/contract/role/enable', data)
}

// * 账号管理 * //

// 获取账户列表
export function getAccount(data) {
  return postRequestJson('contract-api/contract/user/select/page', data)
}

// 获取角色下拉列表（权限组）
export function getRoleList(data) {
  return postRequest('contract-api/contract/user/roleList', data)
}

// 添加账号
export function addAccount(data) {
  return postRequest('contract-api/contract/user/add', data)
}

// 禁用/启用用户
export function enableUser(data) {
  return postRequest('contract-api/contract/user/enable', data)
}

// 密码重置
export function resetPassword(data) {
  return postRequest('contract-api/contract/user/reset', data)
}

// 更新用户信息
export function updateAccount(data) {
  return postRequest('contract-api/contract/user/updateUser', data)
}
