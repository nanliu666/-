<template>
  <div class="postReplyList">
    <!-- 一级回复列表，会有图片 -->
    <div v-loading="replyLoading" class="reply-container">
      <template v-if="replyList.length">
        <div v-for="(item, index) in replyList" :key="index" class="reply-container-item">
          <!-- 回复内容 -->
          <div class="describe">{{ item.content }}</div>
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
            <div class="infomation" @click="goHomePages(item)">
              <el-row type="flex" style="align-items: center">
                <div class="avatar">
                  <el-avatar
                    :size="24"
                    :src="item.avatarUrl"
                    style="margin-right: 3px; vertical-align: middle"
                  ></el-avatar>
                  {{ item.userName }}
                </div>
                <span v-if="item.isExpert" class="iconbiaoqian-zhuanjia iconfont experts"></span>
              </el-row>
            </div>
            <div class="reply-time">
              <el-row type="flex" style="align-items: center">
                <span
                  class="delete-info"
                  v-if="
                    topicUserId == userId ||
                    item.userId == userId ||
                    item.managerId.split(',').includes(userId)
                  "
                  @click="deleteReply(item)"
                  >删除</span
                >
                <el-divider
                  direction="vertical"
                  v-if="topicUserId == userId || item.userId == userId"
                ></el-divider>
                <span class="reply-time-info">{{ formatReplyTime(item.createTime) }}</span>
                <span
                  class="delete-info"
                  style="margin-left: 10px"
                  @click="showSecondaryreply(item)"
                  >{{ packUpReply[item.id] ? '收起回复' : '回复' }}（{{
                    item.replyCount || 0
                  }}）</span
                >
              </el-row>
            </div>
          </el-row>
          <!-- 第二级回复 -->
          <el-collapse-transition>
            <div
              v-if="packUpReply[item.id]"
              v-loading="subReplyLoading[item.id]"
              class="reply-container-item-temp"
            >
              <template v-if="subReplyList[item.id].length">
                <div
                  v-for="(v, i) in subShowAll[item.id]
                    ? subReplyList[item.id]
                    : subReplyList[item.id].slice(0, 3)"
                  :key="i"
                  class="reply-container-item-temp-container"
                >
                  <el-row type="flex" justify="space-between" style="align-items: center">
                    <div class="infomation" @click="goHomePages(v)">
                      <el-row type="flex" style="align-items: center">
                        <div class="avatar">
                          <el-avatar
                            :size="24"
                            :src="v.avatarUrl"
                            style="margin-right: 3px; vertical-align: middle"
                          ></el-avatar>
                          {{ v.userName }}
                        </div>
                        <span
                          v-if="v.isExpert"
                          class="iconbiaoqian-zhuanjia iconfont experts"
                        ></span>
                      </el-row>
                    </div>
                    <div class="reply-time">
                      <el-row type="flex" style="align-items: center">
                        <span
                          class="delete-info"
                          v-if="
                            topicUserId == userId ||
                            v.userId == userId ||
                            v.managerId.split(',').includes(userId)
                          "
                          @click="deleteReply(item, v)"
                          >删除</span
                        >
                        <el-divider
                          direction="vertical"
                          v-if="topicUserId == userId || v.userId == userId"
                        ></el-divider>
                        <span class="reply-time-info">{{ formatReplyTime(v.createTime) }}</span>
                        <span
                          class="delete-info"
                          style="margin-left: 10px"
                          @click="subReplyAit(item, v)"
                          >回复</span
                        >
                      </el-row>
                    </div>
                  </el-row>
                  <!-- 回复内容 -->
                  <div class="reply-container-item-temp-container-describe">
                    <span class="isAit" v-if="v.isAit" style="margin-right: 10px">{{
                      '@' + v.userToName
                    }}</span
                    >{{ v.content }}
                  </div>
                </div>
              </template>
              <!-- 点击查看 -->
              <el-row type="flex" justify="space-between" style="align-items: center">
                <!-- 如果回复小于3条，不显示点击查看 -->
                <div class="andTheReply">
                  <template
                    v-if="
                      !(subPageConfig[item.id].pageNo === 1 && subReplyList[item.id].length <= 3)
                    "
                  >
                    <div class="andTheReply-item" v-if="!subShowAll[item.id]">
                      还有{{ subPageConfig[item.id].total - 3 }}回复
                      <el-button type="text" @click="viewSubMore(item)">点击查看</el-button>
                    </div>
                  </template>
                  <!-- 当数据不满一页时，不显示分页 -->
                  <div
                    class="andTheReply-page"
                    v-if="
                      subShowAll[item.id] &&
                      subPageConfig[item.id].total > subPageConfig[item.id].pageSize
                    "
                  >
                    <el-pagination
                      small
                      layout="prev, pager, next"
                      :total="subPageConfig[item.id].total"
                      @size-change="subSizeChange($event, item)"
                      @current-change="subCurrentChange($event, item)"
                    >
                    </el-pagination>
                  </div>
                </div>
                <!-- 没有回复时的提示 -->
                <!-- <div v-if="!subReplyList[item.id].length">赞无回复,赶紧回复一下吧</div> -->
                <div></div>
                <div class="published">
                  <el-button
                    type="text"
                    @click="showInput(item.id)"
                    :icon="isShowInput.includes(item.id) ? 'el-icon-arrow-up' : ''"
                    >{{ isShowInput.includes(item.id) ? '收起发表回复' : '发表回复' }}</el-button
                  >
                </div>
              </el-row>
              <el-collapse-transition>
                <div class="replyQuiilBox" v-if="isShowInput.includes(item.id)">
                  <!-- 富文本 -->
                  <div class="quillEditor">
                    <v-edit-div
                      v-model="subShowInput[item.id]"
                      :nowrap="true"
                      :subMaxWord="subMaxWord"
                      @input="watchContent($event, item)"
                    ></v-edit-div>
                    <!-- 字数限制 -->
                    <div class="limit-word">
                      {{ subLimitWord[item.id] + '/' + subMaxWord }}
                    </div>
                  </div>
                  <!-- 提交按钮 -->
                  <div class="submitHandler">
                    <el-button
                      type="primary"
                      size="medium"
                      @click="releaseReply(item)"
                      :loading="subHandlerLoading[item.id]"
                      >发布</el-button
                    >
                  </div>
                </div>
              </el-collapse-transition>
            </div>
          </el-collapse-transition>
          <el-divider></el-divider>
        </div>
      </template>
      <!-- 暂无数据提示 -->
      <div v-else class="empty-tips">
        <img src="@/assets/images/empty.png" class="empty-img" />
        <div class="empty-text">
          <span>暂无评论</span>
        </div>
      </div>
      <!-- 分页 -->
      <div v-if="replyList.length" class="page">
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
    </div>
    <!-- 检查禁言模态框 -->
    <banned-judgment ref="bannedJudgment"></banned-judgment>
  </div>
