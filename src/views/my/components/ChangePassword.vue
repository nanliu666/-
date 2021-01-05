<template>
  <div class="changePassword">
    <common-form
      ref="form"
      :model="form"
      :columns="columns"
    >
    </common-form>
    <div class="text">
      (密码不能包含空格和中文；至少包含数字/字母/字符2种组合；长度为8-16个字符)
    </div>
    <div class="page-bottom">
      <el-button
        type="primary"
        size="medium"
        @click="setPassword"
      >
        保存
      </el-button>
      <el-button
        size="medium"
        @click="goBack"
      >
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
          itemType: 'input',
          label: '原始密码',
          required: true,
          offset: 5,
          showPassword: true,
          rules: [
            {
              pattern: /(?!.*\s)(?!^[\u4e00-\u9fa5]+$)(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{8,16}$/,
              message: '请按密码规则设置',
              trigger: 'blur'
            }
          ]
        },
        {
          prop: 'newPassword',
          itemType: 'input',
          label: '新密码',
          offset: 5,
          required: true,
          showPassword: true,
          rules: [
            { validator: validatePass1, trigger: 'blur' },
            {
              pattern: /(?!.*\s)(?!^[\u4e00-\u9fa5]+$)(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{8,16}$/,
              message: '请按密码规则设置',
              trigger: 'blur'
            }
          ]
        },
        {
          prop: 'affirmPassword',
          itemType: 'input',
          label: '确认新密码',
          offset: 5,
          required: true,
          showPassword: true,
          rules: [
            { validator: validatePass2, trigger: 'blur' },
            { validator: validatePass1, trigger: 'blur' },
            {
              pattern: /(?!.*\s)(?!^[\u4e00-\u9fa5]+$)(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{8,16}$/,
              message: '请按密码规则设置',
              trigger: 'blur'
            }
          ]
        }
      ],
      recruitmentList: []
    }
  },
  activated() {},
  methods: {
    // 取消返回上一级
    goBack() {
      this.$router.go(-1)
    },
    setPassword() {
      let params = { oldPassword: '', newPassword: '' }
      params.oldPassword = md5(this.form.oldPassword)
      params.newPassword = md5(this.form.newPassword)
      this.$refs.form.validate((valid) => {
        if (valid) {
          password(params).then(() => {
            setTimeout(() => {
              // this.$router.go(-1)
              this.$router.push({ path: '/home' })
            }, 3000)
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
  margin-top: 24px;
  .page-bottom {
    width: 670px;
    margin: 20px auto;
  }
  .text {
    font-size: 12px;
    color: rgba(0, 11, 21, 0.45);
    letter-spacing: 0;
    width: 670px;
    position: absolute;
    top: 94px;
    left: 299px;
  }
}
</style>
