<!--
 * @Description: 权限组-表格模块
 * @Author: lxd
 * @Date: 2020-07-23 17:02:21
 * @LastEditTime: 2020-07-24 11:36:11
-->
<template>
  <div class="system-role-table-wrap">
    <el-table :data="tableData" border v-loading="loading">
      <el-table-column label="序号">
        <template slot-scope="scope">
          <span>{{ getIndex(scope.$index) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="权限组"> </el-table-column>
      <el-table-column prop="nameLogogram" label="简称"> </el-table-column>
      <el-table-column prop="userTotal" label="人员"> </el-table-column>
      <el-table-column prop="createTime" label="创建时间">
        <template slot-scope="scope">
          {{ dateFormat('yyyy-MM-dd hh:mm', scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="启用/禁用">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="0"
            @click.native="onChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作"
        ><template slot-scope="scope">
          <el-button
            type="text"
            @click="onEdit(scope.row)"
            v-permission="'system_roles_update'"
            >编辑</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination-item
      :page="page"
      @current-change="handleCurrentChange"
      @sizes-change="handleSizesChange"
      style="text-align:right"
    ></pagination-item>
  </div>
</template>
<script>
import eventBus from '@/utils/eventBus'
import MixinPagination from '@/mixins/Pagination/index'
import { dateFormat } from '@/utils'
import { getRole, enableRole } from '@/api/system'
export default {
  data() {
    return {
      tableData: [],
      loading: false
    }
  },
  created() {
    this.apiGetRole()
    eventBus.$on('reload-role', () => {
      this.apiGetRole()
    })
    // 通过hook调起当前组件的生命周期函数
    this.$once('hook:beforeDestroy', () => {
      eventBus.$off('reload-role')
    })
  },
  mixins: [MixinPagination],
  methods: {
    dateFormat,
    getIndex(val) {
      return (this.page.pageNo - 1) * this.page.pageSize + val + 1
    },
    // 分页回调
    pageCallBack() {
      this.apiGetRole()
    },
    onChange(row) {
      row.status = row.status === 0 ? 1 : 0
      let title = ''
      if (row.status === 1) {
        title = '禁用'
      } else {
        title = '启用'
      }
      this.$confirm('是否确定' + title + '该权限组？', '确认提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        lockScroll: false
      })
        .then(() => {
          this.apiEnableRole(row.id, title)
        })
        .catch(() => {
          this.loading = false
        })
    },
    onEdit(row) {
      this.$emit('edit', row)
    },
    apiGetRole() {
      this.loading = true
      let params = {
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize
      }
      getRole(params)
        .then(res => {
          this.loading = false
          this.tableData = res.data.list
          this.page.pageTotal = res.data.total
        })
        .catch(() => {})
    },
    apiEnableRole(id, title) {
      enableRole({ id })
        .then(res => {
          this.pageCallBack()
          this.$message.closeAll()
          this.$message.success(title + '成功')
        })
        .catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped></style>
