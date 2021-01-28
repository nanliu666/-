<template>
  <div class="watchLiveCla">
    <iframe
      :src="`https://live.polyv.net/web-start/?channelId=2095856`"
      frameborder="0"
      allowfullscreen="true"
    ></iframe>
  </div>
</template>
<script>
export default {
  name: 'WatchLive',
  data() {
    return {}
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
