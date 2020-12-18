<template>
  <div class="footer">
    版权所有© 2020 上海易宝软件有限公司 苏ICP备09013856号-1
  </div>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style lang="scss" scoped>
.footer {
  opacity: 0.25;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #000b15;
  line-height: 18px;

  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
