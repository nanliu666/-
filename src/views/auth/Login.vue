<template>
  <div class="login">
    <div class="login_container">
      <div class="layout_left">
        <img
          class="hellWelcom"
          src="../../assets/images/HelloWelcome.svg"
          alt=""
        />
        <span>欢迎登录ePRO Learning易宝人才培育系统软件</span>
      </div>
      <div class="layout_right">
        <div class="layout_label">
          账号登录
        </div>
        <el-form
          ref="loginForm"
          class="login-form"
          status-icon
          :rules="loginRules"
          :model="loginForm"
          label-width="0"
          size="medium"
        >
          <el-form-item prop="account">
            <el-input
              v-model="loginForm.account"
              auto-complete="off"
              :maxlength="11"
              placeholder="请输入手机号码"
              @keyup.enter.native="handleLogin"
            />
          </el-form-item>
          <el-form-item prop="password">
            <pass-input
              v-model="loginForm.password"
              placeholder="请输入密码"
              onpaste="return false"
              oncontextmenu="return false"
              oncopy="return false"
              oncut="return false"
            >
            </pass-input>
          </el-form-item>
          <el-form-item prop="code">
            <el-row :span="24">
              <el-col :span="16">
                <el-input
                  v-model="loginForm.code"
                  auto-complete="off"
                  placeholder="请输入验证码"
                  @keyup.enter.native="handleLogin"
                />
              </el-col>
              <el-col :span="8">
                <div class="login-code">
                  <img
                    :src="loginForm.image"
                    class="login-code-img"
                    @click="refreshCode"
                  />
                </div>
              </el-col>
            </el-row>
          </el-form-item>

          <el-button
            class="loginBtn"
            type="primary"
            @click="handleLogin()"
          >
            登录
          </el-button>
          <div class="layout_opations">
            <router-link
              to="/register"
              tag="span"
            >
              立即注册
            </router-link>
            <router-link
              to="/forgetPassword"
              tag="span"
            >
              忘记密码?
            </router-link>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { getCaptcha, getTenantInfo } from '@/api/user'
import PassInput from '@/components/pass-input/PassInput'
export default {
  name: 'Home',
  components: { PassInput },
  data() {
    return {
      loginForm: {
        // 工号登录
        account: '',
        //租户ID
        tenantId: '',

        //密码
        password: '',
        //账户类型
        type: 'account',
        //验证码的值
        code: '',
        //验证码的索引
        key: '',
        //预加载白色背景
        image: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
      },
      passwordInputType: 'password',
      loginRules: {
        account: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^[0-9]{11}$/, message: '请输入合法的手机号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 1, message: '密码长度最少为6位', trigger: 'blur' }
        ],
        code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getTenant()
    this.refreshCode()
  },
  methods: {
    getTenant() {
      let domain =
        process.env.NODE_ENV === 'development' ? 'www.bestgrand.com.cn' : window.location.host
      domain = process.env.NODE_ENV === 'development' ? 'apitest.epro.com.cn' : window.location.host
      domain =
        process.env.NODE_ENV === 'development' ? '139.159.141.248:8081' : window.location.host
      getTenantInfo({ domain: `${domain}` }).then((res) => {
        this.loginForm.tenantId = res.tenantId || 'bestgrand'
        this.$store.commit('SET_TENANT_CONTENT', JSON.stringify(res))
        this.$store.commit('SET_TENANT_ID', res.tenantId)
      })
      // 临时指定域名，方便测试
      //domain = "https://bladex.vip";
      // info(domain).then((res) => {
      //   const data = res.data
      //   if (data.success && data.data.tenantId) {
      //     this.tenantMode = false
      //     this.loginForm.tenantId = data.data.tenantId
      //     this.$parent.$refs.login.style.backgroundImage = `url(${data.data.backgroundUrl})`
      //   }
      // })
    },
    inputTypeChange() {
      // 忘记密码眼睛点击
      this.passwordInputType = this.passwordInputType === 'password' ? 'text' : 'password'
    },
    handleLogin() {
      // 登录
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: '登录中,请稍后...',
            spinner: 'el-icon-loading'
          })

          this.$store
            .dispatch('LoginByUsername', this.loginForm)
            .then(() => {
              let path = this.$route.query.previewUrl
                ? decodeURI(this.$route.query.previewUrl)
                : '/home'
              this.$router.push({ path })
              // this.$store.dispatch('GetUserPrivilege', res.user_id).then((menu) => {
              //   this.$router.$avueRouter.formatRoutes(menu, true)
              // })
              loading.close()
            })
            .catch(() => {
              loading.close()
              this.refreshCode()
            })
        }
      })
    },
    refreshCode() {
      getCaptcha().then((res) => {
        this.loginForm.key = res.key
        this.loginForm.image = res.image
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  .login_container {
    position: relative;
    margin-top: 20px;
    display: table;
    background: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
    border-radius: 4px;
    .layout_left {
      width: 700px;
      display: table-cell;
      background: url(../../assets/images/welcome.png) no-repeat;
      background-size: cover;
      text-align: center;
      font-size: 16px;
      color: #ffffff;
      /deep/.hellWelcom {
        font-size: 421px;
        height: auto;
        display: block;
        margin: 164px auto 16px auto;
      }
    }
    .layout_right {
      width: 500px;
      display: table-cell;
      vertical-align: top;
      text-align: center;
      padding: 0 72px;
      box-sizing: border-box;
      .layout_label {
        font-size: 22px;
        color: rgba(0, 11, 21, 0.85);
        margin: 114px 0 48px 0;
      }
      .el-input {
        // margin-bottom: 16px;
        position: relative;
        .el-icon-view {
          cursor: pointer;
          position: absolute;
          top: 50%;
          right: 5px;
          transform: translateY(-50%);
        }
      }
      .el-col {
        margin-bottom: 0;
      }
      .loginBtn {
        width: 100%;
        margin: 8px 0 16px 0;
      }
      .layout_opations {
        font-size: 12px;
        color: rgba(0, 11, 21, 0.65);
        text-align: left;
        margin-bottom: 210px;
        span {
          cursor: pointer;
          display: inline-block;
          &:nth-child(2) {
            float: right;
          }
          &::after {
            content: '';
            display: block;
            clear: both;
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
      }
    }
  }
}
</style>
