import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import { getToken, clearUserInfo } from '@/utils/cache'
import qs from 'qs'

// 需要重定向到 login 界面的 code
const redirectLoginCode = {
  1102001011: '访问令牌不存在',
  1102001018: '访问令牌已过期',
  1102001013: '访问令牌已失效',
  1102001015: '账号未登录'
}

const requestIp = 'http://192.168.1.222' // zx

const configDev = {
  'contract-api': {
    prefix: 'contract-api',
    target: requestIp + ':18099/contract-api'
  },
  'oss-api': {
    prefix: 'oss-api',
    target: requestIp + ':18030/oss-api'
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
  config => {
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
        // config.url = 'http://test.yueranmh.com/' + config.url
      }
    }

    const token = getToken()

    if (token) {
      // let each request carry token
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
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
  response => {
    const res = response.data
    // if the custom code is not 0, it is judged as an error.
    if (res.code !== 0) {
      if (redirectLoginCode[res.code]) {
        // 如果是token失效 重定向到登录界面
        // 清空登录信息
        MessageBox.alert('登录已失效,请重新登录', '提示', {
          confirmButtonText: '确定',
          callback: (action, instance) => {
            clearUserInfo()
            instance.close()
            window.location.href = '/login'
          }
        })
      } else {
        if (res.code === 2001001000) {
          // 服务端异常
          Message({
            type: 'error',
            message: '服务器开小差了，请稍后再试'
          })
        } else {
          // 其他异常
          Message({
            type: 'error',
            message: res.message
          })
        }
      }
      return Promise.reject(res)
    } else {
      // 请求成功 返回数据
      return res
    }
  },
  error => {
    Message.closeAll()
    if (error.message.includes('timeout')) {
      Message({
        message: '请求超时',
        type: 'error',
        duration: 3000
      })
    } else {
      Message({
        message: '网络异常，请检查网络设置',
        type: 'error',
        duration: 3000
      })
    }
    return Promise.reject(error)
  }
)

/**
 * 请求
 * @param {string} url 请求地址
 * @param {object} data 请求数据
 * @param {string} responseType 相应类型 当请求导出文件流时 responseType='blob'
 */
export const postRequestJson = (url, data, responseType = '') => {
  const headers = { 'Content-Type': 'application/json' }
  return service({
    method: 'post',
    url: url,
    data: data,
    headers: headers,
    responseType
  })
}

// formData
export const postRequest = (url, data, responseType = '') => {
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
    headers: headers,
    responseType
  })
}

export const request = service
