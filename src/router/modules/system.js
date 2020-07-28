/*
 * @Description: 系统设置
 * @Author: lxd
 * @Date: 2020-07-21 17:58:07
 * @LastEditTime: 2020-07-28 16:36:27
 */

import Layout from '@/layout'

const memberRouters = {
  path: '/system',
  component: Layout,
  redirect: 'noRedirect',
  meta: {
    title: '系统',
    icon: 'icon-setup_fill'
  },
  alwaysShow: true,
  children: [
    {
      path: 'role',
      component: () => import('@/views/system/role'),
      meta: {
        title: '权限组'
      }
    },
    {
      path: 'account',
      component: () => import('@/views/system/account'),
      meta: {
        title: '账号管理'
      }
    },
    {
      path: 'resource',
      component: () => import('@/views/system/resource'),
      meta: {
        title: '资源管理'
      }
    }
  ]
}

export default memberRouters
