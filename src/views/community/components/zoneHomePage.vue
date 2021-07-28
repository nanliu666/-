<template>
  <div class="zoneHomePage">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/" style="padding: 25px 0 20px">
      <el-breadcrumb-item
        ><span @click="goBack" style="cursor: pointer; font-weight: bold"
          >推荐</span
        ></el-breadcrumb-item
      >
      <el-breadcrumb-item>{{ zoneInfomation.name || '' }}</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主体内容 -->
    <el-card shadow="never" :body-style="{ padding: 0 }">
      <div v-loading="zoneLoading">
        <!-- 顶部 -->
        <div
          class="top-header"
          :style="{
            background: `url(${zoneInfomation.coverPic}) 0% 0%/100% 100% no-repeat`
          }"
        ></div>
        <!-- 社区信息 -->
        <div class="zoneView">
          <div class="zoneTip">
            <el-image
              style="width: 150px; height: 150px; border-radius: 50%"
              :src="zoneInfomation.headImg"
            ></el-image>
          </div>
          <el-row
            type="flex"
            justify="space-between"
            style="align-items: center; margin-left: 180px"
          >
            <div class="box-left">
              <el-row type="flex" style="align-items: flex-end">
                <div class="name">{{ zoneInfomation.name || '' }}</div>
                <div class="focuson">
                  关注：<span class="num">{{ zoneInfomation.totalFocus || 0 }}</span>
                </div>
                <div class="focuson">
                  帖子：<span class="num">{{ zoneInfomation.totalTopic || 0 }}</span>
                </div>
              </el-row>
              <div class="describe">
                <el-tooltip
                  effect="dark"
                  :content="zoneInfomation.introduce"
                  placement="top"
                  :manual="zoneInfomation.introduce && zoneInfomation.introduce.length <= 50"
                >
                  <span>{{
                    zoneInfomation.introduce && zoneInfomation.introduce.length > 50
                      ? zoneInfomation.introduce.slice(0, 50) + '...'
                      : zoneInfomation.introduce
                  }}</span>
                </el-tooltip>
              </div>
            </div>
            <el-button
              :type="zoneInfomation.focus ? '' : 'primary'"
              size="medium"
              style="width: 90px"
              :loading="focusLoading"
              @click.stop="attentionZone(zoneInfomation.focus)"
              >{{ zoneInfomation.focus ? '取消关注' : '+关注' }}</el-button
            >
          </el-row>
        </div>
      </div>
      <!-- 分割线 -->
      <el-divider></el-divider>
      <!-- tabs切换 -->
      <div class="zoneTabs">
        <el-tabs v-model="activeName" @tab-click="changeTabs">
          <el-tab-pane label="全部帖子" name="allPosts"> </el-tab-pane>
          <el-tab-pane label="专家帖" name="expertsPost"> </el-tab-pane>
          <el-tab-pane label="精品帖" name="threadPost"> </el-tab-pane>
        </el-tabs>
        <!-- 搜索框 -->
        <div class="search-input">
          <el-input
            v-model="keyword"
            placeholder="请输入您要查找的内容"
            style="width: 300px"
            clearable
            @input="searchTopic"
            size="small"
          ></el-input>
        </div>
      </div>
      <!-- 帖子列表 -->
      <post-list
        v-if="requestParameters.areaId"
        ref="postList"
        :show-page="true"
        :request-parameters="requestParameters"
        :show-expert="true"
        :is-show-tag="true"
        :is-show-top-tag="true"
      ></post-list>
      <!-- 发布帖子 -->
      <div class="releasePost">
        <div class="common-title" style="padding: 0 25px"><span class="tip"></span>发布帖子</div>
        <el-divider></el-divider>
        <el-row style="padding: 10px 25px 30px">
          <el-form ref="ruleForm" :model="postForm" :rules="rules">
            <el-col>
              <el-form-item prop="title" label="标题">
                <el-input
                  v-model="postForm.title"
                  placeholder="请填写标题"
                  maxlength="32"
                  show-word-limit
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item prop="content" label="内容">
                <el-input
                  v-model="postForm.content"
                  type="textarea"
                  :rows="4"
                  placeholder="说点什么吧"
                  maxlength="500"
                  show-word-limit
                  resize="none"
                  clearable
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-form>
          <el-col>
            <common-upload
              v-model="postForm.imgUrl"
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
          </el-col>
          <el-col style="margin-top: 20px">
            <el-button
              type="primary"
              style="margin-right: 20px"
              :loading="postLoading"
              @click="releasePost"
              >发布</el-button
            >
            <el-checkbox v-model="postForm.expertsChecked" v-if="zoneInfomation.isExpert"
              >求助专家（勾选后将会有专区专家为您进行解答）</el-checkbox
            >
          </el-col>
        </el-row>
      </div>
    </el-card>
    <!-- 检查禁言模态框 -->
    <banned-judgment ref="bannedJudgment"></banned-judgment>
  </div>
</template>

