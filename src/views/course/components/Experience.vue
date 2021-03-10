<template>
  <div class="courseTask">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column :label="`${courseName}学习心得`" prop="name" width="480px">
        <template slot-scope="scope">
          <div>
            <span> {{ scope.row.localName }} </span>
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
        <template slot="header">
          <!-- <el-button type="text">
            上传心得
          </el-button> -->

          <common-upload v-model="uploadData" :before-upload="beforeUpload" :multiple="false">
            <el-button type="text">
              上传心得
            </el-button>
          </common-upload>
        </template>
        <template slot-scope="scope">
          <el-button type="text" @click="delItem(scope.$index)">
            删除
          </el-button>
          <a :href="scope.row.fileUrl" download style="color:#01aafc;"> 下载 </a>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// import { courseFeelListByUserId } from '@/api/course/course'
export default {
  components: {
    CommonUpload: () => import('@/components/common-upload/CommonUpload')
  },
  props: ['courseName'],
  data() {
    return {
      tableData: [],
      uploadData: [{}]
    }
  },
  watch: {
    uploadData(newVal) {
      this.tableData.push(newVal[1])
    }
  },
  //   activated() {
  //     this.getInfo()
  //   },
  methods: {
    delItem(i) {
      this.tableData.splice(i, 1)
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
      //   let params = { courseId: this.$route.query.courseId, stuId: this.$route.query.row.stuId }
      //   let res = await courseFeelListByUserId(params)
      //   this.tableData = res
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
