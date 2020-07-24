<!--
 * @Description: 账号管理-编辑模块
 * @Author: lxd
 * @Date: 2020-07-24 09:21:25
 * @LastEditTime: 2020-07-24 11:20:56
-->
<template>
  <el-dialog
    class="account-dialog"
    :title="accountForm.id ? '编辑账号' : '添加账号'"
    :visible.sync="dialogVisible"
    width="500px"
    @close="closeDialog"
  >
    <el-form
      ref="accountForm"
      v-loading="loading"
      :model="accountForm"
      :rules="accountRules"
    >
      <el-form-item prop="account" label="账号"
        ><el-input
          :disabled="!!accountForm.id"
          v-model="accountForm.account"
          placeholder="请填写登录账号"
      /></el-form-item>
      <el-form-item prop="name" label="操作员名称">
        <el-input v-model="accountForm.name" placeholder="请填写操作员"
      /></el-form-item>
      <el-form-item prop="roleId" label="权限组">
        <el-select
          v-model="accountForm.roleId"
          filterable
          placeholder="请选择权限组"
          style="display:inline-block;width:100%"
        >
          <el-option
            v-for="item in roles"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <span class="tip fl">账号默认密码为:yrmh123</span>
      <el-button size="medium" @click="closeDialog">取消</el-button>
      <el-button size="medium" type="primary" @click="onSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import eventBus from '@/utils/eventBus'
import { getRoleList, addAccount, updateAccount } from '@/api/system'
export default {
  data() {
    return {
      loading: false,
      dialogVisible: false,
      roles: [],
      accountForm: {
        id: '',
        account: '', //账号
        name: '', // 操作人的名字
        roleId: ''
      },
      accountRules: {
        account: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
        name: [
          { required: true, message: '操作员名称不能为空', trigger: 'blur' }
        ],
        roleId: [{ required: true, message: '权限组不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.apiGetRoleList()
  },
  props: {
    visible: { type: Boolean, default: false },
    user: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val
      if (!val) {
        this.$refs['accountForm'].resetFields()
        this.accountForm.id = ''
        this.accountForm.account = ''
        this.accountForm.name = ''
        this.accountForm.roleId = ''
      }
    },
    user(val) {
      console.log('user:', val)
      this.accountForm.id = val.id || ''
      this.accountForm.account = val.account || ''
      this.accountForm.name = val.name || ''
      this.accountForm.roleId = val.roleId || ''
    }
  },
  methods: {
    closeDialog() {
      this.$emit('close')
    },
    onSubmit() {
      this.$refs['accountForm'].validate(valid => {
        if (valid) {
          if (this.accountForm.id) {
            this.apiUpdateAccount()
          } else {
            this.apiAddAccount()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    // 获取权限组
    apiGetRoleList() {
      getRoleList()
        .then(res => {
          this.roles = res.data
        })
        .catch(() => {})
    },
    // 添加账号
    apiAddAccount() {
      this.loading = true
      const params = {
        name: this.accountForm.name,
        account: this.accountForm.account,
        roleId: this.accountForm.roleId
      }
      addAccount(params)
        .then(res => {
          this.loading = false
          this.closeDialog()
          eventBus.$emit('reload-account')
          this.$message.success('账号添加成功')
        })
        .catch(error => {
          this.loading = false
        })
    },
    // 更新账号
    apiUpdateAccount() {
      this.loading = true
      const params = {
        id: this.accountForm.id,
        name: this.accountForm.name,
        roleId: this.accountForm.roleId
      }
      updateAccount(params)
        .then(res => {
          this.loading = false
          this.closeDialog()
          eventBus.$emit('reload-account')
          this.$message.success('账号更新成功')
        })
        .catch(error => {
          this.loading = false
        })
    }
  }
}
</script>
<style lang="scss">
.system-role-edit-dialog {
  .el-dialog__body {
    .el-form-item__content {
      .el-tree {
        max-height: 350px;
        overflow-y: scroll;
        border: 1px #ebeff8 dashed;
      }
    }
  }
}
</style>
