<template>
  <div>
    <common-breadcrumb ref="breadcrumb" />
    <el-card class="middle-card">
      <div class="card-title">
        {{ konwledgeDetail.resName }}
      </div>
      <ul class="detail-ul">
        <li class="detail-li">
          <span class="li-label">提供人：</span>
          <span class="li-value">{{ konwledgeDetail.providerName }}</span>
        </li>
        <li class="detail-li">
          <span class="li-label">所在目录：</span>
          <span class="li-value">{{ konwledgeDetail.catalogName }}</span>
        </li>
        <li class="detail-li">
          <span class="li-label">更新时间：</span>
          <span class="li-value">{{ konwledgeDetail.updateTime }}</span>
        </li>
      </ul>
      <ul class="person">
        <li>
          <i class="iconimage_icon_Preview1 iconfont" />
          <span>{{ konwledgeDetail.watchNum }}</span>
        </li>
        <li>
          <i class="iconimage_icon_download iconfont" />
          <span>{{ konwledgeDetail.downloadNum }}</span>
        </li>
        <li>
          <i class="iconimage_icon_comment iconfont" />
          <span>{{ konwledgeDetail.commentNum }}</span>
        </li>
      </ul>
    </el-card>
    <el-card class="bottom-card" style="min-height:50vh">
      <el-tabs v-model="activeIndex" @tab-click="handleSelect">
        <el-tab-pane label="资源介绍" name="1">
          <div
            v-show="konwledgeDetail.introduction"
            v-html="_.unescape(konwledgeDetail.introduction)"
          />
          <common-empty v-show="!konwledgeDetail.introduction" />
        </el-tab-pane>
        <el-tab-pane label="附件" name="2">
          <div v-if="!_.isEmpty(fileGroup)">
            <div class="image-ul">
              <div v-for="(item, index) in fileGroup.true" :key="index">
                <common-image-view
                  :url="item.url"
                  :file-name="item.fileName"
                  :is-download="konwledgeDetail.allowDownload === 1"
                  :preview-src-list="previewSrcList"
                  @downloadFile="downloadFile"
                />
              </div>
            </div>
            <ul v-for="(item, index) in fileGroup.false" :key="index">
              <li class="file-title">
                <span>{{ item.fileName }}</span>
                <i
                  v-if="konwledgeDetail.allowDownload === 1"
                  class="el-icon-download"
                  style="margin-left: 10px; cursor: pointer"
                  @click.stop="downloadFile(item.url)"
                ></i>
              </li>
            </ul>
          </div>
          <common-empty v-if="_.isEmpty(fileGroup)" />
        </el-tab-pane>
        <el-tab-pane label="评论" name="3">
          <Comment
            v-show="activeIndex === '3'"
            :load="loadCommentList"
            :submit="submitComment"
            name="知识"
            disable-text="您还未学习知识，暂不能对知识评价，先去学习再来评价哦~"
          />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import Comment from '@/components/common-comment/Comment'
import CommonBreadcrumb from '@/components/common-breadcrumb/Breadcrumb'
import CommonEmpty from '@/components/common-empty/Empty'
import CommonImageView from '@/components/common-image-viewer/Viewer'
import {
  getKnowledgeDetails,
  putWatchOperate,
  putDownloadOperate,
  getEvaluateList,
  addCourseScope,
  saveKnowledgeOperateCredit
} from '@/api/knowledge'
export default {
  name: 'KnowledgeDetail',
  components: {
    CommonImageView,
    CommonEmpty,
    CommonBreadcrumb,
    Comment
  },
  data() {
    return {
      previewSrcList: [],
      fileGroup: {},
      activeIndex: '1',
      konwledgeDetail: {}
    }
  },
  computed: {
    id() {
      return this.$route.query.id
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    // 下载
    downloadFile(data) {
      // 保存知识库学分
      saveKnowledgeOperateCredit()
      putDownloadOperate({ knowledgeId: this.$route.query.id })
      window.open(data)
    },
    initData() {
      // 保存知识库学分
      saveKnowledgeOperateCredit()
      putWatchOperate({ knowledgeId: this.id })
      getKnowledgeDetails({ id: this.id }).then((res) => {
        this.konwledgeDetail = res
        this.$refs.breadcrumb.setBreadcrumbTitle(this.konwledgeDetail.resName)
        this.fileGroup = _.groupBy(this.konwledgeDetail.attachments, (item) => {
          return this.fileTypeIsImage(item.fileName)
        })
        _.each(this.fileGroup.true, (item) => {
          this.previewSrcList.push(item.url)
        })
      })
    },
    // 判断当前格式是否为图片类型的格式
    fileTypeIsImage(fileName) {
      const lastIndex = fileName.lastIndexOf('.')
      const fileType = fileName.substr(lastIndex + 1, fileName.length)
      const imageType = ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff']
      if (imageType.includes(fileType)) {
        return true
      } else {
        return false
      }
    },
    downloadAll() {},
    /**
     * 处理nav切换
     */
    handleSelect(tab) {
      this.activeIndex = tab.name
    },
    loadCommentList(params) {
      return getEvaluateList({ ...params, knowledgeId: this.id })
    },
    submitComment(params) {
      return addCourseScope({ ...params, knowledgeId: this.id })
    }
  }
}
</script>

<style scoped lang="scss">
.image-ul {
  display: flex;
  align-items: center;
}
.middle-card {
  .card-title {
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: rgba(0, 11, 21, 0.85);
    margin-bottom: 18px;
  }
  .detail-ul {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 18px;
    .detail-li {
      font-family: PingFangSC-Regular;
      margin-right: 40px;
      display: flex;
      align-items: center;
      .li-label {
        font-size: 14px;
        color: rgba(0, 11, 21, 0.45);
      }
      .li-value {
        font-size: 14px;
        color: rgba(0, 11, 21, 0.85);
      }
    }
  }

  .person {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: rgba(0, 11, 21, 0.45);
    display: flex;
    justify-content: flex-start;
    li {
      margin-right: 24px;
      display: flex;
      align-items: center;
      i {
        margin-right: 8px;
      }
    }
  }
}
.bottom-card {
  margin-top: 20px;
  /deep/ .el-menu--horizontal {
    border-bottom: 1px solid #ebeced !important;
  }
}
</style>
