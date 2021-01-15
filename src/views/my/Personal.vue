<template>
  <div class="personal">
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item>个人中心</el-breadcrumb-item>
      <el-breadcrumb-item>编辑信息</el-breadcrumb-item>
      <el-breadcrumb-item>
        <span class="breadcrumb3">个人信息</span>
      </el-breadcrumb-item>
    </el-breadcrumb>

    <div class="content">
      <div class="content_title">
        <span :class="{ pitch: pitch === 0 }" style="cursor:pointer;" @click="showpitch(0)">个人信息</span>
        <span :class="{ pitch: pitch === 1 }" style="cursor:pointer;" @click="showpitch(1)">修改密码</span>
      </div>

      <div class="routerinfo">
        <personalInfo v-if="!pitch"></personalInfo>
        <change-password v-else></change-password>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Personal',
  components: {
    ChangePassword: () => import('./components/ChangePassword'),
    personalInfo: () => import('./components/PersonalInfo')
  },
  data() {
    return {
      pitch: this.$route.query.pitch || 0
    }
  },
  watch: {
    'this.$route.query.pitch': function() {
      this.pitch = this.$route.query.pitch
    }
  },
  methods: {
    showpitch(i) {
      this.pitch = i
    }
  }
}
</script>

<style lang="scss" scoped>
.personal {
  .breadcrumb {
    font-size: 14px;
    color: rgba(0, 11, 21, 0.45);
    line-height: 22px;
    margin-top: 24px;
    .breadcrumb3 {
      color: rgba(0, 11, 21, 0.85) !important;
      font-weight: 600;
    }
  }
  .content {
    margin-top: 16px;
    width: 1200px;
    height: 934px;
    background: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
    border-radius: 4px;
    padding: 24px;
    .content_title {
      height: 56px;
      border-bottom: 1px solid #ebeced;
      display: flex;
      span {
        margin-right: 40px;
        opacity: 0.65;
        font-size: 16px;
        color: #000b15;
        line-height: 56px;
        height: 56px;
      }
      .pitch {
        border-bottom: 2px solid #01aafc;
        color: #01aafc;
        font-weight: bold;
      }
    }

    .routerinfo {
    }
  }
}
</style>
