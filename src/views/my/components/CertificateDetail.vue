<template>
  <div class="CertificateDetail">
    <div class="topBtn">
      <el-button>返回上一级</el-button>
      <el-button type="primary">
        下载证书
      </el-button>
    </div>

    <div class="title">
      证书名称（证书编号）
    </div>

    <div class="info">
      <span>颁发机构：{{ '易宝软件有限公司' }}</span>
      <span>发放时间：{{ '2020-02-15 14:00:22' }}</span>
    </div>

    <div class="name">
      完成java基础的学习，通过考核，掌握了该专业必备技能，特发此证。
    </div>

    <img
      :src="imgurl"
      alt=""
    />
  </div>
</template>

<script>
export default {
  name: 'CertificateDetail',
  data() {
    return {
      imgurl:
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1608289740056&di=00f8f4b767c42fa1c8548b4e6731e4e8&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201901%2F23%2F20190123150727_byuwj.jpg'
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
  img {
    width: 1152px;
    height: 815px;
    margin-top: 16px;
  }
}
</style>
