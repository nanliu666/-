<template>
  <div>
    <InternalUpload
      ref="uploadRef"
      v-model="uploadList"
      class="upload-more"
      multiple
      need-handler
      :check-upload="checkUpload"
      :on-upload-complete="onUploadComplete"
      :on-upload-progress="onAllUploadProgress"
      :before-upload="beforeUpload"
      :show-file-list="true"
      :on-remove="onRemove"
      :limit="20"
      @on-pending="onUploadPending"
      @on-masterFileMax="masterFileMax"
      @input="upLoadSuc"
    >
      <el-button size="small" type="primary">
        选择上传内容
      </el-button>
      <div slot="tip" style="color: #ff0000; font-size: 12px">
        说明：*******
      </div>
    </InternalUpload>
    <div v-for="item in contentsList" :key="item.uid">
      <span>{{ item.name }}</span>
      <el-progress :percentage="item.percent"></el-progress>  
      <button @click="uploadCancelFn(item)">删除</button>    
    </div>
  </div>
</template>
<script>
import InternalUpload from '@/components/common-upload/InternalUpload.vue'
export default {
  components: {
    InternalUpload
  },
  data: function() {
    return {
      uploadList: [],
      contentsList: [],
      progress: 0
    }
  },
  methods:{
    uploadCancelFn(item){      
      item.subscription.unsubscribe()  
    },
    beforeUpload(){},
    checkUpload(){},    
    onExceed(){},
    onRemove(){},
    onUploadPending(fileData){     
      this.contentsList.splice(this.contentsList.length, 1, fileData)
    },
    upLoadSuc(flie) {
      console.log('upLoadSuc', flie)
    },
    masterFileMax(){},
    onAllUploadProgress(file){
      console.log('onAllUploadProgress',file)
      
    },
    onUploadComplete(file, url) {
      console.log('onUploadComplete2222',file, url)
   
    },
  }
}
</script>
<style scoped></style>
