<!--
 * @Description: 
 * @Author: lxd
 * @Date: 2020-08-24 15:12:51
 * @LastEditTime: 2020-08-24 15:52:27
-->
<template>
  <div class="components-container">
    <div>
      <tinymce v-model="content" :height="300" />
    </div>
    <div class="editor-content" v-html="content" />
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'

export default {
  name: 'TinymceDemo',
  components: { Tinymce },
  data() {
    return {
      content: ''
    }
  }
}
</script>

<style scoped>
.editor-content {
  margin-top: 20px;
}
</style>
