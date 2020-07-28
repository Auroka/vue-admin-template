/*
 * @Description: 一些公用函数
 * @Author: lxd
 * @Date: 2020-07-24 14:38:50
 * @LastEditTime: 2020-07-28 10:46:59
 */

import { getUser } from '@/utils/cache'
/**
 * 是否有该权限
 * @param {*} val 权限组
 */
export function getAuth(val) {
  const user = getUser()
  const permissions = user && user.permissions
  if (val && permissions && permissions.length > 0) {
    return permissions.includes(val)
  } else {
    return false
  }
}

/**
 *
 * @param {*} fmt 需要转换的格式 yyyy-MM-dd
 * @param {*} date 日期 2019-12-12 11:11:11
 */
export function formatDate(date, fmt = 'yyyy-MM-dd') {
  date = new Date(date)
  var o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }
  return fmt
}
