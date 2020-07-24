/*
 * @Description:
 * @Author: lxd
 * @Date: 2020-06-08 17:31:42
 * @LastEditTime: 2020-07-24 14:28:01
 */

import { postRequest } from '@/utils/request'

// 用户登录
export function login(data) {
  return postRequest('contract-api/contract/login', data)
}

// 用户登出
export function logout(data) {
  return postRequest('contract-api/contract/loginout', data)
}

// 更新用户信息
export function updateUser(data) {
  return postRequest('contract-api/contract/user/update', data)
}
