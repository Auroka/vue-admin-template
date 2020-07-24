<!--
 * @Description: 账号管理
 * @Author: lxd
 * @Date: 2020-07-23 16:50:19
 * @LastEditTime: 2020-07-24 10:20:04
-->
<template>
  <div class="system-account-wrap boxshadow">
    <div class="top-module">
      <h4>
        数据列表
        <el-button
          class="add"
          type="primary"
          size="medium"
          @click="onAdd"
          v-permission="'account_add'"
          >添加账号</el-button
        >
      </h4>
    </div>
    <table-item @edit="onEdit"></table-item>
    <edit-item
      :visible="visible"
      :user="user"
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
      user: {}
    }
  },
  components: {
    TableItem,
    EditItem
  },
  methods: {
    onAdd() {
      this.user = {}
      this.visible = true
    },
    onEdit(row) {
      console.log(row)
      this.user = row
      // this.user.id = row.id
      // this.user.name = row.name
      // this.user.account = row.account
      // this.user.roleId = row.roleId
      this.visible = true
    }
  }
}
</script>
<style lang="scss" scoped>
.system-account-wrap {
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
