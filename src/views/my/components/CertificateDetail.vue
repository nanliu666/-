<template>
  <div class="CertificateDetail">
    <div class="topBtn">
      <el-button @click="toCertificate">
        返回上一级
      </el-button>
      <el-button type="primary">
        下载证书
      </el-button>
    </div>

    <div class="title">{{ sondata.templateName }}（{{ sondata.certificateNo }}）</div>

    <div class="info">
      <span>颁发机构：{{ currentstr }}</span>
      <span>发放时间：{{ sondata.grantTime }}</span>
    </div>

    <div class="name">
      {{ sondata.templateName }}
    </div>

    <div class="preview_right_in">
      <div class="preview_right_box">
        <img :src="sondata.backUrl" alt="" class="bgimg" />
        <div class="name">
          {{ sondata.templateName }}
        </div>
        <div class="text">
          {{ sondata.text }}
        </div>
        <img :src="sondata.logoUrl" alt="" class="logo" />
        <div class="studentName">
          {{ sondata.stuName }}
        </div>
        <div class="serial">
          <div>证书编号:</div>
          <div>{{ currentstr }}-{{ serialNumber }}</div>
          <div>{{ sondata.grantTime }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { pinyin } from 'pinyin-pro'
export default {
  name: 'CertificateDetail',
  props: ['sondata'],
  data() {
    return {
      CertificateNumberInitials: '',
      serialNumber: ''
    }
  },
  watch: {
    sondata(newVal) {
      let currentstr = pinyin(newVal.awardAgency, { pattern: 'initial', type: 'array' })
        .splice(0, 2)
        .join('')
        .toUpperCase()
      this.CertificateNumberInitials = currentstr ? currentstr : 'YB'
      let currentArr = this.sondata.certificateNo.split('-')
      this.serialNumber = `${currentArr[1]}-${currentArr[2]}`
    }
  },
  methods: {
    toCertificate() {
      this.$emit('ChangeBtn', true)
    }
  }
}
</script>

<style lang="scss" scoped>
.CertificateDetail {
  background-color: #fff;
  margin-top: 20px;
  padding: 24px;
  .topBtn {
    display: flex;
    justify-content: space-between;
  }
  .title {
    font-size: 14px;
    color: rgba(0, 11, 21, 0.85);
    letter-spacing: 0;
    margin-top: 40px;
  }
  .info {
    display: flex;
    padding: 8px 0 20px;
    border-bottom: 1px solid #ebeced;
    span {
      margin-right: 16px;
      font-size: 14px;
      color: rgba(0, 11, 21, 0.45);
      letter-spacing: 0;
    }
  }
  .name {
    font-size: 14px;
    color: rgba(0, 11, 21, 0.85);
    letter-spacing: 0;
    margin-top: 20px;
  }

  .preview_right_in {
    //   padding-left: 50px;
    //   padding-top: 20px;
    width: 1152px;
    height: 815px;
    margin-top: 16px;
    .preview_right_box {
      position: relative;
      border: 1px solid #d9dbdc;
      margin-top: 15px;
      width: 100%;
      height: 100%;
      .bgimg {
        width: 100%;
        height: 100%;
        z-index: -1;
      }
      .name {
        position: absolute;
        top: 146px;
        left: 50%;
        font-size: 64px;
        color: #ab856a;
        transform: translateX(-50%);
        text-align: center;
        width: 80%;
        font-weight: 600;
      }
      .text {
        position: absolute;
        top: 490px;
        left: 50%;
        transform: translateX(-50%);
        width: 50%;
        height: 28%;

        opacity: 0.65;
        font-size: 18px;
        color: #000b15;
        text-align: center;
        line-height: 28px;
      }
      .logo {
        position: absolute;
        top: 622px;
        left: 50%;
        transform: translateX(-50%);
        width: 112px;
        height: 112px;
      }
      .studentName {
        position: absolute;
        top: 386px;
        left: 50%;
        transform: translateX(-50%);
        opacity: 0.85;
        font-size: 40px;
        color: #000b15;
        text-align: center;
      }
      .serial {
        position: absolute;
        right: 117px;
        bottom: 80px;
        font-size: 14px;
        color: rgba(0, 11, 21, 0.45);
        line-height: 28px;
      }
    }
  }
}
</style>
