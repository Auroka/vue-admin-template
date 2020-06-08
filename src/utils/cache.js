import Cookies from 'js-cookie'

const TOKENKEY = '_token'
const USERKEY = '_userinfo'

// 用户token
export function getToken() {
  return Cookies.get(TOKENKEY)
}

export function setToken(token) {
  return Cookies.set(TOKENKEY, token)
}

export function removeToken() {
  return Cookies.remove(TOKENKEY)
}

// 用户信息
export function getUser() {
  return JSON.parse(localStorage.getItem(USERKEY))
}

export function setUser(user) {
  return localStorage.setItem(USERKEY, JSON.stringify(user))
}

export function removeUser() {
  return localStorage.removeItem(USERKEY)
}
