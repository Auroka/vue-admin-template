<template>
  <div class="yrmh-pagination-item">
    <!-- :hide-on-single-page="true" -->
    <el-pagination
      background
      :layout="page.layout"
      :total="page.pageTotal"
      :page-size="page.pageSize"
      :current-page="page.pageNo"
      :page-sizes="page.pageSizes"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>
<script>
export default {
  props: {
    page: {
      type: Object,
      default: () => {
        return {
          pageNo: 1,
          pageSize: 10,
          pageTotal: 0,
          layout: 'total, prev, pager, next, sizes'
        }
      }
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.$emit('current-change', val)
    },
    handleSizeChange(val) {
      this.$emit('sizes-change', val)
    }
  }
}
</script>
<style lang="scss">
.yrmh-pagination-item {
  margin: 20px 0;
  .el-pagination.is-background {
    .el-pager li {
      border: 1px solid #dcdfe6;
      background-color: #fff;
      &:not(.disabled).active {
        border-color: #409eff;
      }
    }
    .btn-prev,
    .btn-next {
      border: 1px solid #dcdfe6;
      background-color: #fff;
    }
  }
}
</style>
