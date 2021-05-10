<template>
  <div class="watchLiveCla">
    <iframe
      v-if="role !== 'Assistant'"
      :src="liveUrl"
      frameborder="0"
      allow="microphone; camera"
      allowfullscreen="true"
    ></iframe>
    <iframe
      v-else
      :src="teacherUrl"
      frameborder="0"
      allow="microphone; camera"
      allowfullscreen="true"
    ></iframe>
  </div>
</template>
<script>
import { liveBaseUrl } from '@/config/env'
export default {
  name: 'WatchLive',
  data() {
    return {
      id: this.$route.query.beginId,
      role: this.$route.query.roleName
    }
  },
  computed: {
    teacherUrl() {
      return `${liveBaseUrl}/teacher.html`
    },
    liveUrl() {
      return `${liveBaseUrl}/web-start/classroom?channelId=${this.id}`
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
