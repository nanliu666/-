<template>
  <div class="publishedReply">
    <div class="publishedReply-title">发表回复</div>
    <div class="publishedReply-content">
      <el-input
        v-model="content"
        type="textarea"
        :rows="4"
        placeholder="说点什么吧"
        maxlength="500"
        show-word-limit
        resize="none"
        clearable
      >
      </el-input>
    </div>
    <div class="publishedReply-content">
      <common-upload
        v-model="imgUrl"
        :before-upload="beforeUpload"
        :multiple="true"
        :limit="9"
        list-type="picture-card"
        :show-file-list="true"
        :on-remove="
          (file, fileList) => {
            handleRemove(file, fileList)
          }
        "
        @on-masterFileMax="masterFileMax"
      >
        <template #default>
          <i class="iconfont iconimage_icon_export"></i>
          <div class="tip">上传图片</div>
        </template>
      </common-upload>
    </div>
    <el-button type="primary" style="margin-top: 30px" :loading="loading" @click="releasePost"
      >发布</el-button
    >
    <!-- 检查禁言模态框 -->
    <banned-judgment ref="bannedJudgment"></banned-judgment>
  </div>
</template>

<script>
import { replyTopic } from '@/api/community'
import bannedJudgment from './bannedJudgment.vue'
export default {
  name: 'PublishedReply',
  components: {
    CommonUpload: () => import('@/components/common-upload/CommonUpload'),
    bannedJudgment
  },
  data() {
    return {
      content: '',
      imgUrl: [],
      loading: false
    }
  },
  methods: {
    // 上传图片校验
    beforeUpload(file) {
      let types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      const isImage = types.includes(file.type)
      const isLt5M = file.size / 1024 / 1024 < 5

      if (!isLt5M) {
        this.$message.error('上传图片大小不能超过 5MB!')
        return false
      }
      if (!isImage) {
        this.$message.error('上传图片只支持jpg|jpge|png|GIF文件')
        return false
      }
      return true
    },
    masterFileMax() {
      this.$message.warning('单次最多只能上传9张图片')
    },
    // 移除图片
    handleRemove(file, fileList) {
      this.imgUrl = fileList.filter((v) => v.fileName)
    },
    // 发表回复
    releasePost: _.debounce(async function () {
      // 判断是否禁言
      await this.$refs.bannedJudgment.checkBanned(this.$route.query.areaId)
      if (this.$refs.bannedJudgment.flagBanned) return
      let params = {
        topicId: this.$route.query.topicId,
        content: this.content,
        imgUrl: this.imgUrl.map((v) => v.fileUrl).join(','),
        parentId: 0,
        userToId: this.$route.query.userId
      }
      //   回复消息不能为空
      if (!this.content) {
        this.$message.warning('回复内容不能为空!')
        return
      }
      this.loading = true
      await replyTopic(params)
        .then(() => {
          this.content = ''
          this.imgUrl = []
          this.$message.success('发表成功!')
          this.$emit('initData')
        })
        .finally(() => {
          this.loading = false
        })
    }, 300)
  }
}
</script>

<style lang="scss" scoped>
.publishedReply {
  padding: 10px 25px 30px;
  &-title {
    font-size: 18px;
    color: rgba(0, 11, 21, 0.85);
    font-weight: bold;
  }
  &-content {
    margin-top: 20px;
    /deep/ .el-upload-list--picture-card .el-upload-list__item {
      width: 100px;
      height: 100px;
    }
    /deep/ .el-upload--picture-card {
      width: 100px;
      height: 100px;
      background-color: #ffffff;
      line-height: 0;
      .iconfont {
        line-height: 70px;
        color: #8c9195;
      }
      .tip {
        font-size: 14px;
        color: rgba(0, 11, 21, 0.45);
      }
    }
  }
}
</style>
