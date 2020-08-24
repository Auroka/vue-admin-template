/** 上传相关接口 */
import { postRequestJson } from '@/utils/request'

/**
 * 获取水印七牛token
 * @param {*} data
 */
export function getQiniuToken(data) {
  return postRequestJson('user-api/users/file/upload/token', data)
}
