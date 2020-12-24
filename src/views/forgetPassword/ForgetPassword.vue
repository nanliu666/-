<template>
  <!-- 忘记密码 -->
  <div
    id="forgetPassword"
    class="forgetPassword"
  >
    <div
      v-if="!successPageShow"
      class="layout_label"
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
            ref="formRef"
            :rules="rules"
            :model="formData"
          >
            <div
              v-show="stepIndex == 0"
              class="el-step-content"
            >
              通过邮箱找回密码<br />
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
              您正在对<a href="javascript:void(0);">{{ formData.email }}</a>进行找回密码操作,请先进行验证:<br />
              <span>去邮箱查看,输入验证码</span>
              <el-form-item prop="verification">
                <el-input
                  v-model="formData.verification"
                  placeholder="请输入验证码"
                ></el-input>
              </el-form-item>
              <el-form-item prop="captchaCode">
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
              </el-form-item>
            </div>
            <div
              v-show="stepIndex == 2"
              class="el-step-content"
            >
              请输入重置的密码
              <el-form-item prop="restPassword">
                <el-input
                  v-model="formData.restPassword"
                  :type="resetType"
                  placeholder="请输入重置的密码"
                >
                  <i
                    slot="suffix"
                    class="el-icon-view"
                    @click="typeChange('resetType')"
                  ></i>
                </el-input>
              </el-form-item>
              <span>密码包含字母、符号或数字中至少两项且长度6～12字符的密码</span>
              <el-form-item prop="againRestPassword">
                <el-input
                  v-model="formData.againRestPassword"
                  :type="againType"
                  placeholder="请再次输入重置的密码"
                >
                  <i
                    slot="suffix"
                    class="el-icon-view"
                    @click="typeChange('againType')"
                  ></i>
                </el-input>
              </el-form-item>
            </div>
            <el-button
              class="nextStep"
              type="primary"
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
        <i class="el-icon-success"></i>
        <p>设置成功</p>
        <p>新密码设置成功，请牢记您的密码</p>
        <p>{{ timeOutNum }}秒后自动返回</p>
        <el-button
          type="primary"
          @click="returnLogin"
        >
          返回
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { validatePW, isEmailReg } from '@/util/validate'
import { getCode, checkPhoneCode, checkPassword, getCaptcha } from '@/api/user.js'
import md5 from 'js-md5'
export default {
  data() {
    let _this = this
    const validateEmail = (rule, value, callback) => {
      if (!rule.required) {
        callback()
      }
      if (!_this.formData.email) {
        callback(new Error('请输入邮箱'))
      } else if (_this.formData.email && !isEmailReg(value)) {
        callback(new Error('邮箱格式不正确'))
      } else {
        callback()
      }
    }
    const validateCode = (rule, value, callback) => {
      if (!rule.required) {
        callback()
      }
      if (!_this.formData.verification) {
        callback(new Error('请输入六位验证码'))
      } else {
        callback()
      }
    }
    const validateNewPW = (rule, value, callback) => {
      if (!rule.required) {
        callback()
      }
      if (value.length < 6) {
        callback(new Error('密码不能少于6个字符'))
      } else if (_this.formData.restPassword && value.indexOf(' ') !== -1) {
        callback(new Error('密码不能包含空格'))
      } else if (_this.formData.restPassword && !validatePW(value)) {
        callback(new Error('密码必须包含字母，符号或数字中至少两项'))
      } else {
        callback()
      }
    }
    const validateRepeatPW = (rule, value, callback) => {
      if (!rule.required) {
        callback()
      }
      if (_this.formData.restPassword != _this.formData.againRestPassword) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    return {
      stepIndex: 0, // 步骤
      formData: {
        email: '', // 邮箱
        verification: '', // 短信验证码
        restPassword: '', // 重置密码的val
        againRestPassword: '', // 再次输入的val
        captchaCode: '', // 验证码
        image: '', // 验证码默认图片
        captchaKey: '' // 验证码的key
      },
      resetType: 'password', // 重置密码框输入框类型
      againType: 'password', // 再次输入密码框输入框类型
      successPageShow: false, // 成功页面标记
      timeOutNum: 5, // 时间倒计时
      userId: '',
      rules: {
        email: [{ required: true, validator: validateEmail, trigger: 'blur' }],
        captchaCode: [{ required: false, message: '请输入图片验证码', trigger: 'blur' }],
        verification: [{ required: false, validator: validateCode, trigger: 'blur' }],
        restPassword: [{ required: false, validator: validateNewPW, trigger: 'blur' }],
        againRestPassword: [{ required: false, validator: validateRepeatPW, trigger: 'blur' }]
      }
    }
  },
  created() {
    this.refreshCode()
  },
  beforeDestroy() {
    this.successPageShow = false
    this.stepIndex = 0
  },
  methods: {
    refreshCode() {
      getCaptcha().then((res) => {
        this.formData.captchaKey = res.key
        this.formData.image = res.image
      })
    },
    resetIdentityFields(name) {
      this.$refs['formRef'].clearValidate([name])
    },
    typeChange(type) {
      this[type] = this[type] === 'password' ? 'text' : 'password'
    },
    nextStep() {
      if (this.stepIndex === 1) {
        this.rules.verification[0].required = true // 把验证码的验证放开
        this.rules.captchaCode[0].required = true
      }
      if (this.stepIndex === 2) {
        this.rules.restPassword[0].required = true
        this.rules.againRestPassword[0].required = true
      }
      this.$refs.formRef.validate((valite) => {
        if (!valite) {
          return
        }
        if (this.stepIndex === 0) {
          let params = {
            phonenum: '',
            email: this.formData.email
          }
          getCode(params)
            .then(() => {
              this.$message.success('验证码发送成功，请注意查收')
              this.stepIndex++
            })
            .catch(() => {
              // clearInterval(time)
              // this.identity.msgKey = false
            })
          return
        } else if (this.stepIndex === 1) {
          let params = {
            phonenum: '',
            smsCode: this.formData.verification,
            email: this.formData.email,
            captchaCode: this.formData.captchaCode,
            captchaKey: this.formData.captchaKey
          }
          checkPhoneCode(params).then((res) => {
            this.stepIndex++
            this.userId = res.userId
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
                this.$router.push({ path: '/home' })
              }
            }, 1000)
          })
        }
      })
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
  .el-step {
    text-align: left;
  }
  .layout_label {
    font-size: 22px;
    color: rgba(0, 11, 21, 0.85);
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
        .el-step-content {
          font-size: 14px;
          padding-top: 40px;
          text-align: left;
          &:nth-child(1) {
            color: rgba(0, 11, 21, 0.65);
            line-height: 22px;
          }
          &:nth-child(2) {
            color: rgba(0, 11, 21, 0.45);
            a {
              color: #01aafc;
            }
            & > span {
              display: block;
              margin: 16px 0 8px 0;
              color: rgba(0, 11, 21, 0.65);
            }
          }
          &:nth-child(3) {
            color: rgba(0, 11, 21, 0.65);
            & > span {
              font-size: 12px;
              color: rgba(0, 11, 21, 0.25);
              display: block;
              margin: 8px 0;
            }
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
        .nextStep {
          display: block !important;
          margin: 40px 0 24px 0 !important;
        }
        .rebackLogin {
          font-size: 12px;
          color: #01aafc;
          cursor: pointer;
        }
      }
    }
    .successPage {
      margin-top: 181px;
      text-align: center;
      & > i {
        font-size: 64px;
        color: #00d66f;
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
