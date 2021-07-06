<template>
  <div class="post-container">
    <!-- 内容 -->
    <div v-if="dynamicList.length" v-loading="dynamicLoading" class="dynamic-container">
      <div v-for="(item, index) in dynamicList" :key="index" class="dynamic-container-item">
        <!-- 标题 -->
        <el-row type="flex" justify="space-between" style="align-items: center">
          <div class="title" @click="goPostDetails(item)">
            {{ item.title }}
            <el-tag
              v-if="showAudit && !item.status"
              size="mini"
              class="title-tag"
              effect="dark"
              color="#FF8C66"
              >审核中</el-tag
            >
            <template v-if="isShowTag">
              <el-tag
                v-if="item.top && isShowTopTag"
                size="mini"
                class="title-tag"
                effect="dark"
                color="#F5C200"
                >置顶</el-tag
              >
              <el-tag v-if="item.fine" size="mini" class="title-tag" effect="dark" color="#4F95E0"
                >精品</el-tag
              >
              <el-tag
                v-if="item.isExpert"
                size="mini"
                class="title-tag"
                effect="dark"
                color="#F5623B"
                >专家帖</el-tag
              >
            </template>
          </div>
          <div class="tool">
            <ul>
              <li>
                <span
                  class="iconfont"
                  :class="item.userHit ? 'iconoperating_ic_clickon_like' : 'iconoperating_ic_like'"
                  :style="{ color: item.userHit ? '#2875D4' : '' }"
                  @click="giveLike(item, index)"
                ></span
                >{{ item.topicHit > 999 ? '999+' : item.topicHit }}
              </li>
              <li @click="showTinymce(item.id)">
                <span class="iconoperating_ic_comment iconfont"></span
                >{{ item.replyCount > 999 ? '999+' : item.replyCount }}
              </li>
              <li>
                <span
                  class="iconfont"
                  :class="
                    item.userCollect ? 'iconcommunity_ic_favorites' : 'iconoperating_ic_favorites'
                  "
                  :style="{ color: item.userCollect ? '#2875D4' : '' }"
                  @click="collection(item, index)"
                ></span
                >{{ item.topicCollect > 999 ? '999+' : item.topicCollect }}
              </li>
            </ul>
          </div>
        </el-row>
        <!-- 描述 -->
        <div class="describe" @click="goPostDetails(item)">{{ item.content }}</div>
        <!-- 图片放大预览 -->
        <div v-if="item.imgUrl" class="previewPicture">
          <img
            v-for="(src, index) in item.imgUrl.split(',').slice(0, 3)"
            :key="index"
            :src="src"
            class="previewPicture-img"
            @click="previewImgObject(item.imgUrl.split(','), index)"
          />
        </div>
        <!-- 底部 -->
        <el-row
          type="flex"
          justify="space-between"
          style="align-items: center; margin: 10px 0 25px"
        >
          <div class="infomation">
            <el-row type="flex" style="align-items: center">
              <div class="avatar" @click="goHomePages(item)">
                <el-avatar
                  :size="24"
                  :src="item.avatarUrl"
                  style="margin-right: 3px; vertical-align: middle"
                ></el-avatar>
                {{ item.userName }}
                <!-- <el-tag v-if="item.isExpert && !showExpert" type="warning" size="mini">专家</el-tag> -->
              </div>
              <span v-if="item.isExpert" class="iconbiaoqian-zhuanjia iconfont experts"></span>
              <template v-if="!showExpert">
                <el-divider direction="vertical"></el-divider>
                <div class="zoneName" @click="goZoneHome(item)">
                  <el-tag size="mini">{{ item.areaName }}</el-tag>
                </div>
              </template>
            </el-row>
          </div>
          <div class="reply-time">
            <el-row type="flex" style="align-items: center">
              <span
                v-if="item.userId == userId || item.managerId.split(',').includes(userId)"
                class="delete-info"
                @click="deleteTopic(item)"
                >删除</span
              >
              <el-divider
                v-if="item.userId == userId || item.managerId.split(',').includes(userId)"
                direction="vertical"
              ></el-divider>
              <span class="reply-time-info">{{ formatReplyTime(item.createTime) }}</span>
            </el-row>
          </div>
        </el-row>
        <!-- 回复框 -->
        <el-collapse-transition>
          <div v-show="isShowTinymce.includes(item.id)" v-cloak class="replyQuiilBox">
            <div class="reply-title">发表回复</div>
            <!-- 富文本 -->
            <div class="quillEditor">
              <el-input
                v-model="quillEditorInfo[item.id].content"
                type="textarea"
                :rows="4"
                placeholder="说点什么吧"
                maxlength="500"
                show-word-limit
                resize="none"
              >
              </el-input>
              <common-upload
                v-model="quillEditorInfo[item.id].imgUrl"
                style="margin-top: 20px"
                :before-upload="beforeUpload"
                :multiple="true"
                :limit="9"
                list-type="picture-card"
                :show-file-list="true"
                :on-remove="
                  (file, fileList) => {
                    handleRemove(file, fileList, item.id)
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
            <!-- 提交按钮 -->
            <div class="submitHandler">
              <el-button
                type="primary"
                size="medium"
                :loading="releaseLoading[item.id]"
                @click="releaseReply(item, index)"
                >发布</el-button
              >
              <el-button size="medium" @click="showTinymce(item.id)">取消</el-button>
            </div>
          </div>
        </el-collapse-transition>
        <el-divider></el-divider>
      </div>
    </div>
    <!-- 暂无数据提示 -->
    <div v-else v-loading="dynamicLoading" class="empty-tips">
      <img src="@/assets/images/empty.png" class="empty-img" />
      <div class="empty-text">
        <span>{{ emptyTip }}</span>
      </div>
    </div>
    <!-- 分页 -->
    <div v-if="dynamicList.length && showPage" class="page">
      <el-pagination
        :current-page="pageConfig.pageNo"
        :page-sizes="pageConfig.pageSizes"
        :page-size="pageConfig.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageConfig.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
    <!-- 加载更多 -->
    <div
      v-if="!(dynamicList.length < pageConfig.pageNo * pageConfig.pageSize) && showLoadMore"
      class="load-more"
    >
      <el-button size="medium" :loading="loadMoreLoading" @click="loadMore">加载更多</el-button>
    </div>
  </div>
</template>

<script>
import 'viewerjs/dist/viewer.css' // 图片预览插件
import { api as viewerApi } from 'v-viewer'
import moment from 'moment'
import {
  queryHotTopics,
  queryTopics,
  topicCollect,
  cancelTopicCollect,
  topicHit,
  cancelTopicHit,
  replyTopic,
  deleteTopic,
  expertsAnswer,
  queryTopicById
} from '@/api/community'
import { mapGetters } from 'vuex'
export default {
  name: 'PostList',
  components: {
    CommonUpload: () => import('@/components/common-upload/CommonUpload')
  },
  props: {
    emptyTip: {
      // 暂无数据提示
      type: String,
      default: '暂无数据'
    },
    isHotTopic: {
      // 判断是否是热门动态还是帖子
      type: Boolean,
      default: false
    },
    isShowTopTag: {
      // 在专区主页以外的地方，帖子只有两种标签，根据帖子本身的属性进行展示
      // 是否显示置顶标签
      type: Boolean,
      default: false
    },
    isShowTag: {
      // 是否显示帖子标签
      type: Boolean,
      default: false
    },
    isExpertTopic: {
      // 判断是否是专家帖子
      type: Boolean,
      default: false
    },
    isPostDetail: {
      // 判断是否是帖子详情，帖子详情返回一个对象
      type: Boolean,
      default: false
    },
    postTopicId: {
      // 帖子详情id
      type: String,
      default: ''
    },
    showLoadMore: {
      // 是否显示更多加载按钮
      type: Boolean,
      default: false
    },
    showPage: {
      // 是否显示分页
      type: Boolean,
      default: false
    },
    showAudit: {
      // 是否显示审核中
      type: Boolean,
      default: false
    },
    showExpert: {
      // 是否显示专家徽章
      type: Boolean,
      default: false
    },
    pageConfig: {
      // 分页配置
      type: Object,
      default: () => ({
        pageNo: 1,
        pageSizes: [10, 20, 30, 40],
        pageSize: 10,
        total: 0
      })
    },
    requestParameters: {
      // 请求参数
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      dynamicList: [], // 热门动态列表
      dynamicLoading: false,
      loadMoreLoading: false, // 加载更多
      quillEditorInfo: {}, // 回复框绑定的值
      isShowTinymce: [], // 是否显示富文本
      releaseLoading: {} // 每条数据发布按钮的loading
    }
  },
  computed: {
    ...mapGetters(['userId'])
  },
  watch: {
    requestParameters: {
      handler(newVal) {
        this.requestParameters = newVal
        this.initQueryTopics()
      },
      //   immediate: true,
      deep: true
    },
    postTopicId: {
      handler(newVal) {
        this.postTopicId = newVal
        this.initQueryTopics()
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    //   分页切换
    handleSizeChange(val) {
      this.pageConfig.pageSize = val
      this.initQueryTopics()
    },
    handleCurrentChange(val) {
      this.pageConfig.pageNo = val
      this.initQueryTopics()
    },
    // 格式化时间
    formatReplyTime(localTime) {
      // 时间显示规则 时间为当天的时候，仅显示小时分钟  例如 20:12 不是当天，但是是当年的，仅显示月份和日期  例如  03-24 不是当年的，显示具体的年月日  例如2012-03-24
      let today = moment().startOf('day')
      if (moment(localTime).isSame(today, 'd')) {
        // 判断是否今天
        return moment(localTime).format('HH:mm')
      } else if (moment(localTime).year() == new Date().getFullYear()) {
        // 判断是否是今年
        return moment(localTime).format('MM-DD')
      } else {
        return moment(localTime).format('YYYY-MM-DD')
      }
    },

    // 获取热门动态
    async initQueryTopics(flag) {
      let params = Object.assign(
        { pageNo: this.pageConfig.pageNo, pageSize: this.pageConfig.pageSize },
        this.requestParameters
      )
      //   判断是分页还是更多加载
      if (!this.showPage && this.pageConfig.pageNo > 1) {
        this.loadMoreLoading = true
      } else {
        this.dynamicLoading = true
      }
      //   判断是否是热门动态还是帖子还是帖子详情，调用接口不一样
      if (this.isPostDetail) {
        if (this.postTopicId) {
          await queryTopicById({ topicId: this.postTopicId })
            .then((res) => {
              this.dynamicList = [res]
              this.dynamicList.map((v) => {
                this.$set(this.quillEditorInfo, v.id, { content: '', imgUrl: [] })
                this.$set(this.releaseLoading, v.id, false)
              })
              this.$emit('postInfo', res)
            })
            .finally(() => {
              this.dynamicLoading = false
            })
        }
      } else {
        await (this.isHotTopic
          ? queryHotTopics(params)
          : this.isExpertTopic
          ? expertsAnswer(params)
          : queryTopics(params)
        )
          .then((res) => {
            // 判断是否是分页,分页直接赋值，更多加载合并数据
            if (flag) {
              // flag为true是筛选，直接赋值
              this.dynamicList = res.data
            } else {
              if (this.showPage) {
                this.dynamicList = res.data
              } else {
                this.dynamicList = [...this.dynamicList, ...res.data]
              }
            }
            this.dynamicList.map((v) => {
              this.$set(this.quillEditorInfo, v.id, { content: '', imgUrl: [] })
              this.$set(this.releaseLoading, v.id, false)
            })
            this.pageConfig.total = res.totalNum
            this.$emit('topicTotal', res.totalNum)
          })
          .finally(() => {
            this.dynamicLoading = false
            this.loadMoreLoading = false
          })
      }
    },
    // 点赞
    async giveLike(item, index) {
      // 是否点赞 0否 1是
      if (item.userHit) {
        await cancelTopicHit(item.id).then(() => {
          this.$set(this.dynamicList[index], 'userHit', 0)
          this.$set(this.dynamicList[index], 'topicHit', this.dynamicList[index].topicHit - 1)
        })
      } else {
        await topicHit(item.id).then(() => {
          this.$set(this.dynamicList[index], 'userHit', 1)
          this.$set(this.dynamicList[index], 'topicHit', this.dynamicList[index].topicHit + 1)
        })
      }
    },
    // 收藏
    async collection(item, index) {
      // 是否点赞 0否 1是
      if (item.userCollect) {
        await cancelTopicCollect(item.id).then(() => {
          this.$set(this.dynamicList[index], 'userCollect', 0)
          this.$set(
            this.dynamicList[index],
            'topicCollect',
            this.dynamicList[index].topicCollect - 1
          )
        })
      } else {
        await topicCollect(item.id).then(() => {
          this.$set(this.dynamicList[index], 'userCollect', 1)
          this.$set(
            this.dynamicList[index],
            'topicCollect',
            this.dynamicList[index].topicCollect + 1
          )
        })
      }
    },
    // 判断是否显示输入框
    showTinymce(id) {
      if (this.isShowTinymce.includes(id)) {
        this.isShowTinymce.splice(this.isShowTinymce.indexOf(id), 1)
      } else {
        this.isShowTinymce.push(id)
      }
    },
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
    handleRemove(file, fileList, id) {
      this.quillEditorInfo[id].imgUrl = fileList
    },

    // 加载更多
    loadMore() {
      this.pageConfig.pageNo++
      this.initQueryTopics()
    },
    // 发布消息
    async releaseReply(item, index) {
      let params = {
        topicId: item.id,
        content: this.quillEditorInfo[item.id].content,
        imgUrl: this.quillEditorInfo[item.id].imgUrl.map((v) => v.fileUrl).join(','),
        parentId: 0,
        userToId: item.userId
      }
      //   回复消息不能为空
      if (!this.quillEditorInfo[item.id].content) {
        this.$message.warning('回复内容不能为空!')
        return
      }
      this.releaseLoading[item.id] = true
      await replyTopic(params)
        .then(() => {
          this.quillEditorInfo[item.id] = { content: '', imgUrl: [] }
          this.showTinymce(item.id)
          this.$set(this.dynamicList[index], 'replyCount', this.dynamicList[index].replyCount + 1)
          //   判断是不是帖子详情回复，需要刷新回复
          if (this.isPostDetail) {
            this.$emit('initData')
          }
          this.$message.success('发表成功!')
        })
        .finally(() => {
          this.releaseLoading[item.id] = false
        })
    },
    // 删除帖子
    deleteTopic(data) {
      this.$confirm('删除后，帖子和回复都将删除，是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await deleteTopic(data.id).then(() => {
          this.$message.success('删除成功!')
          this.initQueryTopics()
        })
      })
    },
    // 图片预览
    previewImgObject(images, index) {
      viewerApi({
        options: {
          toolbar: true,
          initialViewIndex: index
        },
        images: images
      })
    },
    // 筛选触发数据加载
    initTopic() {
      this.pageConfig.pageNo = 1
      this.initQueryTopics(true)
    },
    // 跳到专区主页
    goZoneHome(item) {
      this.$router.push({ path: '/community/zoneHomePage', query: { areaId: item.areaId } })
    },
    // 跳转他人主页
    goHomePages(item) {
      this.$router.push({ path: '/community/otherHomePage', query: { userId: item.userId } })
    },
    // 跳转帖子详情
    goPostDetails(item) {
      this.$router.push({
        path: '/community/postDetails',
        query: { userId: item.userId, topicId: item.id, areaId: item.areaId }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.post-container {
  .dynamic-container {
    padding: 0 25px;
    &-item {
      margin-top: 10px;
      .title {
        font-size: 16px;
        color: rgba(0, 11, 21, 0.85);
        font-weight: bold;
        cursor: pointer;
        &-tag {
          color: #ffffff;
          margin: 0 4px;
          vertical-align: bottom;
          border-color: transparent;
        }
      }
      .tool {
        ul li {
          float: left;
          margin-left: 20px;
          font-size: 12px;
          color: rgba(0, 11, 21, 0.45);
          cursor: pointer;
          .iconfont {
            margin-right: 5px;
            vertical-align: middle;
          }
        }
      }
      .describe {
        font-size: 14px;
        margin-top: 20px;
        color: rgba(0, 11, 21, 0.65);
        line-height: 22px;
        cursor: pointer;
        word-break: break-all;
      }
      .infomation {
        font-size: 14px;
        color: rgba(0, 11, 21, 0.85);
        line-height: 24px;
        .avatar {
          cursor: pointer;
        }
        .zoneName {
          cursor: pointer;
          line-height: initial;
        }
        .experts {
          margin-left: 5px;
          color: #f5623b;
          font-size: 24px;
        }
      }
      .reply-time {
        font-size: 12px;
        color: rgba(0, 11, 21, 0.45);
        .delete-info {
          cursor: pointer;
        }
      }
      .previewPicture {
        margin-top: 5px;
        &-img {
          width: 160px;
          height: 90px;
          margin-right: 16px;
          border-radius: 5px;
          cursor: pointer;
        }
      }
    }
    .replyQuiilBox {
      margin-top: 10px;
      padding: 20px;
      .reply-title {
        font-size: 16px;
      }
      .quillEditor {
        position: relative;
        margin-top: 15px;
        /deep/ .ql-container {
          height: 300px;
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
        .sizeTip {
          position: absolute;
          right: 10px;
          bottom: 10px;
        }
      }
      .submitHandler {
        margin-top: 20px;
      }
      /deep/.el-upload-list__item.is-ready {
        display: none;
      }
    }
  }
  .empty-tips {
    padding: 75px 0;
    text-align: center;
    .empty-img {
      width: 160px;
      height: 160px;
    }
    .empty-text {
      font-size: 12px;
      color: rgba(0, 11, 21, 0.25);
    }
  }
  .page {
    margin: 20px 0;
    padding: 0 25px;
    text-align: right;
  }
  .load-more {
    text-align: center;
    margin: 20px 0;
  }
}
/deep/.el-upload-list__item.is-ready {
  display: none;
}
</style>
