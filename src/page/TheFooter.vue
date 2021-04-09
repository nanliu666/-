<template>
  <div class="footer">
    <span>v2.1.0_20210410_Release &nbsp; &nbsp; &nbsp;</span>
    <span class="policeLogo"><img src="../../public/img/policeLogo.png" alt="" /></span>
    <span><a href="https://ythzxfw.miit.gov.cn" target="_blank"> 备案号：苏ICP备19010525号-2 </a></span>
  </div>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style lang="scss" scoped>
.footer {
  text-align: center;
  height: 40px;
  line-height: 40px;
  // opacity: 0.25;
  width: 100vw;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #000b15;
  display: flex;
  justify-content: center;
  span {
    opacity: 0.25;
  }
  .policeLogo {
    margin-right: 10px;
    opacity: 1;
    img {
      margin-top: 10px;
    }
  }
}
</style>
