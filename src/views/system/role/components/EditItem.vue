<!--
 * @Description: 权限组-编辑权限组模块
 * @Author: lxd
 * @Date: 2020-07-23 17:37:55
 * @LastEditTime: 2020-07-24 11:19:32
-->
<template>
  <el-dialog
    class="system-role-edit-dialog"
    width="550px"
    :title="role.id ? '编辑权限组' : '添加权限组'"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    @close="closeDialog"
  >
    <el-form
      ref="roleForm"
      :model="role"
      :rules="roleRules"
      v-loading="loading"
    >
      <el-form-item label="权限组:" prop="name" :label-width="formLabelWidth">
        <el-input
          v-model="role.name"
          autocomplete="off"
          placeholder="请输入权限组"
        />
      </el-form-item>
      <el-form-item
        label="简称:"
        prop="nameLogogram"
        :label-width="formLabelWidth"
      >
        <el-input
          v-model="role.nameLogogram"
          autocomplete="off"
          placeholder="请输入简称"
        />
      </el-form-item>
      <el-form-item label="菜单配置:" :label-width="formLabelWidth">
        <el-tree
          ref="tree"
          style="padding:10px 0px"
          :data="resourceDatas"
          show-checkbox
          node-key="id"
          :props="defaultProps"
        />
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
import {
  getResource,
  getResourceInRole,
  addResourceInRole,
  addRole,
  updateRole
} from '@/api/system'
export default {
  data() {
    return {
      checked: [],
      dialogVisible: false,
      loading: false,
      formLabelWidth: '80px',
      resourceDatas: [], // 资源树
      resourceIdArr: {},
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      roleRules: {
        name: [{ required: true, message: '权限组不能为空', trigger: 'blur' }],
        nameLogogram: [
          { required: true, message: '简称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.apiGetResource()
  },
  props: {
    visible: { type: Boolean, default: false },
    role: {
      type: Object,
      default: () => {
        return { id: '', name: '', nameLogogram: '' }
      }
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val
      if (val) {
        if (this.role.id) {
          this.apiGetResourceInRole()
        }
      }
      if (!val) {
        this.$refs['roleForm'].resetFields()
        this.checked = []
        this.$refs.tree.setCheckedKeys([])
        this.role.id = ''
        this.role.name = ''
        this.role.nameLogogram = ''
      }
    }
  },
  methods: {
    closeDialog() {
      this.$emit('close')
    },
    onSubmit() {
      this.$refs['roleForm'].validate(valid => {
        if (valid) {
          if (this.role.id) {
            this.apiUpdateRole()
          } else {
            this.apiAddRole()
          }
        } else {
          return false
        }
      })
    },
    // 记录当前权限组默认选中的资源
    dealDefaultResource(data) {
      data.forEach(item => {
        if (item.isSelection === true) {
          if (item.childList.length > 0) {
            this.dealDefaultResource(item.childList)
          } else {
            // 如果isSelection为true时表示拥有这个资源权限
            this.checked.push(item.id)
          }
        }
      })
    },
    //获取资源树的一些数据处理
    dealResourceData(data) {
      var newData = []
      data.forEach(item => {
        const obj = {
          id: item.id,
          name: item.name,
          children:
            item.childList.length > 0
              ? this.dealResourceData(item.childList)
              : []
        }
        newData.push(obj)

        if (item.pid) {
          this.resourceIdArr[item.id] = item.pid
        }
      })
      return newData
    },
    // 添加父节点
    addResourcePid(ids) {
      const newIds = ids
      ids.forEach(item => {
        const pid = this.resourceIdArr[item]
        if (pid) {
          this.checkResourceId(newIds, pid)
        }
      })
      return newIds
    },
    // 校验是否存在
    checkResourceId(newIds, pid) {
      if (!newIds.includes(pid)) {
        newIds.push(pid)
      }
      if (this.resourceIdArr[pid]) {
        this.checkResourceId(newIds, this.resourceIdArr[pid])
      }
    },
    // 获取资源树
    apiGetResource() {
      getResource()
        .then(res => {
          this.resourceDatas = this.dealResourceData(res.data)
        })
        .catch(() => {})
    },
    // 查询权限组拥有的资源
    apiGetResourceInRole() {
      this.loading = true
      getResourceInRole({ roleId: this.role.id })
        .then(res => {
          this.dealDefaultResource(res.data)
          this.loading = false
          this.$refs.tree.setCheckedKeys(this.checked)
        })
        .catch(error => {
          this.loading = false
        })
    },
    apiAddRole() {
      this.loading = true
      const params = {
        name: this.role.name,
        nameLogogram: this.role.nameLogogram
      }
      addRole(params)
        .then(res => {
          eventBus.$emit('reload-role')
          this.role.id = res.data.id
          this.apiAddResourceInRole('权限组添加成功')
        })
        .catch(error => {
          this.loading = false
        })
    },
    apiUpdateRole() {
      this.loading = true
      const params = {
        id: this.role.id,
        name: this.role.name,
        nameLogogram: this.role.nameLogogram
      }
      updateRole(params)
        .then(res => {
          eventBus.$emit('reload-role')
          this.apiAddResourceInRole('权限组更新成功')
        })
        .catch(error => {
          this.loading = false
        })
    },
    // 为权限组指派资源
    apiAddResourceInRole(msg) {
      const treeIds = this.addResourcePid(this.$refs.tree.getCheckedKeys())
      const params = {
        id: this.role.id,
        resourceIds: treeIds
      }
      addResourceInRole(params)
        .then(res => {
          this.loading = false
          this.$message.success(msg)
          this.closeDialog()
          // this.pageCallBack()
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
