<template>
  <!-- 注册页面 -->
  <div
    id="register"
    class="register"
  >
    <div class="layout_label">
      注册
    </div>
    <div class="layout_container">
      <common-form
        ref="form"
        :model="form"
        :columns="columns"
      >
        <template slot="captchaCode">
          <el-input
            v-model="form.captchaCode"
            class="captchaCode"
          ></el-input><el-button
            class="captchaCodeBtn"
            @click="getCapthaCode"
          >
            验证码
          </el-button>
        </template>
        <template slot="opations">
          <el-button
            type="primary"
            class="submit"
            @click="submit"
          >
            立即注册
          </el-button>
          <router-link
            class="returnLogin"
            to="/auth/login"
          >
            返回登录
          </router-link>
        </template>
      </common-form>
    </div>
  </div>
</template>

<script>
import { userRegister, getCode } from '@/api/user'
export default {
  components: {
    CommonForm: () => import('@/components/common-form/CommonForm')
  },
  data() {
    return {
      form: {
        phonenum: '', // 手机号
        name: '', // 姓名
        sex: '', // 性别
        password: '', // 密码
        repeatPassword: '', // 重复密码
        userEmail: '', // 用户邮箱
        captchaCode: '' // 验证码
      },
      columns: [
        {
          prop: 'phonenum',
          itemType: 'input',
          required: true,
          label: '手机号',
          props: {
            onlyNumber: true
          },
          offset: 7
        },
        {
          prop: 'name',
          itemType: 'input',
          label: '姓名',
          offset: 7,
          required: true
        },
        {
          prop: 'sex',
          itemType: 'radio',
          label: '性别',
          options: [
            { label: '男', value: '1' },
            { label: '女', value: '0' }
          ],
          offset: 7,
          required: true
        },
        {
          prop: 'password',
          itemType: 'input',
          type: 'password',
          label: '密码',
          offset: 7,
          required: true
        },
        {
          prop: 'repeatPassword',
          type: 'password',
          itemType: 'input',
          label: '重复密码',
          offset: 7,
          required: true
        },
        {
          prop: 'userEmail',
          itemType: 'input',
          label: '邮箱',
          offset: 7,
          required: false
        },
        {
          prop: 'captchaCode',
          itemType: 'slot',
          label: '验证码',
          offset: 7,
          required: false
        },
        {
          prop: 'opations',
          itemType: 'slot',
          label: '',
          offset: 7,
          required: false
        }
      ]
    }
  },
  methods: {
    getCapthaCode() {
      this.$refs.form.validateField('userEmail', (valite) => {
        if (!valite) {
          let params = {
            phonenum: '',
            email: this.form.userEmail
          }
          getCode(params)
            .then(() => {
              this.$message.success('验证码发送成功，请注意查收')
            })
            .catch(() => {
              // clearInterval(time)
              // this.identity.msgKey = false
            })
        } else {
          this.$message.error('请输入正确的邮箱')
        }
      })
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let data = this.form
          userRegister(data)
            .then(() => {
              this.$router.push({ path: '/auth/login' })
            })
            .catch((err) => {
              window.console.log(err)
            })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.register {
  .layout_label {
    font-size: 22px;
    color: rgba(0, 11, 21, 0.85);
    text-align: center;
    margin: 40px 0;
  }
  .layout_container {
    .captchaCode {
      width: 70%;
      margin-right: 10%;
    }
    .captchaCodeBtn {
      width: 20%;
    }
    .submit {
      display: block;
      width: 100%;
      // margin: 40px 0 16px 0;
    }
    .returnLogin {
      display: block;
      text-align: center;
    }
  }
}
</style>
