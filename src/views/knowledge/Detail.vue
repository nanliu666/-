<template>
  <div>
    <common-breadcrumb ref="breadcrumb" :route-list="routeList" />
    <el-card ref="xxx" class="middle-card">
      <div class="card-title">
        <div class="left">{{ konwledgeDetail.resName }}</div>
        <div class="right">
          <span @click="collectionCourse">
            <i
              class="iconoperating_ic_favorites iconfont"
              :class="{ iconoperating_ic_favorites_active: konwledgeDetail.isCollect }"
            ></i>
            {{ konwledgeDetail.isCollect ? '取消收藏' : '收藏' }}
          </span>
        </div>
      </div>
      <el-rate
        :value="+konwledgeDetail.evaluateScore"
        disabled
        show-score
        text-color="#ff9900"
        score-template="{value}分"
      >
      </el-rate>
      <ul class="detail-ul">
        <li class="detail-li">
          <span class="li-label">提供人：</span>
          <span class="li-value">{{
            konwledgeDetail.providerName ? konwledgeDetail.providerName : '--'
          }}</span>
        </li>
        <li class="detail-li">
          <span class="li-label">知识类型：</span>
          <span class="li-value">{{ knowType }}</span>
        </li>
        <li class="detail-li">
          <span class="li-label">更新时间：</span>
          <span class="li-value">{{ konwledgeDetail.updateTime }}</span>
        </li>
      </ul>
      <ul class="online">
        <li class="detail-li">
          <span class="li-label" style="min-width:70px;">所在分类:</span>
          <span class="li-value">{{ konwledgeDetail.catalogName }}</span>
        </li>
        <li class="detail-li">
          <span class="li-label" style="min-width:70px;">知识体系:</span>
          <span class="li-value">{{ konwledgeDetail.knowledgeSystemFullName || '--' }}</span>
        </li>
      </ul>
      <ul class="person">
        <li>
          <i class="iconimage_icon_Preview1 iconfont" />
          <span>{{ konwledgeDetail.watchNum }}</span>
        </li>
        <li v-show="konwledgeDetail.allowDownload === 0">
          <i class="iconimage_icon_download iconfont" />
          <span>{{ konwledgeDetail.downloadNum }}</span>
        </li>
        <li>
          <i class="iconoperating_ic_favorites iconfont" />
          <span>{{ konwledgeDetail.collectNum }}</span>
        </li>
      </ul>
    </el-card>
    <el-card class="bottom-card" style="min-height: 50vh">
      <el-tabs v-model="activeIndex" @tab-click="handleSelect">
        <el-tab-pane label="资源介绍" name="1">
          <localFile
            :need-load-num="true"
            :apply-detail="{ formId: $route.query.id }"
            :introduction="false"
            :is-show-info="false"
          />
        </el-tab-pane>
        <el-tab-pane label="评论" name="3">
          <Comment
            v-show="activeIndex === '3'"
            :is-comment="konwledgeDetail.isComment"
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
import localFile from '@/views/approvalDetail/applyKnowledgeShare.vue'
import {
  getKnowledgeDetails,
  putWatchOperate,
  getEvaluateList,
  addCourseScope,
  collectOperate,
  saveKnowledgeOperateCredit
} from '@/api/knowledge'
import { dateConver } from '@/util/date'

export default {
  name: 'KnowledgeDetail',
  components: {
    CommonBreadcrumb,
    Comment,
    localFile
  },
  data() {
    return {
      text:
        'sdfdsfsdfsdfsdfsdfsdfsdfsdfdsfxzljclxzjclx四大皆空福利卡死的减肥了绝对是李开复驾驶的飞机上大家从V领行政村滤镜先兆流产出现了可vjljcv;l打错了绝对是拉福建省',
      routeList: [
        {
          path: '/knowledge',
          title: '知识库'
        },
        {
          path: '',
          title: _.get(this.$route.meta, 'title', ' ')
        }
      ],
      previewSrcList: [],
      fileGroup: {},
      activeIndex: '1',
      konwledgeDetail: {
        isCollect: false
      }
    }
  },
  computed: {
    id() {
      const id = _.get(this.$route, 'query.id', null)
      const route = `${id ? `${this.$route.path}?id=${id}` : `${this.$route.path}`}`
      _.set(this.routeList, '[1].path', route)
      return id
    },
    knowType() {
      const type = this.konwledgeDetail.type
      if (type === 1) return '视频'
      else if (type === 2) return '文档'
      else return '资料下载'
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    collectionCourse() {
      collectOperate({
        knowledgeId: this.id
      }).then(() => {
        this.konwledgeDetail.isCollect = this.konwledgeDetail.isCollect === 1 ? 0 : 1
        this.$message({
          type: 'success',
          message: `${this.konwledgeDetail.isCollect ? '收藏成功' : '取消收藏成功'}`
        })
      })
    },
    initData() {
      // 保存知识库学分
      saveKnowledgeOperateCredit({ knowledgeId: this.id })
      putWatchOperate({ knowledgeId: this.id })
      getKnowledgeDetails({ id: this.id }).then((res) => {
        this.konwledgeDetail = res
        this.konwledgeDetail.updateTime = dateConver(this.konwledgeDetail.updateTime)
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
.detail-li {
  font-family: PingFangSC-Regular;
  display: flex;
  align-items: center;
  margin-top: 8px;
  .li-label {
    font-size: 14px;
    color: rgba(0, 11, 21, 0.45);
    letter-spacing: 0;
    line-height: 22px;
  }
  .li-value {
    font-size: 14px;
    color: rgba(0, 11, 21, 0.85);
    letter-spacing: 0;
    line-height: 22px;
    word-break: break-all;
  }
}
.middle-card {
  .card-title {
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: rgba(0, 11, 21, 0.85);
    margin-bottom: 18px;
    display: flex;
    justify-content: space-between;
    align-items: start;

    .left {
      flex: 1;
      word-break: break-all;
    }
    .right {
      display: flex;
      flex-shrink: 0;
      align-items: center;
      span {
        font-size: 12px;
        color: rgba(0, 11, 21, 0.45);
        letter-spacing: 0;
        line-height: 18px;
        margin-left: 25px;
        cursor: pointer;
        .iconoperating_ic_favorites_active {
          color: rgb(247, 186, 42);
        }
      }
    }
  }
  .detail-ul {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 18px;
    flex-wrap: wrap;
    padding-top: 17px;
    li {
      width: 33%;
      flex-shrink: 0;
    }
  }

  .person {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: rgba(0, 11, 21, 0.45);
    display: flex;
    justify-content: flex-start;
    li {
      margin-right: 50px;
      display: flex;
      align-items: center;
      i {
        margin-right: 8px;
      }
      span {
        font-size: 14px;
        color: rgba(0, 11, 21, 0.85);
        letter-spacing: 0.5px;
        line-height: 22px;
        font-weight: 600;
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
.online li {
  display: flex;
  align-items: start;
}
::v-deep .el-tabs__header.is-top {
  margin-bottom: 28px;
}
</style>
