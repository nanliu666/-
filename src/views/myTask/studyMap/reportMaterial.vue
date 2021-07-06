<template>
  <div class="reportMaterial">
    <el-dialog
      :visible="visible"
      width="1200px"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      @close="visible = false"
    >
      <!-- 头部插槽 -->
      <div slot="title" class="dialogTitle">
        能力提升上报材料
        <el-tooltip
          effect="dark"
          content="能力提升材料只能上传一个，若需重新上传需删除当前文件"
          placement="top"
        >
          <i class="el-icon-question"></i>
        </el-tooltip>
        <el-divider></el-divider>
      </div>
      <div v-loading="loading">
        <div class="desc">能力提升材料描述：</div>
        <div class="desc-info">
          {{ materialInfo.material || '--' }}
        </div>
        <div class="report-info">
          <div class="report-title">
            <el-row type="flex" justify="space-between">
              <div class="name">能力提升上报材料名称：{{ materialInfo.routeName }}</div>
              <common-upload
                v-model="uploadData"
                :before-upload="beforeUpload"
                :multiple="false"
                @input="onSuccess"
              >
                <el-button v-if="!Object.keys(materialTemp).length > 0" type="text">
                  上传材料
                </el-button>
              </common-upload>
            </el-row>
          </div>
          <div class="report-temp">
            <el-row
              v-if="Object.keys(materialTemp).length > 0"
              type="flex"
              justify="space-between"
              style="align-items: center"
            >
              <div>{{ materialTemp.fileName }}</div>
              <div>{{ materialTemp.fileSize + 'K' }}</div>
              <div>{{ materialTemp.updateTime }}</div>
              <div>
                <el-button type="text" @click="deleteMaterialReport">删除</el-button>
                <el-button type="text" @click="downloadFile(materialTemp)">下载</el-button>
              </div>
            </el-row>
            <!-- 暂无数据 -->
            <div v-else class="noData">暂无数据</div>
          </div>
        </div>
      </div>
      <!-- 底部插槽 -->
      <div slot="footer">
        <el-divider></el-divider>
        <el-button size="medium" @click="visible = false"> 取 消 </el-button>
        <el-button type="primary" size="medium" @click="refreshConfirm"> 确 定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getMaterialReport, uploadMaterialReport, deleteMaterialReport } from '@/api/studyMap.js'
import { downLoadFile } from '@/util/util'
export default {
  name: 'ReportMaterial',
  components: {
    CommonUpload: () => import('@/components/common-upload/CommonUpload')
  },
  data() {
    return {
      visible: false,
      uploadData: [], // 上传文件的数据
      materialInfo: {}, // 材料信息
      materialTemp: {}, // 查看材料数据
      loading: false
    }
  },
  methods: {
    showTip() {
      this.$message.warning('您已经上传了能力提升上报材料，再次上传会覆盖之前的文件!')
    },
    beforeUpload(file) {
      const isLt20M = file.size / 1024 / 1024 < 20
      if (!isLt20M) {
        this.$message.error('上传文件大小不能超过 20MB!')
        return false
      }
      return true
    },
    async onSuccess() {
      if (!this.uploadData) return
      this.loading = true
      let params = {
        bizId: this.materialInfo.ablrId,
        fileName: this.uploadData[0].localName,
        fileUrl: this.uploadData[0].fileUrl,
        fileSize: this.uploadData[0].fileSize
      }
      await uploadMaterialReport(params).then(() => {
        this.$message.success('上传成功')
        this.initMaterialReport(this.materialInfo)
      })
    },
    // 查看材料
    async initMaterialReport(data) {
      this.materialInfo = data
      this.loading = true
      await getMaterialReport({ ablrId: data.ablrId })
        .then((res) => {
          this.materialTemp = res
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 删除材料
    async deleteMaterialReport() {
      await deleteMaterialReport({ ablrId: this.materialInfo.ablrId })
        .then(() => {
          this.$message.success('已成功删除该文件')
          this.initMaterialReport(this.materialInfo)
        })
        .catch((err) => {
          this.$message.error('删除失败,请联系管理员,失败原因:' + err)
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 下载文件
    downloadFile(item) {
      if (item.fileUrl.indexOf('http') < 0 && item.fileUrl.indexOf('https') < 0) {
        this.$message.error('文件地址不正确')
        return
      }
      downLoadFile(item)
    },
    refreshConfirm() {
      this.$emit('refreshConfirm')
      this.visible = false
    }
  }
}
</script>

<style scoped lang="scss">
.reportMaterial {
  .dialogTitle {
    font-size: 20px;
  }
  .desc-info {
    margin-top: 20px;
  }
  .report {
    &-info {
      margin-top: 35px;
      width: 100%;
      height: 135px;
      border: 1px solid #dcdee3;
    }
    &-title {
      padding: 0 10px;
      height: 42px;
      line-height: 42px;
      background: #f2f3f7;
    }
    &-temp {
      padding: 25px;
      .noData {
        text-align: center;
      }
    }
  }
}
</style>
