<!--
 * @Description: 账号管理-表格模块
 * @Author: lxd
 * @Date: 2020-07-24 09:21:28
 * @LastEditTime: 2020-07-24 11:35:41
-->
<template>
  <div class="system-role-table-wrap">
    <el-table :data="tableData" border v-loading="loading">
      <el-table-column label="序号">
        <template slot-scope="scope">
          <span>{{ getIndex(scope.$index) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="account" label="账号" />
      <el-table-column prop="name" label="操作员名称" />
      <el-table-column prop="roleName" label="角色" />
      <el-table-column label="是否启用">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="0"
            @click.native="onChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280px">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="onEdit(scope.row)"
            v-permission="'account_update'"
          >
            编辑
          </el-button>
          <el-button type="text" @click="onResetPwd(scope.row)">
            密码重置
          </el-button>
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
import { getAccount, enableUser, resetPassword } from '@/api/system'
export default {
  data() {
    return {
      tableData: [],
      loading: false
    }
  },
  created() {
    this.apiGetTableList()
    eventBus.$on('reload-account', () => {
      this.apiGetTableList()
    })
  },
  beforeDestroy() {
    eventBus.$off('reload-account')
  },
  mixins: [MixinPagination],
  methods: {
    getIndex(val) {
      return (this.page.pageNo - 1) * this.page.pageSize + val + 1
    },
    // 分页回调
    pageCallBack() {
      this.apiGetTableList()
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
          this.apiEnableUser(row.id, title)
        })
        .catch(() => {})
    },
    onEdit(row) {
      this.$emit('edit', row)
    },
    onResetPwd(row) {
      this.$confirm(
        '确定重置该账户密码为初始密码？<br>重置密码后该用户需重新登录！',
        '确认提示',
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          const params = {
            userId: row.id
          }
          resetPassword(params)
            .then(res => {
              this.$message.closeAll()
              this.$message.success('密码重置成功')
            })
            .catch(() => {})
        })
        .catch(() => {})
    },
    apiGetTableList() {
      this.loading = true
      let params = {
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize
      }
      getAccount(params)
        .then(res => {
          this.loading = false
          this.tableData = res.data.list.map(item => {
            return {
              id: item.id,
              name: item.name,
              account: item.account,
              roleName: item.roles[0].name,
              roleId: item.roles[0].id,
              status: item.status
            }
          })

          this.page.pageTotal = res.data.total
        })
        .catch(() => {
          this.loading = false
        })
    },
    apiEnableUser(userId, title) {
      enableUser({ userId })
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
