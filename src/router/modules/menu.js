import Layout from '@/layout'

const menuRouters = {
  path: '/menu',
  component: Layout,
  name: 'Label',
  redirect: '/menu/menu1',
  meta: {
    title: '菜单',
    icon: 'icon-biaoqian'
  },
  alwaysShow: true,
  children: [
    {
      path: 'menu1',
      component: () => import('@/views/menu/menu1'),
      name: 'menu1',
      meta: {
        title: '菜单1'
      }
    },
    {
      path: 'menu2',
      component: () => import('@/views/menu/menu2'),
      name: 'menu2',
      meta: {
        title: '菜单2'
      }
    }
  ]
}

export default menuRouters
