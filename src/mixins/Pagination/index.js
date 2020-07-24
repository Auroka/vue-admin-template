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
    },
    // 分页切换
    handleSizesChange(val) {
      this.page.pageSize = val
      this.pageCallBack()
    }
  }
}
