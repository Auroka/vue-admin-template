/*
 * @Description:
 * @Author: lxd
 * @Date: 2020-07-21 17:58:07
 * @LastEditTime: 2020-08-24 15:14:06
 */

import Layout from '@/layout'

const demoRouters = {
  path: '/demo',
  component: Layout,
  redirect: 'noRedirect',
  meta: {
    title: '组件',
    icon: 'icon-setup_fill'
  },
  alwaysShow: true,
  children: [
    {
      path: 'tinymce',
      component: () => import('@/views/demo/tinymce'),
      meta: {
        title: 'tinymce'
      }
    }
  ]
}

export default demoRouters
