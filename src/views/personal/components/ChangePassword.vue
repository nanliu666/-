<template>
  <div class="changePassword">
    <common-form ref="form" :model="form" :columns="columns"> </common-form>
    <div class="text">
      (密码包含字母、符号或数字中至少两项且长度6～12字符的密码)
    </div>
    <div class="page-bottom">
      <el-button :type="setBtnPrimary" size="medium" @click="setPassword">
        保存
      </el-button>
      <el-button size="medium" @click="goBack">
        取消
      </el-button>
    </div>
  </div>
</template>
<script>
import { password } from '@/api/my'
import md5 from 'js-md5'
export default {
  name: 'ChangePassword',
  components: {
    CommonForm: () => import('@/components/common-form/CommonForm')
  },
  data() {
    let validatePass1 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value === this.form.oldPassword) {
        callback(new Error('新旧密码不能一样!'))
      } else {
        callback()
      }
    }
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      setBtnPrimary: '',
      personId: null,
      form: {
        oldPassword: '',
        newPassword: '',
        affirmPassword: ''
      },
      uploadFileList: [],
      columns: [
        {
          prop: 'oldPassword',
          itemType: 'passInput',
          label: '原始密码',
          required: true,
          offset: 5

          // rules: [
          //   {
          //     pattern: /(?!^\d+$)(?!^[A-Za-z]+$)(?!^[^A-Za-z0-9]+$)(?!^.*[\u4E00-\u9FA5].*$)^\S{6,16}$/,
          //     message: '密码包含字母、符号或数字中至少两项且长度6～12字符的密码',
          //     trigger: 'blur'
          //   }
          // ]
        },
        {
          prop: 'newPassword',
          itemType: 'passInput',
          label: '新密码',
          offset: 5,
          required: true,

          rules: [
            { validator: validatePass1, trigger: 'blur' },
            {
              pattern: /(?!^\d+$)(?!^[A-Za-z]+$)(?!^[^A-Za-z0-9]+$)(?!^.*[\u4E00-\u9FA5].*$)^\S{6,16}$/,
              message: '密码包含字母、符号或数字中至少两项且长度6～12字符的密码',
              trigger: 'blur'
            }
          ]
        },
        {
          prop: 'affirmPassword',
          itemType: 'passInput',
          label: '确认新密码',
          offset: 5,
          required: true,

          rules: [
            { validator: validatePass2, trigger: 'blur' },
            { validator: validatePass1, trigger: 'blur' },
            {
              pattern: /(?!^\d+$)(?!^[A-Za-z]+$)(?!^[^A-Za-z0-9]+$)(?!^.*[\u4E00-\u9FA5].*$)^\S{6,16}$/,
              message: '密码包含字母、符号或数字中至少两项且长度6～12字符的密码',
              trigger: 'blur'
            }
          ]
        }
      ],
      recruitmentList: []
    }
  },
  watch: {
    form: {
      handler: function(newV) {
        if (newV.oldPassword != '' && newV.newPassword != '' && newV.affirmPassword != '') {
          this.setBtnPrimary = 'primary'
        } else {
          this.setBtnPrimary = ''
        }
      },
      deep: true
    }
  },
  activated() {},
  methods: {
    // 取消返回上一级
    goBack() {
      // this.$router.go(-1)
      this.$refs.form.resetFields()
    },
    setPassword() {
      let params = { oldPassword: '', newPassword: '' }
      params.oldPassword = md5(this.form.oldPassword)
      params.newPassword = md5(this.form.newPassword)
      this.$refs.form.validate((valid) => {
        if (valid) {
          password(params).then(() => {
            // setTimeout(() => {
            //   // this.$router.go(-1)
            //   this.$router.push({ path: '/home' })
            // }, 3000)
            this.$message({
              message: '修改成功',
              type: 'success'
            })

            this.goBack()
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.changePassword {
  position: relative;
  width: 100%;
  margin-top: 24px;
  .page-bottom {
    // width: 670px;
    margin: 20px auto;
  }
  .text {
    font-size: 12px;
    color: rgba(0, 11, 21, 0.45);
    letter-spacing: 0;
    width: 670px;
    position: absolute;
    top: 94px;
    left: 60px;
  }
}
/deep/.el-row {
  width: 500px;
  .el-col-10 {
    width: 380px;
  }
  .el-col-offset-5 {
    margin-left: 0;
  }
}
</style>
