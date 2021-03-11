<template>
  <div class="task">
    {{ taskData }}

    <div class="task_content">
      <div class="task_content_title">
        作业内容:
      </div>
      <div class="task_content_r">
        <div class="task_content_r_title">{{ taskData.localName }}</div>
        <el-button> 立即下载 </el-button>
      </div>
    </div>

    <div class="task_content">
      <div class="task_content_title">
        上传作业:
      </div>
      <div class="task_content_r">
        <div class="task_content_r_title">
          {{ uploadData[0] ? uploadData[uploadData.length - 1].localName : '点击按钮上传' }}
        </div>
        <common-upload v-model="uploadData" :before-upload="beforeUpload" :multiple="false">
          <el-button>
            立即上传
          </el-button>
        </common-upload>
      </div>
    </div>

    <div class="task_content">
      <div class="task_content_title">
        教师评改:
      </div>
      <div class="task_content_r">
        <div class="task_content_r_title">{{ taskData.localName }}</div>
        <el-button> 立即下载 </el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    CommonUpload: () => import('@/components/common-upload/CommonUpload')
  },
  props: ['taskData'],
  data() {
    return {
      uploadData: []
    }
  },
  activated() {
    console.log(this.taskData)
  },
  created() {
    console.log(this.taskData)
  },
  methods: {
    beforeUpload(file) {
      const isLt20M = file.size / 1024 / 1024 < 20
      if (!isLt20M) {
        this.$message.error('上传文件大小不能超过 20MB!')
        return false
      }
      return true
    }
  }
}
</script>

<style lang="scss" scoped>
.task {
  &_content {
    display: flex;
    margin-bottom: 80px;
    margin-top: 30px;
    &_title {
      margin-right: 100px;
      font-weight: bold;
      font-size: 24px;
      line-height: 60px;
    }
    &_r {
      color: #666;
      font-weight: bold;
      font-size: 18px;
      &_title {
        margin-bottom: 30px;
      }
    }
  }
}
</style>
