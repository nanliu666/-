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
            <el-tooltip :content="'作业来源: ' + z.name" placement="top">
              <div class="source">作业来源：{{ z.name }}</div>
            </el-tooltip>
            <!-- <div class="download">
              <i class="iconimage_icon_download iconfont" style="margin-right: 5px" />打包下载
            </div> -->
          </el-row>
        </div>
        <!-- 表格数据 -->
        <el-table :data="z.trainAttachmentVOS" :show-header="false">
          <el-table-column prop="fileName">
            <template slot-scope="scope">
              <div class="tip">
                {{
                  scope.row.fileCategory == 'teacher'
                    ? '教师评改：'
                    : scope.row.fileCategory == 'user'
                      ? '学员作业：'
                      : '作业内容：'
                }}<span class="courseware">{{ scope.row.fileName }}</span>
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
                :disabled="scope.row.fileCategory === 'teacher' && !scope.row.fileName"
                need-handler
                :before-upload="onUploadStart"
                :on-upload-complete="(file, url) => onUploadComplete(scope.row, file, url)"
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
import {
  queryStudyPlanWork,
  queryStudyAllCorseList,
  saveCourseLinkedStudentOrTeacher
} from '@/api/myTask'
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
      loading: false
    }
  },
  computed: {
    ...mapGetters(['userId'])
  },
  mounted() {
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
    // 查询课程列表
    async queryStudyPlan() {
      this.loading = true
      await queryStudyAllCorseList({ id: this.$route.query.id })
        .then((res) => {
          res.map((v) => {
            this.seleteCourse.push({ value: v.courseId, label: v.courseName })
          })
        })
        .catch((err) => {
          this.$message.error(err)
        })
      await queryStudyPlanWork({ userId: this.userId, studyPlanId: this.$route.query.id })
        .then((res) => {
          this.tableData = res
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
        studyPlanId: this.$route.query.id
      }
      if (courseId != 'all') params = Object.assign(params, { courseId: courseId })
      await queryStudyPlanWork(params)
        .then((res) => {
          this.tableData = res
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
    async onUploadComplete(item, file, url) {
      console.log(item)
      const { fileCategory, id, bizId: jobId, fileName, courseId } = item
      const { size: fileSize, name } = file.file
      const params = {
        courseId,
        fileCategory,
        fileName: name,
        filePath: url,
        fileSize,
        jobId,
        id: fileName ? id : '',
        userId: this.userId
      }
      //   table.loading = true
      const message = fileName ? '修改成功' : '上传成功'
      console.log(params)
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
