import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken, getUser, clearUserInfo } from '@/utils/cache' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const token = getToken()
  console.log('token:', token)

  if (token) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const permission_routes = store.getters.permission_routes
      if (permission_routes && permission_routes.length > 0) {
        next()
      } else {
        try {
          // get user info
          const { paths } = getUser()

          // generate accessible routes map based on roles
          const accessRoutes = await store.dispatch(
            'permission/generateRoutes',
            paths
          )
          console.log('accessRoutes', accessRoutes)
          // dynamically add accessible routes
          router.addRoutes(accessRoutes)
          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          clearUserInfo()
          next(`/login`)
          NProgress.done()
        }
      }
    }
  } else {
    clearUserInfo()
    /* has no token*/
    if (to.path === '/login') {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