</template>

<script>
import {
  queryTopicReply,
  querySubReply,
  replyTopic,
  deleteReply,
  queryExpertReply,
  queryPostReply
} from '@/api/community'
import 'viewerjs/dist/viewer.css' // 图片预览插件
import { api as viewerApi } from 'v-viewer'
import moment from 'moment'
import vEditDiv from './vEditDiv.vue'
import { mapGetters } from 'vuex'
import bannedJudgment from './bannedJudgment.vue'
export default {
  name: 'PostReplyList',
  components: {
    vEditDiv,
    bannedJudgment
  },
  data() {
    return {
      topicId: '', // 帖子id
      postInfo: {}, // 帖子详情
      packUpReply: {}, // 判断是否收起回复
      replyList: [], // 一级回复列表
      subReplyList: {}, // 二级回复列表
      subReplyLoading: {}, // 每条回复的二级回复列表的loading
      subPageConfig: {}, // 每条回复的二级回复列表的分页配置
      subShowAll: {}, // 是否显示全部分页数据
      isShowInput: [], // 是否显示回复框
      subShowInput: {}, // 二级回复双向绑定的值
      subHandlerLoading: {}, // 回复按钮的loading
      subLimitWord: {}, // 回复框字数限制
      subMaxWord: 500, // 最大字数限制
      subReplyAitBtn: {}, // @用户的按钮
      subReplyAitId: {}, // @用户的Id
      pageConfig: {
        // 帖子回复分页配置
        pageNo: 1,
        pageSize: 10,
        pageSizes: [10, 20, 30, 40],
        total: 0
      },
      replyLoading: false,
      topicUserId: '', // 发帖用户id
      topicId: '', // 帖子id
      requestType: '1' // tabs切换请求不同接口
    }
  },
  computed: {
    ...mapGetters(['userId'])
  },
  activated() {
    this.topicUserId = this.$route.query.userId
    this.topicId = this.$route.query.topicId
    this.initTopicReply()
  },
  methods: {
    //   一级回复分页筛选
    handleSizeChange(val) {
      this.pageConfig.pageSize = val
      this.initTopicReply()
    },
    handleCurrentChange(val) {
      this.pageConfig.pageNo = val
      this.initTopicReply()
    },
    //   二级回复分页筛选
    subSizeChange(val, item) {
      this.subPageConfig[item.id].pageSize = val
      this.initSubReply(item)
    },
    subCurrentChange(val, item) {
      this.subPageConfig[item.id].pageNo = val
      this.initSubReply(item)
    },
    //   查看帖子一级回复
    async initTopicReply() {
      let params = {
        pageNo: this.pageConfig.pageNo,
        pageSize: this.pageConfig.pageSize,
        topicId: this.topicId
      }
      //   1:全部答复,2:只看专家,3:只看发帖人
      this.replyLoading = true
      await (this.requestType == '1'
        ? queryTopicReply(params)
        : this.requestType == '2'
        ? queryExpertReply(params)
        : queryPostReply(params)
      )
        .then((res) => {
          this.replyList = res.data
          this.replyList.map((v) => {
            this.$set(this.packUpReply, v.id, false)
            this.$set(this.subReplyList, v.id, [])
            this.$set(this.subReplyLoading, v.id, false)
            this.$set(this.subPageConfig, v.id, { pageNo: 1, pageSize: 10, total: 0 })
            this.$set(this.subShowAll, v.id, false)
            this.$set(this.subShowInput, v.id, '')
            this.$set(this.subHandlerLoading, v.id, false)
            this.$set(this.subReplyAitBtn, v.id, '')
            this.$set(this.subReplyAitId, v.id, {
              replyId: '',
              aitId: ''
            })
            this.$set(this.subLimitWord, v.id, 0)
          })
          this.pageConfig.total = res.totalNum
        })
        .finally(() => {
          this.replyLoading = false
        })
    },
    // 点击一级回复按钮
    async showSecondaryreply(item) {
      // 判断是否禁言
      if (!this.packUpReply[item.id]) {
        await this.$refs.bannedJudgment.checkBanned(this.$route.query.areaId)
        if (this.$refs.bannedJudgment.flagBanned) return
      }
      this.packUpReply[item.id] = !this.packUpReply[item.id]
      this.subShowAll[item.id] = false
      if (this.isShowInput.includes(item.id)) {
        this.isShowInput.splice(this.isShowInput.indexOf(item.id), 1)
      }
      this.subPageConfig[item.id].pageNo = 1
      if (this.packUpReply[item.id]) this.initSubReply(item)
    },
    // 获取二级回复
    async initSubReply(item) {
      let params = {
        pageNo: this.subPageConfig[item.id].pageNo,
        pageSize: this.subPageConfig[item.id].pageSize,
        topicId: this.$route.query.topicId,
        parentId: item.id
      }
      this.subReplyLoading[item.id] = true
      await querySubReply(params)
        .then((res) => {
          this.subReplyList[item.id] = res.data
          this.subPageConfig[item.id].total = res.totalNum
        })
        .finally(() => {
          this.subReplyLoading[item.id] = false
        })
    },
    // 点击查看更多展开
    viewSubMore(item) {
      this.subShowAll[item.id] = true
    },
    // 判断是否显示输入框
    async showInput(id) {
      if (this.isShowInput.includes(id)) {
        this.isShowInput.splice(this.isShowInput.indexOf(id), 1)
      } else {
        this.isShowInput.push(id)
      }
    },
    // 发布消息
    async releaseReply(item) {
      //   判断内容是否含有html,来确定用户是否手动删掉了@按钮
      let checkHtml = /<[^>]+>/g,
        flag = checkHtml.test(this.subShowInput[item.id])
      let params = {
        topicId: this.topicId,
        content: flag
          ? this.subShowInput[item.id].replace(/<.*>.*<\/.*>/gi, '')
          : this.subShowInput[item.id],
        // 判断有没有@用户id
        parentId: item.id,
        userToId: flag ? this.subReplyAitId[item.id].aitId : item.userId,
        isAit: flag ? 1 : 0
      }
      //   回复消息不能为空,去掉@按钮
      if (!this.subShowInput[item.id].replace(/<.*>.*<\/.*>/gi, '')) {
        this.$message.warning('回复内容不能为空!')
        return
      }
      //   判断内容长度
      if (this.subLimitWord[item.id] > this.subMaxWord) {
        this.$message.warning(`回复内容不能超过${this.subMaxWord}字!`)
        return
      }
      this.subHandlerLoading[item.id] = true
      await replyTopic(params)
        .then(() => {
          this.$set(this.subShowInput, item.id, '')
          this.showInput(item.id)
          this.subPageConfig[item.id].pageNo = 1
          this.initSubReply(item)
          this.$message.success('回复成功!')
        })
        .finally(() => {
          this.subHandlerLoading[item.id] = false
        })
    },
    // 删除帖子回复
    async deleteReply(primaryData, secondaryData) {
      // primaryData是一级回复数据,secondaryData是二级回复数据
      await deleteReply(secondaryData ? secondaryData.id : primaryData.id).then(() => {
        // 判断删除的是一级回复还是二级回复
        if (secondaryData) {
          this.subPageConfig[primaryData.id].pageNo = 1
          this.initSubReply(primaryData)
        } else {
          this.pageConfig.pageNo = 1
          this.initTopicReply()
        }
        this.$message.success('删除成功!')
      })
    },
    // 回复帖子,@人
    subReplyAit(primaryData, secondaryData) {
      // primaryData是一级回复数据,secondaryData是二级回复数据
      if (this.isShowInput.includes(primaryData.id)) {
        this.isShowInput.splice(this.isShowInput.indexOf(primaryData.id), 1)
        this.isShowInput.push(primaryData.id)
      } else {
        this.isShowInput.push(primaryData.id)
      }
      //   判断是否重复@，如果是则删掉@
      if (
        this.subReplyAitId[primaryData.id].aitId == secondaryData.userId &&
        this.subReplyAitId[primaryData.id].replyId == secondaryData.id
      ) {
        this.subReplyAitId[primaryData.id].aitId = ''
        this.subReplyAitBtn[primaryData.id] = ''
      } else {
        this.subReplyAitId[primaryData.id].aitId = secondaryData.userId
        this.subReplyAitId[primaryData.id].replyId = secondaryData.id
        this.subReplyAitBtn[
          primaryData.id
        ] = `<button onclick="return false;" contenteditable="false" class="c_tx mention">@${secondaryData.userName} </button>`
      }
      //   正则匹配去掉button标签
      this.subShowInput[primaryData.id] = this.subShowInput[primaryData.id].replace(
        /<.*>.*<\/.*>/gi,
        ''
      )
      this.$nextTick(() => {
        this.$set(
          this.subShowInput,
          primaryData.id,
          this.subReplyAitBtn[primaryData.id] + this.subShowInput[primaryData.id]
        )
      })
      this.$forceUpdate()
    },
    // 监听内容长度
    watchContent(val, item) {
      this.subLimitWord[item.id] = val.replace(/<.*>.*<\/.*>/gi, '').length
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
    // 跳转他人主页
    goHomePages(item) {
      this.$router.push({ path: '/community/otherHomePage', query: { userId: item.userId } })
    }
  }
}
</script>

<style lang="scss" scoped>
.postReplyList {
  .reply-container {
    padding: 0 25px;
    &-item {
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
      .describe {
        font-size: 14px;
        margin-top: 20px;
        color: rgba(0, 11, 21, 0.65);
        line-height: 22px;
        word-break: break-all;
      }
      .infomation {
        font-size: 14px;
        color: rgba(0, 11, 21, 0.85);
        line-height: 24px;
        .avatar {
          cursor: pointer;
        }
        .experts {
          margin-left: 5px;
          color: #f5623b;
          font-size: 24px;
        }
        .zoneName {
          cursor: pointer;
          line-height: initial;
        }
      }
      .reply-time {
        font-size: 12px;
        color: rgba(0, 11, 21, 0.45);
        .delete-info {
          cursor: pointer;
        }
      }
      &-temp {
        margin-top: 30px;
        background: #fafafa;
        border-radius: 1px 0 0 0 1px 1px 1px;
        padding: 15px 25px;
        &-container {
          margin-bottom: 20px;
          &-describe {
            font-size: 14px;
            color: rgba(0, 11, 21, 0.65);
            line-height: 22px;
            margin: 10px 0 0 30px;
            word-break: break-all;
          }
          .experts {
            margin-left: 5px;
            color: #f5623b;
            font-size: 24px;
          }
        }
        .replyQuiilBox {
          .quillEditor {
            position: relative;
            height: 148px;
            margin-top: 15px;
            padding-left: 30px;
            .limit-word {
              position: absolute;
              right: 5px;
              bottom: 5px;
              font-size: 12px;
              color: #909399;
            }
          }
          .submitHandler {
            margin-top: 20px;
            text-align: right;
          }
        }
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
    margin-top: 12px;
    text-align: right;
    padding-bottom: 20px;
  }
}
</style>
