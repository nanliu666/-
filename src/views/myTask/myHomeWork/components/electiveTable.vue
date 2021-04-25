<template>
  <div v-loading="loading" class="trainingDetail">
    <el-card>
      <!-- 课程列表 -->
      <div v-for="(z, i) in tableData" :key="i" class="course_list">
        <div class="course_hearder">
          <el-row type="flex" justify="space-between">
            <el-tooltip :content="'作业来源: ' + z.jobName" placement="top">
              <div class="source">作业来源：{{ z.jobName }}</div>
            </el-tooltip>
            <!-- <div class="download">
              <i class="iconimage_icon_download iconfont" style="margin-right: 5px" />打包下载
            </div> -->
          </el-row>
        </div>
        <!-- 表格数据 -->
        <el-table :data="z.fileInfoList" :show-header="false">
          <el-table-column prop="fileName" show-overflow-tooltip>
            <template slot-scope="scope">
              <div class="tip">
                {{ taskType(scope.$index) }}<span class="courseware">{{ scope.row.fileName }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="fileSize">
            <template slot-scope="scope">
              {{ scope.row.fileSize ? scope.row.fileSize + 'k' : '--' }}
            </template>
          </el-table-column>
          <el-table-column prop="updateTime"> </el-table-column>
          <el-table-column width="120" align="right">
            <template slot-scope="scope">
              <common-upload
                v-model="uploadData"
                :disabled="scope.$index == 2 && z.fileInfoList[1].updateTime == '--'"
                need-handler
                :before-upload="onUploadStart"
                :on-upload-complete="(file, url) => onUploadComplete(scope, z.id, file, url)"
                :on-upload-error="() => onUploadError()"
              >
                <el-button
                  type="text"
                  size="medium"
                  :disabled="scope.$index == 2 && z.fileInfoList[1].updateTime == '--'"
                >
                  <span v-if="scope.$index == 1">
                    {{ scope.row.updateTime == '--' ? '上传作业' : '修改作业' }}
                  </span>
                  <span v-if="scope.$index == 2">{{ scope.row.updateTime == '--' ? '上传评改' : '修改评改' }}
                  </span>
                </el-button>
              </common-upload>
              <el-button
                type="text"
                size="medium"
                :disabled="scope.row.updateTime == '--'"
                @click="downloadHomework(scope.row)"
              >下载</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import { listCourseJob, saveCourseLinkedStudentOrTeacher } from '@/api/myTask'
import { mapGetters } from 'vuex'
import { downLoadFile } from '@/util/util'
export default {
  name: 'ElectiveTable',
  components: {
    commonUpload: () => import('@/components/common-upload/CommonUpload')
  },
  data() {
    return {
      tableData: [],
      loading: false,
      uploadData: []
    }
  },
  computed: {
    ...mapGetters(['userId'])
  },
  mounted() {
    this.queryStudyPlan()
  },
  methods: {
    taskType(i) {
      let taskList = ['作业内容：', '学员作业：', '教师评改：']
      // return taskList.filter((item, index) => i == index)
      return taskList[i]
    },
    //   下载
    async downloadHomework(row) {
      this.loading = true
      await downLoadFile(row)
      this.loading = false
    },
    // 查询课程列表
    async queryStudyPlan() {
      this.loading = true
      await listCourseJob({ courseId: this.$route.query.id, stuId: this.userId })
        .then((res) => {
          let pushData = {
            fileName: '未提交',
            filePath: '',
            fileSize: '',
            id: '',
            source: '',
            updateTime: '--',
            userFileId: ''
          }
          this.tableData = res
          this.tableData.forEach((item, index) => {
            if (item.fileInfoList.length == 1) {
              this.tableData[index].fileInfoList.push(pushData)
              this.tableData[index].fileInfoList.push(pushData)
              return
            } else if (item.fileInfoList.length == 2) {
              this.tableData[index].fileInfoList.push(pushData)
            }
          })
        })
        .catch((err) => {
          this.$message.error(err)
        })
        .finally(() => {
          this.loading = false
        })
    },
    onUploadStart() {
      this.$message.info('正在上传')
      this.loading = true
      this.$forceUpdate()
      return true
    },
    onUploadError() {
      this.loading = false
      this.$message.error('上传失败，请重试')
      this.$forceUpdate()
    },
    async onUploadComplete(scope, id) {
      let params = {
        courseId: this.$route.query.id, //课程id
        fileCategory: scope.$index == 1 ? 'user' : 'teacher', //文件归类：用户提交的附件user、还是讲师评改的附件teacher
        fileName: this.uploadData[this.uploadData.length - 1].localName, //文件名称，包括扩展名
        filePath: this.uploadData[this.uploadData.length - 1].fileUrl, //文件所在路径
        fileSize: Number(this.uploadData[this.uploadData.length - 1].fileSize).toFixed(1), //文件大小   //大小单位KB
        id: scope.row.id || '', //对应FileInfoList里的Id，有则回传，没有则传空
        jobId: id, //对应课程作业Id
        userId: this.userId //学员id
      }
      const message = scope.row.fileName ? '修改成功' : '上传成功'
      await saveCourseLinkedStudentOrTeacher(params)
        .then(() => {
          this.$message.success(message)
          this.queryStudyPlan()
        })
        .finally(() => {
          this.loading = false
          this.$forceUpdate()
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.trainingDetail {
  margin-top: 20px;
  .course {
    &_hearder {
      width: 100%;
      height: 50px;
      padding: 0 25px;
      background: #fafafa;
      border-top: 1px solid #ebeef5;
      border-bottom: 1px solid #ebeef5;
      line-height: 50px;
      .source {
        font-size: 14px;
        color: rgba(0, 11, 21, 0.45);
      }
      .download {
        cursor: pointer;
      }
    }
  }
  .tip {
    font-size: 14px;
    color: rgba(0, 11, 21, 0.45);
  }
  .courseware {
    color: rgba(0, 11, 21, 0.85);
  }
}
</style>
