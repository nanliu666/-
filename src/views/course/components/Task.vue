<template>
  <div>
    <div v-if="infoData" class="task">
      <div class="task_content">
        <div class="task_content_btn">
          <div>作业内容</div>
          <div class="task_content_btn_title">{{ infoData[0].fileName }}</div>
        </div>
        <el-button class="task_content_title" type="primary" @click="downLoadImg(infoData[0])">立即下载</el-button>
      </div>

      <div class="task_content">
        <div class="task_content_btn">
          <div>上传作业</div>
          <div class="task_content_btn_title">
            {{ uploadData[0] ? uploadData[uploadData.length - 1].fileName : '未上传' }}
          </div>
        </div>
        <common-upload
          v-model="uploadData"
          :before-upload="beforeUpload"
          :multiple="false"
          @input="onSuccess"
        >
          <el-button class="task_content_title" type="primary">{{
            uploadData[0] ? '重新上传' : '上传作业'
          }}</el-button>
          <div class="tins">（不限格式，大小20MB以内）</div>
        </common-upload>
      </div>

      <div class="task_content">
        <div class="task_content_btn">
          <div>教师评改</div>
          <div class="task_content_btn_title">
            {{ infoData[2] ? infoData[2].fileName : '未上传' }}
          </div>
        </div>
        <el-button
          class="task_content_title"
          type="primary"
          :disabled="!infoData[2]"
          @click="downLoadImg(infoData[2])"
        >立即下载</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { taskInfo, upSave } from '@/api/course'
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
      infoData: null,
      jobId: ''
    }
  },
  watch: {
    taskData() {
      this.getInfo()
    }
    // uploadData(newVal) {

    // }
  },
  created() {
    this.getInfo()
  },
  methods: {
    onSuccess() {
      if (!this.uploadData) return
      //     console.log(newValue);
      //   console.log(this.uploadData)

      //   return
      let params = {
        id: '', //上一个上传的文件id，没有上一个就为空
        userId: this.userId, // 默认值    学员ID
        courseId: this.$route.query.courseId, // 默认值    课程id
        jobId: this.jobId, //作业id
        fileCategory: 'user', //文件归类：用户提交的附件user、还是讲师评改的附件teacher
        fileSize: this.uploadData[this.uploadData.length - 1].fileSize, // 默认值    文件大小
        fileName:
          this.uploadData[this.uploadData.length - 1].localName ||
          this.uploadData[this.uploadData.length - 1].fileName, // 默认值    文件名称，包括扩展名
        filePath:
          this.uploadData[this.uploadData.length - 1].filePath ||
          this.uploadData[this.uploadData.length - 1].fileUrl ||
          this.uploadData[this.uploadData.length - 1].url, // 默认值    文件所在路径
        creatorId: this.$route.query.courseId, // 默认值    创建人id
        createTime: this.uploadData[this.uploadData.length - 1].updateTime, // 默认值    创建时间
        updateId: this.$route.query.courseId, // 默认值    最后修改人
        updateTime: this.uploadData[this.uploadData.length - 1].updateTime, // 默认值    最后修改时间
        trainId: this.$route.query.trainId || ''
      }
      if (this.infoData.length > 1) {
        params.id = this.infoData[1].userFileId
      }
      upSave(params).then(() => {
        this.getInfo()
        // 上传完作业更新学习进度
        this.$emit('uploadTask', this.taskData.contentId)
      })
    },
    async getInfo() {
      let params = { userId: this.userId, courseId: this.$route.query.courseId }
      let res = await taskInfo(params)
      res.map((item) => {
        if (item.contentId == this.taskData.contentId) {
          this.infoData = item.fileInfoList
          this.jobId = item.id
          if (this.infoData.length > 1) {
            this.uploadData = [this.infoData[1]]
          } else {
            this.uploadData = []
          }
        }
      })
    },

    downLoadImg(data) {
      // 下载
      downLoadFile(data)
    },
    // 是否空文件
    isFileSize(file) {
      if (file.size === 0) {
        this.$message({
          message: '请不要上传空文件哦！',
          type: 'warning'
        })
        return true
      }
    },
    beforeUpload(file) {
      if (this.isFileSize(file)) return false
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
  display: flex;
  justify-content: space-between;
  padding: 20vh;
  &_content {
    &_btn {
      width: 200px;
      height: 200px;
      background: #fff;
      border-radius: 4px;
      border: 1px dashed #ccc;
      text-align: center;
      font-family: PingFangSC-Semibold;
      font-size: 24px;
      color: rgba(0, 11, 21, 0.85);
      letter-spacing: 0;
      position: relative;
      padding: 68px 10px 0;
      &_title {
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: rgba(0, 11, 21, 0.65);
        padding-top: 5px;
        text-align: center;
        word-wrap: break-word;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
      &_Tips {
        position: absolute;
        top: 100px;
        opacity: 0.85;
        font-family: PingFangSC-Regular;
        font-size: 10px;
        color: rgba(0, 11, 21, 0.45);
        letter-spacing: -0.5px;
        text-align: center;
        line-height: 18px;
        text-align: center;
        width: 160px;
      }
    }

    &_title {
      margin: 24px 45px 4px;
      display: -webkit-box;
    }
  }
  .tins {
    opacity: 0.85;
    font-family: PingFangSC-Regular;
    font-size: 10px;
    color: rgba(0, 11, 21, 0.45);
    letter-spacing: -0.5px;
    text-align: center;
  }
}
</style>
