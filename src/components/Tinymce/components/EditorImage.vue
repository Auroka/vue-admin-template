<!--
 * @Description: 
 * @Author: lxd
 * @Date: 2020-08-24 15:12:19
 * @LastEditTime: 2020-08-24 18:01:19
-->
<template>
  <div class="upload-container">
    <div class="section-editor-image-upload">
      <el-upload
        multiple
        :show-file-list="false"
        :action="domain"
        :on-remove="handleRemove"
        :before-upload="beforeUpload"
        :http-request="requestUpload"
      >
        <el-button icon="el-icon-upload" size="mini" type="primary">
          upload
        </el-button>
      </el-upload>
    </div>
  </div>
</template>

<script>
import * as qiniu from 'qiniu-js'
import { upload } from '@/utils/upload'

export default {
  name: 'EditorSlideUpload',
  props: {
    limitSize: { type: Number, default: 2 }
  },
  data() {
    return {
      dialogVisible: false,
      listObj: {},
      fileList: [],
      domain: 'https://upload-z2.qiniup.com' // 七牛云的上传地址（华南区）
    }
  },
  methods: {
    handleRemove(file, fileList, index) {
      this.imageUrl = ''
    },
    beforeUpload(file, fileList) {
      const isPNG = file.type === 'image/png'
      const isJPEG = file.type === 'image/jpeg'
      const isJPG = file.type === 'image/jpg'
      const isLimit = file.size < this.limitSize * 1024 * 1024
      if (!isPNG && !isJPEG && !isJPG) {
        this.$message.error('图片只能是 jpg、png、jpeg 格式!')
        reject()
        return false
      }
      if (!isLimit) {
        this.$message.error(`图片大小不能超过${this.limitSize}M`)
        reject()
        return false
      }
    },

    async requestUpload(item) {
      let origin = 'editor_upload'
      const file = item.file
      this.$emit('loading', true)
      upload(origin, item, file)
        .then(res => {
          this.$emit('loading', false)
          this.$emit('successCBK', res.fileUrl)
        })
        .catch(error => {
          this.$emit('loading', false)
        })
    }
  }
}
</script>

<style lang="scss">
.editor-slide-upload {
  margin-bottom: 20px;
  .el-upload--picture-card {
    width: 100%;
  }
}
</style>
