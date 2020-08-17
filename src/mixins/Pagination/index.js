/*
 * @Description: 分页
 * @Author: lxd
 * @Date: 2020-07-24 14:36:55
 * @LastEditTime: 2020-08-17 14:16:20
 */
import PaginationItem from '@/components/PaginationItem'
export default {
  data() {
    return {
      page: {
        pageNo: 1,
        pageSize: 10,
        pageTotal: 0,
        layout: 'prev, pager, next, total, sizes'
      }
    }
  },
  components: {
    PaginationItem
  },
  methods: {
    // 页码切换
    handleCurrentChange(val) {
      this.page.pageNo = val
      this.pageCallBack()
      // 滚动条置顶
      this.$nextTick(() => {
        document.documentElement.scrollTop = 0
      })
    },
    // 分页切换
    handleSizesChange(val) {
      this.page.pageSize = val
      this.handleCurrentChange(1)
    }
  }
}
