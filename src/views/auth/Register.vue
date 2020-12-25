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
      </common-form>
    </div>
  </div>
</template>

<script>
// import { userRegister } from '@/api/user'
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
        userEmail: '', // 用户邮箱
        captchaCode: '' // 验证码
      },
      columns: []
    }
  }
}
</script>

<style></style>
