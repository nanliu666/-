<template>
  <!-- 注册页面 -->
  <el-card class="register">
    <div
      v-if="!succeed"
      class="layout_container"
    >
      <div class="layout_label">
        注册
      </div>
      <common-form
        ref="form"
        :model="form"
        :columns="columns"
      >
        <template slot="captchaCode">
          <el-input
            v-model="form.captchaCode"
            class="captchaCode"
            placeholder="请输入验证码"
          ></el-input><el-button
            class="captchaCodeBtn"
            @click="getCapthaCode"
          >
            获取验证码
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
            to="/login"
          >
            <el-button type="text">
              返回登录
            </el-button>
          </router-link>
        </template>
      </common-form>
    </div>
    <div
      v-else
      class="success-page"
    >
      <svg
        class="icon success-icon"
        aria-hidden="true"
      >
        <use xlink:href="#iconimage_icon_Correctprompt"></use>
      </svg>
      <div class="text">
        注册成功
      </div>
      <div class="tips">
        {{ timeoutCount }}秒后自动返回
      </div>
      <el-button
        type="primary"
        size="medium"
        @click="goToLogin"
      >
        返回
      </el-button>
    </div>
  </el-card>
</template>

<script>
import { userRegister, getCode } from '@/api/user'
export default {
  components: {
    CommonForm: () => import('@/components/common-form/CommonForm')
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.form.checkPass !== '') {
          this.$refs.form.validateField('repeatPassword')
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      succeed: false,
      timeoutCount: 5,
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
          maxlength: '11',
          span: 24,
          rules: [{ pattern: /^1[0-9]{10}$/, message: '手机号码格式不正确' }],
          props: {
            onlyNumber: true
          }
        },
        {
          prop: 'name',
          span: 24,
          itemType: 'input',
          label: '姓名',
          maxlength: 20,
          placeholder: '请输入真实姓名，后续不可自行修改',
          rules: [{ min: 2, max: 20, message: '姓名长度需要满足2到20个字符' }],
          required: true
        },
        {
          prop: 'sex',
          itemType: 'radio',
          span: 24,
          label: '性别',
          options: [
            { label: '男', value: '1' },
            { label: '女', value: '0' }
          ],
          required: true
        },
        {
          prop: 'password',
          itemType: 'passInput',
          span: 24,
          label: '密码',
          maxlength: '12',
          rules: [
            { min: 6, max: 12, message: '密码长度需要满足6～12字符' },
            {
              pattern: /(?!^\d+$)(?!^[A-Za-z]+$)(?!^[^A-Za-z0-9]+$)(?!^.*[\u4E00-\u9FA5].*$)^\S{6,16}$/,
              message: '密码需要包含字母、符号或数字中至少两项'
            },
            { validator: validatePass }
          ],
          desc: '密码包含字母、符号或数字中至少两项且长度6～12字符的密码',
          required: true
        },
        {
          prop: 'repeatPassword',
          itemType: 'passInput',
          label: '重复密码',
          span: 24,
          desc: '密码包含字母、符号或数字中至少两项且长度6～12字符的密码',
          rules: [
            { validator: validatePass2 },
            { min: 6, max: 12, message: '密码长度需要满足6～12字符' },
            {
              pattern: /(?!^\d+$)(?!^[A-Za-z]+$)(?!^[^A-Za-z0-9]+$)(?!^.*[\u4E00-\u9FA5].*$)^\S{6,16}$/,
              message: '密码需要包含字母、符号或数字中至少两项'
            }
          ],
          required: true
        },
        {
          prop: 'userEmail',
          itemType: 'input',
          span: 24,
          required: true,
          rules: [{ type: 'email', message: '邮箱格式不正确' }],
          label: '邮箱'
        },
        {
          prop: 'captchaCode',
          itemType: 'slot',
          label: '验证码',
          span: 24,
          required: false
        },
        {
          prop: 'opations',
          itemType: 'slotout',
          span: 24,
          label: '',
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
              this.$message.success(
                `我们已向您的邮箱${this.form.userEmail}发送邮件，请接受邮件，查收验证码`
              )
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
      this.$refs.form.validate().then(() => {
        let data = this.form
        userRegister(data)
          .then(() => {
            this.succeed = true
            let setTimeOutObj = setInterval(() => {
              this.timeoutCount--
              if (this.timeoutCount < 0) {
                clearInterval(setTimeOutObj)
                this.goToLogin()
              }
            }, 1000)
          })
          .catch((err) => {
            window.console.log(err)
          })
      })
    },
    goToLogin() {
      this.$router.push({ path: '/login' })
    }
  }
}
</script>

<style lang="scss" scoped>
.register {
  margin-top: 20px;
  position: relative;
  height: calc(100% - 20px);
  min-height: calc(100% - 20px);
  /deep/.el-card__body {
    min-height: 100%;
    height: 100%;
  }
  .layout_container {
    width: 360px;
    margin: 0 auto;
    .layout_label {
      font-size: 22px;
      color: rgba($primaryFontColor, 0.85);
      text-align: center;
      margin: 16px 0 40px;
    }
    /deep/.desc {
      font-size: 12px;
      color: rgba($primaryFontColor, 0.25);
      letter-spacing: 0;
      line-height: 18px;
      min-height: initial;
    }
    /deep/ .el-form-item {
      margin-bottom: 16px;
    }
    .captchaCode {
      width: 70%;
      margin-right: 3%;
    }
    .captchaCodeBtn {
      width: 27%;
      padding: 9px 0;
    }
    .submit {
      display: block;
      width: 100%;
      // margin: 40px 0 16px 0;
    }
    .returnLogin {
      text-align: center;
      display: block;
      margin-top: 10px;
    }
  }
  .success-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    .success-icon {
      font-size: 72px;
    }
    .text {
      font-size: 24px;
      color: rgba(0, 11, 21, 0.85);
      letter-spacing: 0;
      text-align: center;
      line-height: 36px;
      font-weight: 600;
      margin: 16px 0 48px;
    }
    .tips {
      color: rgba($primaryFontColor, 0.25);
      font-size: 12px;
      letter-spacing: 0;
      line-height: 18px;
      margin-bottom: 16px;
    }
  }
}
</style>
