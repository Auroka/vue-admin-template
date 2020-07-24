<!--
 * @Description: 权限组
 * @Author: lxd
 * @Date: 2020-07-23 16:15:27
 * @LastEditTime: 2020-07-24 11:16:25
-->
<template>
  <div class="system-role-wrap boxshadow">
    <div class="top-module">
      <h4>
        数据列表
        <el-button
          class="add"
          type="primary"
          size="medium"
          @click="onAdd"
          v-permission="'system_roles_add'"
          >添加</el-button
        >
      </h4>
    </div>
    <table-item @edit="onEdit"></table-item>
    <edit-item
      :visible="visible"
      :role="role"
      @close="visible = false"
    ></edit-item>
  </div>
</template>
<script>
import TableItem from './components/TableItem'
import EditItem from './components/EditItem'
export default {
  data() {
    return {
      visible: false,
      role: { id: 0, name: '', nameLogogram: '' }
    }
  },
  components: {
    TableItem,
    EditItem
  },
  methods: {
    onAdd() {
      this.role.id = ''
      this.role.name = ''
      this.role.nameLogogram = ''
      this.visible = true
    },
    onEdit(row) {
      this.role.id = row.id
      this.role.name = row.name
      this.role.nameLogogram = row.nameLogogram
      this.visible = true
    }
  }
}
</script>
<style lang="scss" scoped>
.system-role-wrap {
  font-size: 14px;
  padding: 15px;
  .top-module {
    h4 {
      margin-top: 0;
      font-size: 14px;
      line-height: 36px;
      .add {
        float: right;
        margin-bottom: 20px;
      }
    }
  }
}
</style>
