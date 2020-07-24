<!--
 * @Description: 资源管理-表格模块
 * @Author: lxd
 * @Date: 2020-07-24 11:29:04
 * @LastEditTime: 2020-07-24 13:08:52
-->
<template>
  <div class="system-role-table-wrap">
    <el-table
      v-loading="loading"
      :data="tableData"
      row-key="id"
      :tree-props="{ children: 'childList' }"
      border
    >
      <el-table-column prop="name" label="资源名" />
      <el-table-column prop="path" label="路径" />
      <el-table-column prop="permissions" label="权限数组">
        <template slot-scope="scope">{{
          scope.row.permissions.join(',')
        }}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="onEdit(scope.row, 'add')"
            v-permission="'system_resource_add'"
            >添加
          </el-button>
          <el-button
            type="text"
            @click="onEdit(scope.row, 'edit')"
            v-permission="'system_resource_update'"
            >编辑
          </el-button>
          <el-button
            type="text"
            @click="onDelete(scope.row.id)"
            v-permission="'system_resource_delete'"
            >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import eventBus from '@/utils/eventBus'
import { getResource, deleteResource } from '@/api/system'
export default {
  data() {
    return {
      tableData: [],
      loading: false
    }
  },
  created() {
    this.apiGetTableList()
    eventBus.$on('reload-resource', () => {
      this.apiGetTableList()
    })
  },
  beforeDestroy() {
    eventBus.$off('reload-resource')
  },
  methods: {
    onEdit(row, type) {
      this.$emit('edit', row, type)
    },
    onDelete(id) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteResource({ id })
            .then(res => {
              this.$message.success('删除成功')
              this.apiGetTableList()
            })
            .catch(() => {})
          return
        })
        .catch(() => {})
    },
    apiGetTableList() {
      this.loading = true
      getResource()
        .then(res => {
          this.loading = false
          this.tableData = res.data
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>
<style lang="scss" scoped></style>
