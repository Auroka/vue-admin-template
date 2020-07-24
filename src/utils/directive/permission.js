/**
 * 权限验证指令
 * example: v-permission=""
 */
import Vue from 'vue'
import { getAuth } from '@/utils/index'

Vue.directive('permission', {
  inserted(el, binding, vnode) {
    const { value } = binding
    if (value && typeof value === 'string') {
      if (!getAuth(value)) {
        if (value === 'history_work_list') {
          console.log(el.parentNode)
        }
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error('参数类型必须为字符串')
    }
  }
})
