<template>
  <div>
    <el-upload
      class="upload-demo"
      action=""
      :http-request="uploadTest"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      multiple
      :limit="3"
      :on-exceed="handleExceed"
      :file-list="fileList"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
    <button @click="backFn">取消请求</button>
    <!-- <div id="drag-drop-area"></div>
    <script src="https://releases.transloadit.com/uppy/v1.29.1/uppy.min.js"></script> -->
  </div>
</template>
<script>
import { uploadNew } from '@/api/upload'
export default {
  data: function() {
    return {
      cancel: '',
      fileList: []
    }
  },
  methods: {
    async uploadTest(file) {      
      let formData = new FormData()
      formData.append('file', file.file)
      // formData.file=file
      let res = await uploadNew(formData, { onUploadProgress: this.onUploadProgress }, this.cancel)
      console.log(res, 'res111')
    },
    backFn(a, b, c) {
      if (this.cancel) {
        this.cancel()
      }
      console.log('abc22', a, b, c)
    },
    onUploadProgress(a, b, c) {
      console.log('abc', a, b, c)
    },
    handleRemove(file, fileList) {
      console.log('111', file, fileList)
    },
    handlePreview(file) {
      console.log('2222', file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length +
          fileList.length} 个文件`
      )
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    }
  }
}
</script>
