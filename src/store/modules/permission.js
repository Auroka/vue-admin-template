import { asyncRoutes, lastRoutes, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param paths
 * @param route
 */
function hasPermission(paths, route) {
  if (paths.includes(route.path)) {
    return true
  } else {
    return false
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param paths
 */
export function filterAsyncRoutes(routes, paths) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(paths, tmp) || tmp.path === '') {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, paths)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  // paths-账号下拥有权限的路由地址
  generateRoutes({ commit }, paths) {
    return new Promise(resolve => {
      let accessedRoutes

      accessedRoutes = filterAsyncRoutes(asyncRoutes, paths).concat(lastRoutes)

      commit('SET_ROUTES', accessedRoutes) // 用来生成侧边菜单栏
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
