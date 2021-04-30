<template>
  <div class="watchLiveCla">
    <iframe :src="getUrl" frameborder="0" allowfullscreen="true"></iframe>
  </div>
</template>
<script>
import md5 from 'js-md5'
export default {
  name: 'WatchLive',
  data() {
    return {
      // id: this.$route.query.wId
    }
  },
  computed: {
    getUrl() {
      let ts = new Date().getTime()
      let { userid, sk, avatar, userName, wId, type } = this.$route.query
      let sign = sk + userid + sk + ts
      sign = md5(sign)
      let url = `https://live-watch.epro-edu.com/watch/${wId}`
      url =
        type === 'direct'
          ? url +
            `?userid=${userid}&ts=${ts}&sign=${sign}&nickname=${decodeURIComponent(
              userName
            )}&avatar=${avatar}`
          : url
      return url
    }
  }
}
</script>
<style lang="scss" scoped>
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
.watchLiveCla {
  height: 100%;
}
iframe {
  margin: 0 auto;
  display: block;
  width: 100%;
  height: 100%;
}
</style>
