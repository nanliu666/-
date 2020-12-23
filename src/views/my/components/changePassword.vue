<template>
  <div class="changePassword">
    <common-form
      ref="form"
      :model="form"
      :columns="columns"
    >
    </common-form>
    <div class="text">
      密码不能包含空格；需包含字母、数字；不能少于6个字符
    </div>
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
  </div>
</template>
<script>
export default {
  name: 'DemoForm',
  components: {
    commonForm: () => import('@/components/common-form/commonForm')
  },
  data() {
    return {
      personId: null,
      form: {
        Password: '',
        newPassword: '',
        affirmPassword: ''
      },
      uploadFileList: [],
      columns: [
        {
          prop: 'Password',
          itemType: 'input',
          label: '原始密码',
          props: {
            onlyNumber: true
          },
          offset: 5,
          showPassword: true
        },
        {
          prop: 'newPassword',
          itemType: 'input',
          label: '新密码',
          props: {
            onlyNumber: true
          },
          offset: 5,
          required: true,
          showPassword: true
        },
        {
          prop: 'affirmPassword',
          itemType: 'input',
          label: '确认新密码',
          props: {
            onlyNumber: true
          },
          offset: 5,
          required: true,
          showPassword: true
        }
      ],
      recruitmentList: []
    }
  },
  watch: {},
  methods: {
    beforeUpload(file) {
      const regx = /^.*\.(png|jpg|jpeg)$/
      const isLt5M = file.size / 1024 / 1024 < 5
      if (this.uploadFileList.length >= 5) {
        this.$message.error('上传附件不能超过5张')
        return false
      }
      if (!isLt5M) {
        this.$message.error('上传附件大小不能超过 5MB!')
        return false
      }
      if (!regx.test(file.name)) {
        this.$message.error('上传附件只支持png、jpg、jpeg格式文件')
        return false
      }
      return true
    }
  }
}
</script>

<style lang="scss" scoped>
.changePassword {
  position: relative;
  margin-top: 24px;
  .page-bottom {
    width: 670px;
    margin: 10px auto;
  }
  .text {
    font-size: 12px;
    color: rgba(0, 11, 21, 0.45);
    letter-spacing: 0;
    width: 670px;
    position: absolute;
    top: 255px;
    left: 240px;
  }
}
</style>
