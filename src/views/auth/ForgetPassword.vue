<template>
  <!-- 忘记密码 -->
  <div
    id="forgetPassword"
    class="forgetPassword"
  >
    <div
      v-if="!successPageShow"
      class="title"
    >
      找回密码
    </div>
    <div class="layout_container">
      <div
        v-if="!successPageShow"
        class="layout_content"
      >
        <el-steps
          :active="stepIndex"
          finish-status="success"
        >
          <el-step title="确认账户"></el-step>
          <el-step title="安全验证"></el-step>
          <el-step title="重置密码"></el-step>
        </el-steps>
        <div class="layout_category">
          <el-form
            ref="form"
            :rules="rules"
            :model="formData"
          >
            <div
              v-show="stepIndex == 0"
              class="el-step-content"
            >
              <div class="email-label">
                通过邮箱找回密码
              </div>
              <el-form-item prop="email">
                <el-input
                  v-model="formData.email"
                  type="text"
                  placeholder="请输入您绑定的邮箱"
                />
              </el-form-item>
            </div>
            <div
              v-show="stepIndex == 1"
              class="el-step-content"
            >
              您正在对<el-button
                type="text"
                style="cursor:text;padding: 0;"
              >
                {{ formData.email }}
              </el-button>进行找回密码操作,请先进行验证:
              <div class="subtitle-wr">
                <span class="subtitle">去邮箱查看,输入验证码</span>
                <span class="countdown-wr">
                  <span
                    v-if="countdown > 0"
                    class="countdown"
                  >剩余{{ countdown }}秒</span>
                  <el-button
                    v-else
                    type="text"
                    style="padding:0;"
                    class="resend"
                    @click="sendEmail()"
                  >重新发送</el-button>
                </span>
              </div>

              <el-form-item prop="verification">
                <el-input
                  v-model="formData.verification"
                  placeholder="请输入验证码"
                ></el-input>
              </el-form-item>
              <!-- <el-form-item prop="captchaCode">
                <div style="display: flex">
                  <el-input
                    v-model="formData.captchaCode"
                    class="test-code-input"
                    size="small"
                    auto-complete="off"
                    placeholder="请输入图片验证码"
                    @focus="resetIdentityFields('captchaCode')"
                  />

                  <img
                    :src="formData.image"
                    class="login-code-img"
                    @click="refreshCode"
                  />
                </div>
              </el-form-item> -->
            </div>
            <div
              v-show="stepIndex == 2"
              class="el-step-content"
            >
              请输入重置的密码
              <el-form-item prop="restPassword">
                <pass-input
                  v-model="formData.restPassword"
                  placeholder="请输入重置的密码"
                >
                </pass-input>
              </el-form-item>
              <span>密码包含字母、符号或数字中至少两项且长度6～12字符的密码</span>
              <el-form-item prop="againRestPassword">
                <pass-input
                  v-model="formData.againRestPassword"
                  placeholder="请再次输入重置的密码"
                >
                </pass-input>
              </el-form-item>
            </div>
            <el-button
              class="nextStep"
              type="primary"
              size="medium"
              @click="nextStep"
            >
              下一步
            </el-button>
            <router-link
              to="/home"
              class="rebackLogin"
            >
              返回登录
            </router-link>
          </el-form>
        </div>
      </div>
      <div
        v-else
        class="successPage"
      >
        <svg
          class="icon success-icon"
          aria-hidden="true"
        >
          <use xlink:href="#iconimage_icon_Correctprompt"></use>
        </svg>
        <p>设置成功</p>
        <p>新密码设置成功，请牢记您的密码</p>
        <p>{{ timeOutNum }}秒后自动返回</p>
        <el-button
          type="primary"
          size="medium"
          @click="returnLogin"
        >
          返回
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getCode, checkPhoneCode, checkPassword, getCaptcha } from '@/api/user.js'
import PassInput from '@/components/pass-input/PassInput'
import md5 from 'js-md5'
export default {
  components: {
    PassInput
  },
  data() {
    return {
      stepIndex: 0, // 步骤
      countdown: null,
      formData: {
        email: '', // 邮箱
        verification: '', // 短信验证码
        restPassword: '', // 重置密码的val
        againRestPassword: '', // 再次输入的val
        // captchaCode: '', // 验证码
        image: '', // 验证码默认图片
        captchaKey: '' // 验证码的key
      },
      successPageShow: false, // 成功页面标记
      timeOutNum: 5, // 时间倒计时
      userId: '',
      rules: {
        // captchaCode: [{ required: false, message: '请输入图片验证码', trigger: 'blur' }],
      }
    }
  },
  activated() {
    this.resetData()
  },
  created() {
    // this.refreshCode()
  },
  methods: {
    validatePass(rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.formData.againRestPassword !== '') {
          this.$refs.form.validateField('againRestPassword')
        }
        callback()
      }
    },
    validatePass2(rule, value, callback) {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.formData.restPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    },
    resetData() {
      this.stepIndex = 0
      this.successPageShow = false
      this.setupRules()
    },
    refreshCode() {
      getCaptcha().then((res) => {
        this.formData.captchaKey = res.key
        this.formData.image = res.image
      })
    },
    resetIdentityFields(name) {
      this.$refs['form'].clearValidate([name])
    },
    typeChange(type) {
      this[type] = this[type] === 'password' ? 'text' : 'password'
    },
    setCountdown() {
      this.countdown = 60
      let countdownFn = setInterval(() => {
        this.countdown--
        if (this.countdown <= 0) {
          clearInterval(countdownFn)
        }
      }, 1000)
    },
    sendEmail() {
      let params = {
        phonenum: '',
        email: this.formData.email
      }
      return getCode(params)
        .then(() => {
          this.$message.success('验证码发送成功，请注意查收')
          this.setCountdown()
        })
        .catch(() => {
          // clearInterval(time)
          // this.identity.msgKey = false
        })
    },
    setupRules() {
      if (this.stepIndex === 0) {
        this.rules = {
          email: [
            { required: true, message: '请输入邮箱' },
            { type: 'email', message: '邮箱格式不正确' }
          ]
        }
      } else if (this.stepIndex == 1) {
        this.rules = {
          verification: [{ required: true, max: 6, message: '请输入6位验证码', trigger: 'blur' }]
        }
      } else if (this.stepIndex == 2) {
        this.rules = {
          restPassword: [
            { min: 6, max: 12, message: '密码长度需要满足6～12字符', required: true },
            {
              pattern: /(?!^\d+$)(?!^[A-Za-z]+$)(?!^[^A-Za-z0-9]+$)(?!^.*[\u4E00-\u9FA5].*$)^\S{6,16}$/,
              message: '密码需要包含字母、符号或数字中至少两项'
            },
            { validator: this.validatePass }
          ],
          againRestPassword: [{ validator: this.validatePass2, required: true }]
        }
      }
      setTimeout(() => {
        this.$refs.form.clearValidate()
      })
    },
    async nextStep() {
      await this.$refs.form.validate()
      if (this.stepIndex === 0) {
        await this.sendEmail()
        this.stepIndex++
        this.setupRules()
        return
      } else if (this.stepIndex === 1) {
        let params = {
          phonenum: '',
          smsCode: this.formData.verification,
          email: this.formData.email
          // captchaCode: this.formData.captchaCode,
          // captchaKey: this.formData.captchaKey
        }
        checkPhoneCode(params).then((res) => {
          this.stepIndex++
          this.userId = res.userId
          this.setupRules()
          // this.step++
          // this.steps.firstStatus = 'success'
          // this.steps.secondStatus = 'finish'
        })
      } else if (this.stepIndex === 2) {
        let params = {
          userId: this.userId,
          newPassword: md5(this.formData.restPassword),
          oldPassword: '',
          phonenum: '',
          smsCode: this.formData.verification,
          email: this.formData.email
        }
        checkPassword(params).then(() => {
          this.successPageShow = true
          let setTimeOutObj = setInterval(() => {
            this.timeOutNum--
            if (this.timeOutNum < 0) {
              clearInterval(setTimeOutObj)
              this.resetData()
              this.$router.push({ path: '/login' })
            }
          }, 1000)
        })
      }
    },
    returnLogin() {
      this.$router.push({ path: '/home' })
    }
  }
}
</script>

