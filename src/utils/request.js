import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import qs from 'qs'

// 需要重定向到 login 界面的 code
const redirectLoginCode = {
  1002001011: '访问令牌不存在',
  1001001012: '访问令牌已过期',
  1001001013: '访问令牌已失效',
  1002001015: '账号未登陆',
  1001006008: '用户未登录'
}

// const requestIp = 'http://192.168.1.191'
const requestIp = 'http://192.168.1.43' // zx

const configDev = {
  'user-api': {
    prefix: 'user-api',
    target: requestIp + ':8061/user-api'
  },
  'task-api': {
    prefix: 'task-api',
    target: requestIp + ':18088/task-api'
  },
  'msg-api': {
    prefix: 'msg-api',
    target: requestIp + ':18089/msg-api'
  },
  'pay-api': {
    prefix: 'pay-api',
    target: requestIp + ':18084/pay-api'
  },
  'admin-api': {
    prefix: 'admin-api',
    target: requestIp + ':8060/admin-api'
  }
}

const serviceRouter = function(requestUrl) {
  const indexOf = requestUrl.indexOf('/')
  const _urlPrefix = requestUrl.substring(0, indexOf)
  return configDev[_urlPrefix]
}

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 15000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV === 'development') {
      // only used in development
      if (config.url.indexOf('.json') !== -1) {
        // ...
      } else {
        // 修改接口请求地址
        const obj = serviceRouter(config.url)
        if (obj) {
          config.url = config.url.replace(`${obj.prefix}`, obj.target)
        }
      }
    }
    const token = store.getters.token
    if (token) {
      // let each request carry token
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    // do something with request error
    // console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response) => {
    const res = response.data
    // if the custom code is not 0, it is judged as an error.
    if (res.code !== 0) {
      if (redirectLoginCode[res.code]) {
        // 如果是token失效 重定向到登录界面
        // 清空登录信息
        MessageBox.alert('登录已失效,请重新登录', '提示', {
          confirmButtonText: '确定',
          callback: (action, instance) => {
            store.dispatch('user/resetToken').then(() => {
              instance.close()
              window.location.reload()
            })
          }
        })
      } else {
        return Promise.reject(res)
      }
    } else {
      // 请求成功 返回数据
      return res
    }
  },
  (error) => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

/**
 * 请求
 * @param {*} url 请求地址
 * @param {*} data 请求数据
 */
export const postRequestJson = (url, data) => {
  const headers = { 'Content-Type': 'application/json' }
  return service({
    method: 'post',
    url: url,
    data: data,
    headers: headers
  })
}

// formData
export const postRequest = (url, data) => {
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  }
  return service({
    method: 'post',
    url: url,
    data: data,
    transformRequest: [
      function(data) {
        return qs.stringify(data, {
          arrayFormat: 'repeat'
        })
      }
    ],
    headers: headers
  })
}

export const request = service
