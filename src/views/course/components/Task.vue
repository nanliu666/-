<template>
  <div v-if="infoData" class="task">
    <div class="task_content">
      <div class="task_content_title">
        作业内容:
      </div>
      <div class="task_content_r">
        <div class="task_content_r_title">{{ infoData.fileInfoList[0].fileName }}</div>
        <el-button @click="downLoadImg(infoData.fileInfoList[0])"> 立即下载 </el-button>
      </div>
    </div>

    <div class="task_content">
      <div class="task_content_title">
        上传作业:
      </div>
      <div class="task_content_r">
        <div class="task_content_r_title">
          {{ uploadData[0] ? uploadData[uploadData.length - 1].localName : '未提交' }}
        </div>
        <common-upload v-model="uploadData" :before-upload="beforeUpload" :multiple="false">
          <el-button>
            立即上传
          </el-button>
        </common-upload>

        <div>
          {{ uploadData[0] ? uploadData[uploadData.length - 1].localName : '' }}
        </div>
      </div>
    </div>

    <div class="task_content">
      <div class="task_content_title">
        教师评改:
      </div>
      <div v-if="infoData.fileInfoList.length > 2" class="task_content_r">
        <div class="task_content_r_title">{{ infoData.fileInfoList[2].fileName }}</div>
        <el-button @click="downLoadImg(infoData.fileInfoList[2])"> 立即下载 </el-button>
      </div>
      <div v-else class="task_content_r">
        <div>未提交</div>
      </div>
    </div>
  </div>
</template>

<script>
import { taskInfo } from '@/api/course'
import { downLoadFile } from '@/util/util'
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['userId'])
  },
  components: {
    CommonUpload: () => import('@/components/common-upload/CommonUpload')
  },
  props: ['taskData'],
  data() {
    return {
      uploadData: [],
      infoData: null
    }
  },
  watch: {
    taskData() {
      this.getInfo()
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    async getInfo() {
      let params = { userId: this.userId, courseId: this.$route.query.courseId }
      let res = await taskInfo(params)
      res.map((item) => {
        if (item.contentId == this.taskData.contentId) {
          this.infoData = item
          console.log(this.infoData)
          if (this.infoData.length > 1) {
            this.uploadData.push(this.infoData.fileInfoList[1])
          }
        }
      })
    },

    downLoadImg(data) {
      // 下载
      downLoadFile(data)
    },
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
