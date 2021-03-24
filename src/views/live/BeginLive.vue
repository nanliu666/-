<template>
  <div class="watchLiveCla">
    <iframe
      v-if="role !== 'Assistant'"
      :src="`https://live.polyv.net/web-start/classroom?channelId=${id}`"
      frameborder="0"
      allow="microphone; camera"
      allowfullscreen="true"
    ></iframe>
    <iframe
      v-else
      src="https://live.polyv.net/teacher.html"
      frameborder="0"
      allow="microphone; camera"
      allowfullscreen="true"
    ></iframe>
  </div>
</template>
<script>
export default {
  name: 'WatchLive',
  data() {
    return {
      id: this.$route.query.beginId,
      role: this.$route.query.roleName
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
