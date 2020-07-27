/*
 * @Description: 下载文件
 * @Author: lxd
 * @Date: 2020-07-27 16:58:09
 * @LastEditTime: 2020-07-27 16:58:26
 */

import { Message } from 'element-ui'

/**
 * 文件导出
 * @param {*} data 需要下载的流
 * @param {*} fileName 下载的文件名
 */
export function downFile(data, fileName) {
  if (!data) {
    return
  }
  const BLOB = new Blob([data], {
    type: 'application/json'
  })
  // 查看blob中是否有返回异常
  new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.readAsText(BLOB)
    fileReader.onload = function() {
      try {
        const result = JSON.parse(this.result)
        if (result && result.code && result.code !== 0) {
          reject(result.message)
        } else {
          resolve(BLOB)
        }
      } catch (e) {
        // TODO handle the exception
        resolve(BLOB)
      }
    }
  })
    .then(res => {
      doExport(res)
    })
    .catch(error => {
      Message.closeAll()
      Message({
        message: error || 'Error',
        type: 'error',
        duration: 2 * 1000
      })
    })

  function doExport(blob) {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
