<!--
 * @Description: 
 * @Author: lxd
 * @Date: 2020-08-24 15:12:19
 * @LastEditTime: 2020-08-28 11:38:02
-->
<template>
  <div class="upload-container">
    <div class="section-editor-image-upload">
      <el-upload
        multiple
        :show-file-list="false"
        :action="domain"
        :before-upload="beforeUpload"
        :http-request="requestUpload"
      >
        <el-button icon="el-icon-upload" size="mini" type="primary">
          图片上传
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
      imageCount: 0,
      imageList: [],
      domain: 'https://upload-z2.qiniup.com' // 七牛云的上传地址（华南区）
    }
  },
  methods: {
    beforeUpload(file, fileList) {
      const isPNG = file.type === 'image/png'
      const isJPEG = file.type === 'image/jpeg'
      const isJPG = file.type === 'image/jpg'
      const isLimit = file.size < this.limitSize * 1024 * 1024
      if (!isPNG && !isJPEG && !isJPG) {
        this.$message.error('图片只能是 jpg、png、jpeg 格式!')
        return false
      }
      if (!isLimit) {
        this.$message.error(`图片大小不能超过${this.limitSize}M`)
        return false
      }
      file.index = this.imageCount
      this.imageCount++
    },

    async requestUpload(item) {
      let origin = 'editor_upload'
      const file = item.file
      this.$emit('loading', true)
      upload(origin, item, file)
        .then(f => {
          this.checkUpload('success', f.index, f.fileUrl)
        })
        .catch(f => {
          this.checkUpload('error', f.index, f.fileUrl)
        })
    },
    // 校验上传图片的情况
    checkUpload(type, index, url) {
      this.imageList[index] = { url, type }
      if (this.imageList.length === this.imageCount) {
        this.$emit('loading', false)
        this.$emit('successCBK', this.imageList)
        this.imageList = []
        this.imageCount = 0
      }
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