<style lang="scss" scoped>
.forgetPassword {
  width: 1200px;
  margin: 20px auto;
  display: block;
  background: #ffffff;
  box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
  border-radius: 4px;
  padding-top: 1px;
  /deep/.el-steps {
    text-align: left;
    .el-step.is-horizontal .el-step__line {
      top: 15px;
      height: 1px;
    }
    .el-step__head {
      .el-step__icon {
        width: 32px;
        height: 32px;
        border: 1px solid;
      }
      &.is-wait {
        color: rgba($primaryFontColor, 0.45);
        border-color: #d9dbdc;
      }
      &.is-success {
        color: $primaryColor;
        border-color: $primaryColor;
        .el-step__line {
          background-color: $primaryColor;
        }
      }
      &.is-process {
        color: $primaryColor;
        border-color: $primaryColor;
        .el-step__line {
          background-color: $primaryColor;
        }
        .el-step__icon {
          background-color: $primaryColor;
        }
        .el-step__icon-inner {
          color: white;
        }
      }
    }
    .el-step__title {
      &.is-process,
      &.is-success {
        color: $primaryColor;
      }
    }
  }

  .title {
    font-size: 22px;
    color: rgba(0, 11, 21, 0.85);
    letter-spacing: 0;
    text-align: center;
    line-height: 34px;
    margin: 40px auto;
  }
  .layout_container {
    max-width: 800px;
    min-height: 600px;
    margin: auto;
    .layout_content {
      text-align: center;
      .layout_category {
        min-width: 400px;
        display: inline-block;
        text-align: left;
        .email-label {
          font-size: 14px;
          color: rgba($primaryFontColor, 0.65);
          letter-spacing: 0;
          line-height: 22px;
        }
        .el-step-content {
          font-size: 14px;
          padding-top: 40px;
          color: rgba(0, 11, 21, 0.45);
          letter-spacing: 0;
          line-height: 22px;
          a {
            color: $primaryColor;
          }
          .el-input {
            // width: 360px;
            width: 100%;
            margin-top: 8px;
            display: block;
            .el-icon-view {
              cursor: pointer;
              position: absolute;
              top: 50%;
              right: 5px;
              transform: translateY(-50%);
            }
          }
        }
        .subtitle-wr {
          margin-top: 16px;
          .subtitle {
            font-size: 14px;
            color: rgba($primaryFontColor, 0.65);
            letter-spacing: 0;
            line-height: 22px;
          }
          .countdown-wr {
            float: right;
          }
        }

        .nextStep {
          display: block;
          margin: 40px 0 24px 0;
        }
        .rebackLogin {
          font-size: 14px;
          color: $primaryColor;
          letter-spacing: 0;
          line-height: 22px;
        }
      }
    }
    .successPage {
      margin-top: 181px;
      text-align: center;
      .success-icon {
        font-size: 72px;
        margin-bottom: 24px;
      }

      & > p {
        margin: 0;
        &:nth-of-type(1) {
          font-size: 18px;
          color: rgba(0, 11, 21, 0.85);
          margin-bottom: 8px;
        }
        &:nth-of-type(2) {
          font-size: 14px;
          color: rgba(0, 11, 21, 0.45);
          margin-bottom: 16px;
        }
        &:nth-of-type(3) {
          font-size: 12px;
          color: rgba(0, 11, 21, 0.25);
          margin-bottom: 16px;
        }
      }
    }
    .login-code {
      padding-left: 10px;
    }
    .login-code-img {
      height: 34px;
      width: 100%;
      cursor: pointer;
      border: 1px solid #dcdfe6;
      box-sizing: border-box;
      vertical-align: middle;
      margin-left: 10px;
    }
    .test-code-input {
      margin-top: 0 !important;
    }
  }
}
</style>
