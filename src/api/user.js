import { postRequest, postRequestJson } from '@/utils/request'


// 用户手机密码---登录
export function loginPhonePwd(data) {
  return postRequestJson('user-api/users/passport/pwd', data)
}

// 用户账号密码登录
export function login(data) {
  // return postRequest('admin-api/admins/login', data)
  return postRequest('/user/login', data)
}

// 用户登出
export function logout(data) {
  return postRequest('/user/logout', data)
}

