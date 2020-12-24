<template>
  <div>
    <div class="top">
      <div class="topTitle">
        <i class="wire"></i>
        <span>基本信息</span>
      </div>
      <div
        class="topImg"
        @click="dialogVisible = true"
      >
        <img
          v-if="imgdata.length"
          class="img_in"
          :src="imgdata[imgdata.length - 1].fileUrl"
        />
        <div
          v-else
          class="img_in"
        ></div>
        <span>修改</span>
      </div>
    </div>

    <common-form
      ref="form"
      :model="form"
      :columns="columns"
    >
    </common-form>
    <div class="page-bottom">
      <el-button
        type="primary"
        size="medium"
      >
        保存
      </el-button>
      <el-button size="medium">
        取消
      </el-button>
    </div>

    <el-dialog
      title="上传头像"
      :visible.sync="dialogVisible"
      width="400px"
      :before-close="handleClose"
    >
      <div class="dialog_box">
        <div class="uploading_box">
          <div class="box_img">
            <img
              v-if="imgdata.length"
              class="imgupload"
              :src="imgdata[imgdata.length - 1].fileUrl"
              alt=""
            />
            <div
              v-else
              class="imgupload"
            ></div>
            <div class="btn">
              <common-upload
                v-model="imgdata"
                :before-upload="beforeAvatarUpload"
                :multiple="false"
              >
                <el-button
                  type="primary"
                  plain
                  size="medium"
                >
                  重新上传
                </el-button>
              </common-upload>
            </div>
          </div>
          <div class="preview_img">
            <img
              v-if="imgdata.length"
              class="imgpreview"
              :src="imgdata[imgdata.length - 1].fileUrl"
              alt=""
            />
            <div
              v-else
              class="imgpreview"
            ></div>
            <div>头像预览</div>
          </div>
        </div>
        <div class="text">
          支持上传png、jpg、jpge格式文件，单个文件＜2MB；推荐上传图片尺寸比例为1：1
        </div>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          size="medium"
          @click="dialogVisible = false"
        >完成</el-button>
        <el-button
          size="medium"
          @click="dialogVisible = false"
        >取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'PersonalInfo',
  components: {
    CommonUpload: () => import('@/components/common-upload/CommonUpload'),
    CommonForm: () => import('@/components/common-form/CommonForm')
  },
  data() {
    return {
      imgdata: [],
      dialogVisible: false,
      form: {
        serial: null,
        name: null,
        sex: null,
        organization: null,
        email: null,
        phonenum: null
      },
      columns: [
        {
          prop: 'serial',
          itemType: 'input',
          label: '编号',
          props: {
            onlyNumber: true
          },
          offset: 5,
          disabled: true
        },
        {
          prop: 'name',
          itemType: 'input',
          label: '姓名',
          props: {
            onlyNumber: true
          },
          offset: 5,
          required: true,
          disabled: true
        },
        {
          prop: 'organization',
          itemType: 'input',
          label: '组织',
          props: {
            onlyNumber: true
          },
          offset: 5,
          required: true,
          disabled: true
        },
        {
          prop: 'sex',
          itemType: 'radio',
          label: '性别',
          options: [
            { label: '男', value: '1' },
            { label: '女', value: '0' }
          ],
          offset: 5,
          required: true
        },
        {
          prop: 'phonenum',
          itemType: 'input',
          label: '手机号码',
          maxLength: 11,
          props: {
            onlyNumber: true
          },
          offset: 5,
          required: true,
          rules: [{ pattern: /^[0-9]{11}$/, message: '长度必须为11位', trigger: 'blur' }],
          disabled: true
        },
        {
          prop: 'email',
          itemType: 'input',
          label: '邮箱',
          props: {
            onlyNumber: true
          },
          offset: 5
        }
      ],
      recruitmentList: []
    }
  },
  watch: {},
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(() => {
          done()
        })
        .catch(() => {})
    },

    beforeAvatarUpload(file) {
      const regx = /^.*\.(jpg|jpge|png|GIF)$/
      const isLt10M = file.size / 1024 / 1024 < 5

      if (!isLt10M) {
        this.$message.error('上传课件大小不能超过 10MB!')
        return false
      }
      if (!regx.test(file.name)) {
        this.$message.error('上传图片只支持jpg|jpge|png|GIF文件')
        return false
      }
      return true
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog_box {
  height: 350px;
  .uploading_box {
    margin-top: -20px;
    padding-top: 16px;
    border-top: 1px solid #ebeced;
    display: flex;
    .box_img {
      width: 241px;
      height: 241px;
      .imgupload {
        width: 100%;
        height: 100%;
        background-color: #f2f2f2;
      }
      .btn {
        margin-top: 24px;
      }
    }
    .preview_img {
      width: 95px;
      height: 95px;
      margin: 16px;
      .imgpreview {
        border-radius: 50%;
        width: 100%;
        height: 100%;
        background-color: #f2f2f2;
      }
      div {
        margin-top: 15px;
        font-size: 14px;
        color: rgba(0, 11, 21, 0.45);
        letter-spacing: 0;
        text-align: center;
      }
    }
  }
  .text {
    margin-top: 70px;
    font-size: 14px;
    color: rgba(0, 11, 21, 0.45);
    letter-spacing: 0;
    line-height: 22px;
  }
}

.top {
  width: 670px;
  margin: 0 auto;
  margin-bottom: 24px;
  .topTitle {
    margin: 24px 0 40px;
    font-size: 14px;
    color: rgba(0, 11, 21, 0.85);
    letter-spacing: 0;
    display: flex;
    .wire {
      background: #01aafc;
      width: 4px;
      height: 16px;
    }
    span {
      margin-top: -2px;
      margin-left: 8px;
    }
  }
  .topImg {
    position: relative;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
    .img_in {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background-color: #f2f2f2;
    }
    span {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 80px;
      height: 25px;
      line-height: 22px;
      text-align: center;
      font-size: 12px;
      color: #ffffff;
      letter-spacing: 0;
      opacity: 0.45;
      background: #000000;
      display: none;
    }
  }
  .topImg:hover span {
    display: block;
  }
}

.el-cascader,
.el-select {
  width: 100%;
}
.el-col {
  margin-bottom: 0;
}
.page-bottom {
  width: 670px;
  margin: 0 auto;
}
.upload__tip {
  font-size: 12px;
}
/deep/ .el-upload {
  text-align: left;
  display: block;
}

.upload__files {
  margin-top: 4px;
  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
    &:hover {
      color: $primaryColor;
    }
  }
}
</style>
