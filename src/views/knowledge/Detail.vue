<template>
  <div>
    <common-breadcrumb ref="breadcrumb" />
    <el-card class="middle-card">
      <div class="card-title">
        {{ konwledgeDetail.title }}
      </div>
      <ul class="detail-ul">
        <li class="detail-li">
          <span class="li-label">提供人：</span>
          <span class="li-value">张大轩</span>
        </li>
        <li class="detail-li">
          <span class="li-label">所在目录：</span>
          <span class="li-value">Java技能课程/Java高级培训</span>
        </li>
        <li class="detail-li">
          <span class="li-label">更新时间：</span>
          <span class="li-value">2020-10-10 12:12</span>
        </li>
      </ul>
      <ul class="person">
        <li>
          <i class="iconimage_icon_Preview1 iconfont" />
          <span>25</span>
        </li>
        <li>
          <i class="iconimage_icon_comment iconfont" />
          <span>99</span>
        </li>
        <li>
          <i class="iconimage_icon_download iconfont" />
          <span>16</span>
        </li>
      </ul>
    </el-card>
    <el-card class="bottom-card">
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        :active-text-color="activeColor"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item index="1">
          资源介绍
        </el-menu-item>
        <el-menu-item index="2">
          附件
        </el-menu-item>
        <el-menu-item index="3">
          评论
        </el-menu-item>
      </el-menu>
      <div style="padding: 20px 0; min-height:50vh">
        <div v-if="activeIndex === '1'">
          <div
            v-if="konwledgeDetail.introduction"
            v-html="_.unescape(konwledgeDetail.introduction)"
          />
          <common-empty
            v-else
            style="height: 35vh;"
          />
        </div>
        <section v-if="activeIndex === '2'">
          <div class="image-ul">
            <div
              v-for="(item, index) in fileGroup.true"
              :key="index"
            >
              <common-image-view
                :url="item.url"
                :file-name="item.fileName"
                :is-download="konwledgeDetail.allowDownload === 1"
                :preview-src-list="previewSrcList"
                @downloadFile="downloadFile"
              />
            </div>
          </div>
          <ul
            v-for="(item, index) in fileGroup.false"
            :key="index"
          >
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
        </section>
        <Comment v-if="activeIndex === '3'" />
      </div>
    </el-card>
  </div>
</template>

<script>
import styles from '@/styles/variables.scss'
import Comment from './Comment'
import CommonBreadcrumb from '@/components/common-breadcrumb/breadcrumb'
import CommonEmpty from '@/components/common-empty/empty'
export default {
  name: 'KnowledgeDetail',
  components: {
    CommonImageView: '@/components/common-image-viewer/viewer',
    CommonEmpty,
    CommonBreadcrumb,
    Comment
  },
  data() {
    return {
      previewSrcList: [],
      fileGroup: {},
      activeColor: styles.primaryColor,
      activeIndex: '1',
      konwledgeDetail: {
        title: 'Java 函数式编程'
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.breadcrumb.setBreadcrumbTitle(this.konwledgeDetail.title)
    })
  },
  methods: {
    downloadAll() {},
    /**
     * 处理nav切换
     */
    handleSelect(key) {
      this.activeIndex = key
    }
  }
}
</script>

<style scoped lang="scss">
.middle-card {
  margin-top: 16px;
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
