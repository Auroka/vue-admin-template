/*
 * @Description:
 * @Author: lxd
 * @Date: 2020-06-08 17:31:42
 * @LastEditTime: 2020-08-31 09:39:30
 */
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  permission_routes: state => state.permission.routes // 用来生成侧边菜单栏
}
export default getters
