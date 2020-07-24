<!--
 * @Description: 资源管理-编辑模块
 * @Author: lxd
 * @Date: 2020-07-24 11:28:55
 * @LastEditTime: 2020-07-24 13:10:09
-->
<template>
  <el-dialog
    title="资源配置"
    :visible.sync="dialogVisible"
    v-loading="loading"
    @close="closeDialog"
  >
    <el-form ref="resourceForm" :model="resourceForm" :rules="resourceRules">
      <el-form-item label="资源类型:" :label-width="formLabelWidth">
        <el-select v-model="resourceForm.type">
          <el-option key="1" label="菜单" :value="1" />
          <el-option key="2" label="按钮" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item prop="name" label="资源名:" :label-width="formLabelWidth">
        <el-input v-model="resourceForm.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="路径:" :label-width="formLabelWidth">
        <el-input v-model="resourceForm.path" autocomplete="off" />
      </el-form-item>
      <el-form-item label="权限数组:" :label-width="formLabelWidth">
        <el-input v-model="resourceForm.permissions" autocomplete="off" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="medium" @click="closeDialog">取消</el-button>
      <el-button size="medium" type="primary" @click="onSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import eventBus from '@/utils/eventBus'
import { addResource, updateResource } from '@/api/system'
export default {
  data() {
    return {
      loading: false,
      dialogVisible: false,
      formLabelWidth: '80px',
      roles: [],
      resourceRules: {
        name: [{ required: true, message: '资源名不能为空', trigger: 'blur' }]
      }
    }
  },
  props: {
    visible: { type: Boolean, default: false },
    curType: { type: String, default: 'add' },
    resourceForm: {
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
        this.$refs['resourceForm'].resetFields()
        this.resourceForm.name = ''
        this.resourceForm.path = ''
        this.resourceForm.permissions = ''
      }
    }
  },
  methods: {
    closeDialog() {
      this.$emit('close')
    },
    onSubmit() {
      this.$refs['resourceForm'].validate(valid => {
        if (valid) {
          this.loading = true
          if (this.curType === 'add') {
            this.apiAddResource()
          } else {
            this.apiUpdateResource()
          }
        } else {
          return false
        }
      })
    },
    apiAddResource() {
      addResource(this.resourceForm)
        .then(res => {
          this.loading = false
          eventBus.$emit('reload-resource')
          this.closeDialog()
          this.$message.success('添加成功')
        })
        .catch(() => {
          this.loading = false
        })
    },
    apiUpdateResource() {
      updateResource(this.resourceForm, true)
        .then(res => {
          this.loading = false
          eventBus.$emit('reload-resource')
          this.closeDialog()
          this.$message.success('更新成功')
        })
        .catch(() => {
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
