<template>
  <el-dialog
    title="提示"
    :visible.sync="countdownDialog"
    :show-close="false"
    :close-on-click-modal="true"
    :close-on-press-escape="false"
    width="400px"
    :destroy-on-close="true"
    custom-class="countdownDialog"
  >
    <span style="font-size: 14px"
      ><i
        class="el-icon-warning"
        style="color: #e6a23c; font-size: 24px; margin-right: 12px; vertical-align: middle"
      ></i
      >您已被禁言，剩余时间{{ this.countdown(this.forbitEndTime) }}</span
    >
    <span slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        size="mini"
        @click="
          countdownDialog = false
          flagBanned = false
        "
        >确定</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import { checkForbidPost } from '@/api/community'
export default {
  data() {
    return {
      timer: null, // 禁言定时器
      forbitEndTime: 0,
      countdownDialog: false, // 模态框
      flagBanned: false
    }
  },
  methods: {
    // 检查用户是否禁言
    async checkBanned(areaId) {
      await checkForbidPost({ areaId: areaId }).then((res) => {
        //   如果没有禁言返回空对象,有禁言则返回一条数据
        if (Object.keys(res).length) {
          this.forbitEndTime = new Date(res.endTime).getTime() - new Date().getTime()
          if (this.timer) {
            //这一段是防止进入页面出去后再进来计时器重复启动
            clearInterval(this.timer)
          }
          this.beginTimer()
          this.countdownDialog = true
          this.flagBanned = true
        } else {
          this.flagBanned = false
        }
      })
    },
    beginTimer() {
      //这个计时器是每秒减去数组中指定字段的时间
      this.timer = setInterval(() => {
        if (this.forbitEndTime > 0) {
          this.forbitEndTime = this.forbitEndTime - 1000
        } else {
          this.countdownDialog = false
        }
      }, 1000)
    },
    countdown(timeStamp) {
      let result = ''
      let days = Math.floor(timeStamp / 1000 / 60 / 60 / 24) //获取天数
      let hours = Math.floor((timeStamp / 1000 / 60 / 60) % 24) // 获取小时
      let minutes = Math.floor((timeStamp / 1000 / 60) % 60) //获取分钟数
      let seconds = Math.floor((timeStamp / 1000) % 60) //获取秒数
      //   不到10前面加0
      const checkTime = (i) => {
        //将0-9的数字前面加上0，例1变为01
        if (i < 10) {
          i = '0' + i
        }
        return i
      }
      days = checkTime(days)
      hours = checkTime(hours)
      minutes = checkTime(minutes)
      seconds = checkTime(seconds)
      // 判断天、时、分、秒;
      if (days > 0) {
        result = `${days}天${hours}时${minutes}分${seconds}秒`
      } else {
        if (hours > 0) {
          result = `${hours}时${minutes}分${seconds}秒`
        } else {
          if (minutes > 0) {
            result = `${minutes}分${seconds}秒`
          } else {
            if (seconds >= 0) {
              result = `${seconds}秒`
            }
          }
        }
      }
      return result
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .countdownDialog {
  border-radius: 4px;
  .el-dialog__body {
    padding: 10px 20px;
  }
}
</style>
