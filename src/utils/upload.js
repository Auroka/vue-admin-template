/*
 * @Description: 七牛上传
 * @Author: lxd
 * @Date: 2020-08-24 17:42:36
 * @LastEditTime: 2020-08-28 11:34:07
 */
import * as qiniu from 'qiniu-js'
import { getQiniuToken } from '@/api/upload'

/**
 * 公用图片上传
 * @param {*} item
 * @param {*} file
 */
export function upload(origin, item, file) {
  return new Promise((resolve, reject) => {
    const typeArr = file.type.split('/')
    const param = {
      origin: origin,
      fileBaseInfoDTO: {
        fileName: file.name,
        fileSize: file.size,
        fileType: typeArr[1]
      }
    }
    getQiniuToken(param)
      .then(res => {
        const token = res.data.uploadToken // 请求后台拿七牛云token;
        file.fileUrl = res.data.downloadUrl // 图片地址
        file.fileKey = res.data.fileKey // 图片key
        qnUpload(resolve, reject, item, file, token)
      })
      .catch(error => {
        if (item) {
          item.onError(file)
        }
        reject(file)
      })
  })
}

// 七牛上传
function qnUpload(resolve, reject, item, file, token) {
  let config = {
    useCdnDomain: true, //表示是否使用 cdn 加速域名，为布尔值，true 表示使用，默认为 false。
    region: qiniu.region.z2 // 根据具体提示修改上传地区,当为 null 或 undefined 时，自动分析上传域名区域
  }

  let putExtra = {
    fname: '', //文件原文件名
    params: {}, //用来放置自定义变量
    mimeType: null //用来限制上传文件类型，为 null 时表示不对文件类型限制；限制类型放到数组里： ["image/png", "image/jpeg", "image/gif"]
  }
  var observable = qiniu.upload(file, file.fileKey, token, putExtra, config)
  observable.subscribe({
    next: result => {
      // 主要用来展示当前上传进度
      if (item) {
        file.percent = result.total.percent
        item.onProgress(file)
      }
    },
    error: errResult => {
      if (errResult.code === 579) {
        // 回调地址没找到，但已经上传成功了
        if (item) {
          item.onSuccess(file)
        }

        resolve(file)
      }
      // 失败报错信息
      if (errResult.code === 401) {
        // token失效
        token = ''
      }
      reject(file)
    },
    complete: result => {
      // 接收成功后返回的信息
      if (item) {
        item.onSuccess(file)
      }
      resolve(file)
    }
  })
}
