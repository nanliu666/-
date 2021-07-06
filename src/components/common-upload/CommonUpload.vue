<!--内部上传公共组件-->
<template>
  <div>
    <el-upload
      ref="upload"
      v-loading="uploading"
      class="upload"
      action=""
      :disabled="disabled"
      :limit="limit"
      :accept="accept"
      :multiple="multiple"
      :show-file-list="showFileList"
      :http-request="isQiNiu?httpRequest:uploadRequest"
      :before-upload="beforeUpload"
      :file-list="value"
      :on-exceed="masterFileMax"
      :on-remove="onRemove"
      :list-type="listType"
      v-bind="$attrs"
    >    
      <slot />
      <slot slot="tip" name="tip" />
    </el-upload>
  </div>
</template>
<script>
import { uploadNew } from '@/api/upload'
import {isQiNiu} from '@/config/env'
import { uploadQiniu } from '@/util/upload-qiniu'
export default {
  name: 'InternalUpload',
  props: {
    checkUpload: {
      type: Function,
      default: () => false
    },
    onUploadComplete: {
      type: Function,
      default: () => true
    },
    onUploadProgress: {
      type: Function,
      default: () => true
    },
    onUploadError: {
      type: Function,
      default: () => true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    needHandler: {
      type: Boolean,
      default: false
    },
    // 上传前校验
    beforeUpload: {
      type: Function,
      default: () => true
    },
    multiple: {
      type: Boolean,
      default: false
    },
    accept: {
      type: String,
      default: ''
    },
    limit: {
      type: Number,
      default: null
    },
    value: {
      type: Array,
      default: () => []
    },
    showFileList: {
      type: Boolean,
      default: false
    },
    onRemove: {
      type: Function,
      default: () => true
    },
    listType: {
      type: String,
      default: 'picture'
    }
  },
  data() {
    return {      
      uploading: false,
      isQiNiu
    }
  },
  methods: {
    //上传文件数量限制回调
    masterFileMax(res) {
      this.$emit('on-masterFileMax', res)
    },
    // 内部上传请求
    async uploadRequest(file) {
      const fileData = {
        uid: file.file.uid,
        name: file.file.name,
        percent:0,
        subscription:{
          unsubscribe:Object // 取消上传
        },
        observable:true
      }
      this.$emit('on-pending', fileData)
      const onUploadProgressFn=(file)=>{
        // console.log('file,b,c,d',file,b,c,d)
        fileData.percent = parseInt(file.loaded/file.total*100)
        fileData.status = file.type
        this.onUploadProgress(fileData)
      }
      let formData = new FormData()
      formData.append('file', file.file)
      // formData.file=file
      let res = await uploadNew(formData, { onUploadProgress: onUploadProgressFn },fileData)     
      let newFile = {
        fileUrl: res,
        uid: file.file.uid,
        url: res, // 新增url字段，为与移动端上传回显一致
        fileName:file.file.name,
        fileSize: (file.file.size / 1024).toFixed(1), //文件大小，保留小数点后一位，KB单位   file.file.size,
        localName: file.file.name
      }
      let newValue = [...this.value, newFile]

      this.$emit('input', newValue)
      // 专门给表格设计器的上传附件组件使用的，组件name为FileUpload
      this.$emit('getValue', newValue)
      // that.$emit('on-complete', fileData)

      this.$emit('getFile', newFile)
      fileData.status = 'complete'
      if (this.needHandler) {
        this.onUploadComplete(file, res)
      }
      // .then((res)=>{
      //   console.log('333',res)
      // }).catch((res)=>{
      //   console.log('444',res)
      // })      
    },  
    // 七牛上传请求  
    httpRequest(file) {
      const that = this
      that.uploading = true
      uploadQiniu(file.file, {
        // next({ total }) {
        //     that.uploadPercent = parseInt(total.percent)
        // },

        error(err) {
          that.uploading = false
          if (err.code === 614) {
            that.$message.error('上传失败，已存在相同文件')
          } else {
            that.$message.error('上传失败，请联系管理员')
            // eslint-disable-next-line
            console.error('upload err:', err)
          }
          if (that.needHandler) {
            that.onUploadError()
          }
        },
        // 格式化时间
        formatData() {
          let date = new Date()
          let year = date.getFullYear() //获取当前年份
          let mon = date.getMonth() + 1 //获取当前月份
          let da = date.getDate() //获取当前日
          let h = date.getHours() //获取小时
          let m = date.getMinutes() //获取分钟
          let s = date.getSeconds() //获取秒
          return year + '-' + mon + '-' + da + ' ' + h + ':' + m + ':' + s
        },
        complete({ url, fileName }) {
          that.uploading = false
          let newFile = {
            fileUrl: url,
            url: url, // 新增url字段，为与移动端上传回显一致
            fileName,
            localName: file.file.name,
            fileSize: (file.file.size / 1024).toFixed(1), //文件大小，保留小数点后一位，KB单位
            updateTime: this.formatData() //上传时间
          }
          let newValue = [...that.value, newFile]
          that.$emit('input', newValue)
          // 专门给表格设计器的上传附件组件使用的，组件name为FileUpload
          that.$emit('getValue', newValue)
          if (that.needHandler) {
            that.onUploadComplete(file, url)
          }
        }
      })
    }
  }
}
</script>
<style scoped></style>
