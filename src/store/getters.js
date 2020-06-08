const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  user: state => state.user.user,
  permission_routes: state => state.permission.routes // 用来生成侧边菜单栏
}
export default getters
