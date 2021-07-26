<template>
  <div class="watchLiveCla">
    <iframe
      :src="baseBeginUrl[role]"
      frameborder="0"
      allow="microphone; camera"
      allowfullscreen="true"
    ></iframe>
    <!-- <iframe
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
    ></iframe> -->
  </div>
</template>
<script>
import { getSonChannelToken, getChannelToken } from '@/api/live'
export default {
  name: 'WatchLive',
  data() {
    return {
      id: this.$route.query.beginId,
      role: this.$route.query.roleName,
      baseBeginUrl: {
        Lecturer: `https://live.polyv.net/web-start/classroom?channelId=${this.$route.query.beginId}`, //主讲师
        Guest: `https://live.polyv.net/web-start/guest?channelId=${this.$route.query.beginId}`, //   嘉宾
        Assistant: 'https://live.polyv.net/assistant.html' //助教
      }
    }
  },
  created() {
    if (!this.$route.query.reLink) {
      this.role == 'Lecturer' ? this.getChannelTokenFn() : this.getSonChannelTokenFn()
    }
  },
  methods: {
    getSonChannelTokenFn() {
      // 获取子频道单点登陆token-D
      let origin = window.location.origin
      let sendData = {
        account: this.id,
        redirect: encodeURIComponent(
          `${origin}/#/beginLive?beginId=${this.id}&roleName=${this.role}`
        )
      }
      getSonChannelToken(sendData).then((res) => {
        this.reLinkFn(res)
      })
    },
    getChannelTokenFn() {
      // 获取频道单点登陆token-D
      let origin = window.location.origin
      let sendData = {
        channelId: this.id,
        redirect: encodeURIComponent(
          `${origin}/#/beginLive?beginId=${this.id}&roleName=${this.role}`
        )
      }
      getChannelToken(sendData).then((res) => {
        this.reLinkFn(res)
      })
    },
    // // authLoginFn(token){ // 成功设置token接口后，调用单点登录后台接口进行授权登录操作。
    // //   let sendData={channelId:this.id,token:token,redirect:encodeURIComponent(`https://user-test.epro-edu.com/#/beginLive?beginId=${this.id}&roleName=${this.role}`)}
    // //   authLogin(sendData).then((res)=>{
    // //      console.log(res,'444')
    // //   })
    // // },
    reLinkFn(res) {
      let origin = window.location.origin
      let url = encodeURIComponent(
        `${origin}/#/beginLive?beginId=${this.id}&roleName=${this.role}&reLink=1`
      )
      // 测试 let url = this.baseBeginUrl[this.$route.query.roleName]
      window.open(
        `https://live.polyv.net/teacher/auth-login?channelId=${this.id}&token=${res}&redirect=${url}`,
        '_self'
      )
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
