<template>
  <div class="intro">
    <div class="title">培训详情</div>
    <div class="intro-content" v-html="innerText"></div>
  </div>
</template>

<script>
export default {
  name: 'Intro',
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      innerText: ''
    }
  },
  created() {
    this.handleDate()
  },
  methods: {
    handleDate() {
      this.innerText = _.unescape(this.data.introduction)
    }
  }
}
</script>

<style lang="scss" scoped>
.intro {
  .title {
    border-left: 4px solid rgba(1, 170, 252, 1);
    text-indent: 8px;
    font-size: 14px;
    color: rgba(0, 11, 21, 0.85);
    margin-bottom: 16px;
  }
}
</style>

<style>
.intro .intro-content p {
  opacity: 0.65 !important;
  font-family: PingFangSC-Regular !important;
  font-size: 14px !important;
  color: #000b15 !important;
  line-height: 22px !important;
  margin: 0 !important;
}
</style>
