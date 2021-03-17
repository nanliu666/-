<template>
  <div class="courseTask">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column :label="`${titleName || ''}学习心得`" prop="name" width="480px">
        <template slot-scope="scope">
          <div>
            <span> {{ scope.row.fileName }} </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="" prop="fileSize">
        <template slot-scope="scope">
          <div>
            <span> {{ scope.row.fileSize + 'K' }} </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="" prop="updateTime"> </el-table-column>
      <el-table-column align="right">
        <template #header>
          <div>
            <div v-if="btnShow" :key="'length5'">
              <common-upload v-model="uploadData" :before-upload="beforeUpload" :multiple="false">
                <el-button type="text">
                  上传心得
                </el-button>
              </common-upload>
            </div>
            <div v-else :key="'length4'">
              <el-tooltip
                class="item"
                effect="dark"
                content="上传的学习心得不可超过5份!"
                placement="top"
              >
                <span style="cursor:not-allowed;"> 上传心得</span>
              </el-tooltip>
            </div>
          </div>
        </template>
        <template slot-scope="scope">
          <el-button type="text" @click="delItem(scope.row.id)">
            删除
          </el-button>
          <a style="color:#01aafc; cursor:pointer;" @click="downLoadInfo(scope.row)"> 下载 </a>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { downLoadFile } from '@/util/util'
import { queryExperience, saveExperience, removeExperience } from '@/api/course'
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['userId'])
  },
  components: {
    CommonUpload: () => import('@/components/common-upload/CommonUpload')
  },
  props: ['courseName'],
  data() {
    return {
      tableData: [],
      uploadData: [],
      btnShow: true,
      titleName: this.courseName
    }
  },
  watch: {
    uploadData(newVal) {
      //   this.tableData.push(newVal[0])
      let params = {
        userId: this.userId, // 默认值    学员ID
        courseId: this.$route.query.id, // 默认值    课程id
        fileSize: newVal[0].fileSize, // 默认值    文件大小
        fileName: newVal[0].localName, // 默认值    文件名称，包括扩展名
        filePath: newVal[0].fileUrl, // 默认值    文件所在路径
        creatorId: this.$route.query.id, // 默认值    创建人id
        createTime: newVal[0].updateTime, // 默认值    创建时间
        updateId: this.$route.query.id, // 默认值    最后修改人
        updateTime: newVal[0].updateTime // 默认值    最后修改时间
      }
      saveExperience(params).then(() => {
        this.getInfo()
      })
    },
    tableData(val) {
      if (!val) return
      if (val.length >= 5) {
        this.btnShow = false
      } else {
        this.btnShow = true
      }
    },
    courseName(val) {
      this.titleName = val
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    downLoadInfo(data) {
      // 下载
      downLoadFile(data)
    },
    delItem(i) {
      removeExperience({ id: i }).then(() => {
        this.getInfo()
      })
    },
    beforeUpload(file) {
      const isLt20M = file.size / 1024 / 1024 < 20
      if (!isLt20M) {
        this.$message.error('上传文件大小不能超过 20MB!')
        return false
      }
      return true
    },
    async getInfo() {
      let params = { courseId: this.$route.query.id, userId: this.userId }
      let res = await queryExperience(params)
      this.tableData = res.courseFeelUserFileVOS
    }
  }
}
</script>
<style lang="scss" scoped>
.courseTask {
  border: 1px solid #dcdee3;
  /deep/.el-table tr {
    height: 50px !important;
  }
}
</style>
