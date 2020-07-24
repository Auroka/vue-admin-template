import Cookies from 'js-cookie'

const TOKENKEY = '_admin_contract_token'
const USERKEY = '_admin_contract_userinfo'

// 用户token
export function getToken() {
  return Cookies.get(TOKENKEY)
}

export function setToken(token) {
  Cookies.set(TOKENKEY, token, { expires: 7 })
}

// 用户信息
export function getUser() {
  return JSON.parse(localStorage.getItem(USERKEY))
}

export function setUser(user) {
  localStorage.setItem(USERKEY, JSON.stringify(user))
}

// 清空用户信息
export function clearUserInfo() {
  Cookies.remove(TOKENKEY)
  localStorage.removeItem(USERKEY)
}
