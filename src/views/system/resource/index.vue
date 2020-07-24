<!--
 * @Description: 资源管理
 * @Author: lxd
 * @Date: 2020-07-23 16:50:39
 * @LastEditTime: 2020-07-24 13:23:10
-->
<template>
  <div class="system-resource-wrap boxshadow">
    <div class="top-module">
      <h4>
        数据列表
        <el-button
          class="fr add"
          type="primary"
          @click="onAdd"
          size="medium"
          v-permission="'system_resource_add'"
          >添加资源</el-button
        >
      </h4>
    </div>
    <table-item @edit="onEdit"></table-item>
    <edit-item
      :visible="visible"
      :cur-type="curType"
      :resource-form="resourceForm"
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
      curType: 'add',
      visible: false,
      resourceForm: {}
    }
  },
  components: {
    TableItem,
    EditItem
  },
  methods: {
    onAdd() {
      this.curType = 'add'
      this.resourceForm = {}
      this.visible = true
    },
    onEdit(row, type) {
      const item = JSON.parse(JSON.stringify(row))
      this.curType = type
      if (type === 'add') {
        if (item.pid === 0) {
          this.resourceForm.type = 1
        } else {
          this.resourceForm.type = 2
        }
        this.resourceForm.pid = item.id
        this.resourceForm.id = ''
        this.resourceForm.name = ''
        this.resourceForm.path = ''
        this.resourceForm.permissions = ''
      } else {
        item.permissions = item.permissions.join(',')
        this.resourceForm = item
      }
      this.visible = true
    }
  }
}
</script>
<style lang="scss" scoped>
.system-resource-wrap {
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
