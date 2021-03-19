<template>
  <div class="materialsUpload">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column :label="'来源：' + data.trainName" prop="name" width="480px">
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
          <common-upload v-model="uploadData" :multiple="false" @input="onSuccess">
            <el-button type="text" icon="el-icon-upload2">上传材料</el-button>
          </common-upload>
        </template>
        <template slot-scope="scope">
          <el-button type="text" @click="delItem(scope.$index)">
            删除
          </el-button>
          <a style="color:#01aafc;cursor:pointer;" @click="downLoadMaterial(scope.row)"> 下载 </a>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { downLoadFile } from '@/util/util'
import CommonUpload from '@/components/common-upload/CommonUpload'
import { getFileLists, saveFile } from 'src/api/train'
export default {
  components: {
    CommonUpload
  },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      tableData: [],
      uploadData: [{}]
    }
  },
  watch: {
    uploadData(newVal) {
      console.log('sadfa', this.tableData)
      this.tableData.unshift(newVal[1])
    }
  },
  created() {
    // 临时数据
    // this.tableData = [{fileName: "f21fb9f83be346f28dd8a420825d6207.txt",
    //     fileSize: "0.1",
    //     fileUrl: "https://oa-file-dev.bestgrand.com.cn/f21fb9f83be346f28dd8a420825d6207.txt",
    //     localName: "项目备注.txt",
    //     updateTime: "2021/3/12 14:28:26",
    //     url: "https://oa-file-dev.bestgrand.com.cn/f21fb9f83be346f28dd8a420825d6207.txt"},
    //     {fileName: "f21fb9f83be346f28dd8a420825d6207.txt",
    //     fileSize: "0.1",
    //     fileUrl: "https://oa-file-dev.bestgrand.com.cn/f21fb9f83be346f28dd8a420825d6207.txt",
    //     localName: "项目备注.txt",
    //     updateTime: "2021/3/12 14:28:26",
    //     url: "https://oa-file-dev.bestgrand.com.cn/f21fb9f83be346f28dd8a420825d6207.txt"}]
    this.handleGetFileLists()
  },
  activated() {
    // this.getInfo()
  },
  methods: {
    downLoadMaterial(data) {
      downLoadFile(data)
    },
    delItem(i) {
      this.tableData.splice(i, 1)
    },
    handleGetFileLists() {
      let params = {
        trainId: this.data.id
      }
      console.log('params', params)
      getFileLists(params).then((res) => {
        if (res.length > 0) {
          for (let i = 0; i < res.length; i++) {
            res[i].localName = res[i].fileName
          }
          this.tableData = res
        }
      })
    },
    beforeUpload(file) {
      const isLt20M = file.size / 1024 / 1024 < 20
      if (!isLt20M) {
        this.$message.error('上传文件大小不能超过 20MB!')
        return false
      }
      for (let i of this.tableData) {
        if (i.localName.indexOf(file.name) !== -1) {
          this.$message.error('已存在相同文件！')
          return false
        }
      }
      return true
    },
    onSuccess(v) {
      if (v[0].status === 'success') {
        let params = {
          fileName: v[1].localName,
          filePath: v[1].fileUrl,
          fileSize: v[1].fileSize,
          id: '',
          trainId: this.data.id
        }
        console.log('params--', params)
        saveFile(params).then((res) => {
          if (JSON.stringify(res) != '{}') {
            this.$message.error('上传失败！')
          }
        })
      } else {
        this.$message.error('上传失败！')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.materialsUpload {
  // border: 1px solid #dcdee3;
  /deep/.el-table tr {
    height: 50px !important;
  }
}
</style>
