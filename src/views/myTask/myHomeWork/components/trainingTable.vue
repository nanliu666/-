<template>
  <div v-loading="loading" class="trainingDetail">
    <el-card>
      <!-- 下拉框 -->
      <el-select
        v-model="courseName"
        style="width: 380px; margin-bottom: 25px"
        @change="courseChange"
      >
        <el-option
          v-for="item in seleteCourse"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <!-- 课程列表 -->
      <div v-for="(z, i) in tableData" :key="i" class="course_list">
        <div class="course_hearder">
          <el-row type="flex" justify="space-between">
            <el-tooltip :content="'作业来源: ' + z[0].name" placement="top">
              <div class="source">作业来源：{{ z[0].name }}</div>
            </el-tooltip>
            <!-- <div class="download">
              <i class="iconimage_icon_download iconfont" style="margin-right: 5px" />打包下载
            </div> -->
          </el-row>
        </div>
        <!-- 表格数据 -->
        <el-table :data="z" :show-header="false">
          <el-table-column prop="fileName" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <div class="tip">
                {{
                  scope.row.fileCategory == 'teacher'
                    ? '教师评改：'
                    : scope.row.fileCategory == 'user'
                      ? '学员作业：'
                      : '作业内容：'
                }}<span class="courseware">{{ scope.row.fileName || '未提交' }}</span>
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
                v-if="scope.row.fileCategory"
                v-model="uploadData"
                :disabled="scope.row.fileCategory === 'teacher' && !scope.row.fileName"
                need-handler
                :before-upload="onUploadStart"
                :on-upload-complete="(file, url) => onUploadComplete(scope, file, url)"
                :on-upload-error="() => onUploadError()"
              >
                <el-button
                  type="text"
                  size="medium"
                  :disabled="scope.row.fileCategory === 'teacher' && !scope.row.fileName"
                  @click="modifyHomework(scope.row)"
                >
                  {{
                    scope.row.fileName
                      ? scope.row.fileCategory === 'user'
                        ? '修改作业'
                        : '修改评改'
                      : scope.row.fileCategory === 'user'
                        ? '上传作业'
                        : '上传评改'
                  }}
                </el-button>
              </common-upload>
              <el-button
                type="text"
                size="medium"
                :disabled="!scope.row.fileName"
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
import { getOnlineCourse, queryCourseWork, saveCourseLinkedStudentOrTeacher } from '@/api/myTask'
import { mapGetters } from 'vuex'
import { downLoadFile } from '@/util/util'
export default {
  name: 'CompulsoryTable',
  components: {
    commonUpload: () => import('@/components/common-upload/CommonUpload')
  },
  data() {
    return {
      seleteCourse: [
        {
          value: 'all',
          label: '全部课程'
        }
      ],
      courseName: 'all',
      tableData: [],
      loading: false,
      uploadData: []
    }
  },
  computed: {
    ...mapGetters(['userId'])
  },
  mounted() {
    this.initCourse()
    this.queryStudyPlan()
  },
  methods: {
    //   修改作业
    modifyHomework() {},
    //   下载
    async downloadHomework(row) {
      this.loading = true
      await downLoadFile(row)
      this.loading = false
    },
    async initCourse() {
      await getOnlineCourse({ trainId: this.$route.query.id })
        .then((res) => {
          res.map((v) => {
            this.seleteCourse.push({ value: v.course, label: v.courseName })
          })
        })
        .catch((err) => {
          this.$message.error(err)
        })
    },
    // 查询课程列表
    async queryStudyPlan() {
      this.loading = true
      await queryCourseWork({ userId: this.userId, trainId: this.$route.query.id })
        .then((res) => {
          this.tableData = res
          this.tableData.forEach((v, i) => {
            if (v.length == 1)
              this.tableData[i] = [
                ...v,
                ...[
                  { bizId: v[0].bizId, courseId: v[0].courseId, fileCategory: 'user' },
                  { bizId: v[0].bizId, courseId: v[0].courseId, fileCategory: 'teacher' }
                ]
              ]
            if (v.length == 2)
              this.tableData[i] = [
                ...v,
                ...[{ bizId: v[0].bizId, courseId: v[0].courseId, fileCategory: 'teacher' }]
              ]
          })
        })
        .catch((err) => {
          this.$message.error(err)
        })
      this.loading = false
    },
    async courseChange(courseId) {
      this.loading = true
      let params = {
        userId: this.userId,
        trainId: this.$route.query.id
      }
      if (courseId != 'all') params = Object.assign(params, { courseId: courseId })
      await queryCourseWork(params)
        .then((res) => {
          this.tableData = res
          this.tableData.forEach((v, i) => {
            if (v.length == 1)
              this.tableData[i] = [
                ...v,
                ...[
                  { bizId: v[0].bizId, courseId: v[0].courseId, fileCategory: 'user' },
                  { bizId: v[0].bizId, courseId: v[0].courseId, fileCategory: 'teacher' }
                ]
              ]
            if (v.length == 2)
              this.tableData[i] = [
                ...v,
                ...[{ bizId: v[0].bizId, courseId: v[0].courseId, fileCategory: 'teacher' }]
              ]
          })
        })
        .catch((err) => {
          this.$message.error(err)
        })
      this.loading = false
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
    async onUploadComplete(scope) {
      let params = {
        courseId: scope.row.courseId, //课程id
        fileCategory: scope.$index == 1 ? 'user' : 'teacher', //文件归类：用户提交的附件user、还是讲师评改的附件teacher
        fileName: this.uploadData[this.uploadData.length - 1].localName, //文件名称，包括扩展名
        filePath: this.uploadData[this.uploadData.length - 1].fileUrl, //文件所在路径
        fileSize: Number(this.uploadData[this.uploadData.length - 1].fileSize).toFixed(1), //文件大小   //大小单位KB
        id: scope.row.id || '', //对应FileInfoList里的Id，有则回传，没有则传空
        jobId: scope.row.bizId, //对应课程作业Id
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