<script>
import postList from './postList.vue'
import { queryAreaDetail, addTopic, areaFollow, cancelAreaFollow } from '@/api/community'
import bannedJudgment from './bannedJudgment.vue'
export default {
  name: 'ZoneHomePage',
  components: {
    postList,
    CommonUpload: () => import('@/components/common-upload/CommonUpload'),
    bannedJudgment
  },
  data() {
    return {
      activeName: 'allPosts',
      postForm: {
        //发布帖子表单
        title: '',
        content: '',
        imgUrl: [],
        expertsChecked: false
      },
      rules: {
        title: [{ required: true, message: '请填写标题', trigger: 'blur' }],
        content: [{ required: true, message: '说点什么吧!', trigger: 'blur' }]
      },
      areaId: '', // 专区id
      zoneInfomation: {}, // 专区信息
      zoneLoading: false,
      postLoading: false,
      requestParameters: {},
      keyword: '', // 搜索关键词
      focusLoading: false
    }
  },
  activated() {
    if (this.$route.query.areaId) {
      this.areaId = this.$route.query.areaId
      this.requestParameters.areaId = this.areaId
      this.initAreaDetail()
    }
  },
  methods: {
    //   返回上一级
    goBack() {
      this.$router.go(-1) //返回上一层
    },
    // 获取专区详情
    async initAreaDetail() {
      this.zoneLoading = true
      await queryAreaDetail({ areaId: this.areaId })
        .then((res) => {
          this.zoneInfomation = res
        })
        .finally(() => {
          this.zoneLoading = false
        })
    },
    // 关注专区
    async attentionZone(flag) {
      // flag = 1 是关注,0未关注
      this.focusLoading = true
      if (flag) {
        // 取消关注
        await cancelAreaFollow(this.areaId)
          .then(() => {
            this.$set(this.zoneInfomation, 'focus', 0)
            this.$message.success('取消关注成功!')
          })
          .finally(() => {
            this.focusLoading = false
          })
      } else {
        // 关注
        await areaFollow(this.areaId)
          .then(() => {
            this.$set(this.zoneInfomation, 'focus', 1)
            this.$message.success('关注成功!')
          })
          .finally(() => {
            this.focusLoading = false
          })
      }
    },
    // 发布帖子
    releasePost: _.debounce(async function () {
      // 判断是否禁言
      await this.$refs.bannedJudgment.checkBanned(this.$route.query.areaId)
      if (this.$refs.bannedJudgment.flagBanned) return
      this.$refs.ruleForm.validate(async (valid) => {
        if (!valid) return
        let params = {
          title: this.postForm.title,
          content: this.postForm.content,
          areaId: this.areaId,
          imgUrl: this.postForm.imgUrl.map((v) => v.fileUrl).join(','),
          expertHelp: this.postForm.expertsChecked ? 1 : 0
        }
        this.postLoading = true
        await addTopic(params)
          .then(() => {
            this.postForm = {
              title: '',
              content: '',
              imgUrl: [],
              expertsChecked: false
            }
            this.$refs.postList.initTopic()
            // postRule,0:自动通过,1:人工审核
            this.$message.success(
              this.zoneInfomation.postRule
                ? '已提交专区管理员审核，通过后将会自动发布!'
                : '发布帖子成功!'
            )
          })
          .finally(() => {
            this.postLoading = false
          })
      })
    }, 300),
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
      this.postForm.imgUrl = fileList.filter((v) => v.fileName)
    },
    changeTabs() {
      this.requestParameters.isExpert = this.activeName == 'expertsPost' ? 'Y' : ''
      this.requestParameters.isFine = this.activeName == 'threadPost' ? 'Y' : ''
      this.$refs.postList.initTopic()
    },
    searchTopic: _.debounce(function (val) {
      this.requestParameters.content = val
      this.$refs.postList.initTopic()
    }, 300)
  }
}
</script>

<style lang="scss" scoped>
@import './commonTitle.scss';
.zoneHomePage {
  .top-header {
    width: 100%;
    height: 160px;
  }
  .zoneView {
    position: relative;
    font-size: 16px;
    margin: 15px 0 20px;
    padding: 0 25px;
    .zoneTip {
      position: absolute;
      border-radius: 50%;
      border: 4px solid rgba(255, 255, 255, 0.8);
      left: 25px;
      bottom: 0;
    }
    .box-left {
      font-size: 14px;
      .name {
        font-size: 24px;
        color: rgba(0, 11, 21, 0.85);
        font-weight: 500;
      }
      .focuson {
        margin-left: 25px;
        .num {
          color: #2875d4;
        }
      }
      .describe {
        margin-top: 10px;
      }
    }
    /deep/ .el-button {
      padding: 10px;
    }
  }
  .zoneTabs {
    position: relative;
    /deep/ .el-tabs {
      margin-top: -12px;
      .el-tabs__item {
        height: 60px;
        line-height: 60px;
        font-size: 16px;
      }
    }
    /deep/ .el-tabs .el-tabs__nav-wrap {
      padding: 0 25px;
    }
    .search-input {
      position: absolute;
      right: 25px;
      top: 14px;
    }
  }
  .releasePost {
    font-size: 16px;
    /deep/ .el-col {
      margin-bottom: 0;
    }
    /deep/ .el-input__inner {
      height: 40px;
      line-height: 40px;
    }
    /deep/ .el-checkbox__label {
      font-size: 12px;
      color: rgba(0, 11, 21, 0.45);
    }
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
/deep/.el-upload-list__item.is-ready {
  display: none;
}
</style>
