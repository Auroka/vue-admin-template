import { login, logout } from '@/api/user'
import {
  getToken,
  setToken,
  removeToken,
  getUser,
  setUser,
  removeUser
} from '@/utils/cache'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  user: null
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USER: (state, user) => {
    state.user = user
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      // login({ username: username.trim(), password: password }).then(response => {
      const response = {
        data: {
          token: 'as7w8sd7wq08e09w80',
          name: '无敌管理者',
          paths: ['/', 'home', '/menu', 'menu1', 'menu2']
        }
      }
      const { data } = response
      commit('SET_TOKEN', data.token)
      setToken(data.token)

      // 只需要把用户信息存入浏览器缓存
      setUser(data)

      resolve()
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // get user info
  getUserInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      const data = getUser()
      console.log('data', data)
      if (!data) {
        reject('Verification failed, please Login again.')
      }

      commit('SET_USER', data)
      resolve(data)
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      // logout(state.token).then(() => {
      commit('SET_TOKEN', '')
      removeToken()
      commit('SET_USER', null)
      removeUser()
      resetRouter()
      resolve()
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      commit('SET_USER', null)
      removeUser()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
