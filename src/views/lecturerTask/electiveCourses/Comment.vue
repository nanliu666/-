<template>
  <div class="comment-styles">
    <div v-if="!_.isEmpty(commentList)" class="comment-bottom">
      <ul class="comment-ul">
        <li v-for="(item, index) in commentList" :key="index" class="comment-li">
          <div class="li-top">
            <el-avatar size="small" :src="item.avatarUrl || circleUrl"></el-avatar>
            <span class="title-name">{{ item.userName }}</span>
          </div>
          <div style="padding-left: 36px">
            <div class="li-middle">
              {{ item.createTime }}
            </div>
            <el-rate
              v-model="item.scope"
              disabled
              allow-half
              show-score
              score-template="{value}分"
            ></el-rate>
            <div class="li-bottom">
              {{ item.remark }}
            </div>
          </div>
        </li>
      </ul>
      <el-pagination
        class="pagination-box"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="listParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
    <common-empty v-else />
  </div>
</template>

<script>
import CommonEmpty from '@/components/common-empty/Empty'
export default {
  name: 'Comment',
  components: {
    CommonEmpty
  },
  props: {
    load: {
      type: Function,
      default: () => new Promise((resolve) => resolve({}))
    },
    submit: {
      type: Function,
      default: () => new Promise((resolve) => resolve({}))
    },
    name: {
      type: String,
      default: '课程'
    },
    isEditable: {
      type: Boolean,
      default: true
    },
    hasHandle: {
      type: Boolean,
      default: true
    },
    disableText: {
      type: String,
      default: '您还未学习本课程，暂不能对课程评价，先去学习再来评价哦~'
    }
  },
  data() {
    return {
      circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      hasPublish: true,
      totalNum: 100,
      scopeParams: {
        remark: '',
        scope: 0
      },
      listParams: {
        pageNo: 1,
        pageSize: 10
      },
      commentList: []
    }
  },
  // watch: {
  //   'scopeParams.scope': {
  //     handler(val) {
  //       if (val > 0) {
  //         this.hasPublish = false
  //         val = Number(val)
  //       }
  //     },
  //     deep: true
  //   }
  // },
  created() {
    this.loadList()
  },
  methods: {
    handleSizeChange(val) {
      this.listParams.pageSize = val
      this.loadList()
    },
    handleCurrentChange(val) {
      this.listParams.pageNo = val
      this.loadList()
    },
    loadList() {
      this.load(this.listParams).then(({ data, totalNum }) => {
        // 转成数字类型
        _.each(data, (item) => {
          item.scope = Number(item.scope)
        })
        this.commentList = data
        this.totalNum = totalNum
      })
    },
    inputFocus() {
      this.hasPublish = false
    },
    publish() {
      if (this.scopeParams.remark.trim() || this.scopeParams.scope) {
        this.submit(this.scopeParams).then(() => {
          this.hasPublish = true
          this.scopeParams.remark = ''
          this.scopeParams.scope = 0
          this.loadList()
        })
      } else {
        this.$message.error('发布内容不能为空！！！')
      }
    }
  }
}
</script>

<style scoped lang="scss">
.comment-styles {
  .comment-top {
    margin-bottom: 28px;

    .top-title {
      display: flex;
      align-items: center;
      margin-bottom: 24px;
      .title {
        font-weight: 550;
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: rgba(0, 11, 21, 0.85);
      }
    }
    .button-box {
      margin-top: 16px;
      float: right;
    }
  }
  .disabled-text {
    padding: 24px;
    background-color: #f2f2f2;
  }
  .comment-bottom {
    .comment-ul {
      .comment-li {
        margin-bottom: 25px;
        &:last-child {
          margin-bottom: 0;
        }
        .li-top {
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: rgba(0, 11, 21, 0.85);
          display: flex;
          align-items: center;
          margin-bottom: 8px;
          .title-name {
            margin-left: 8px;
          }
        }
        .li-middle {
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: rgba(0, 11, 21, 0.45);
          margin-bottom: 8px;
        }
        .li-bottom {
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: rgba(0, 11, 21, 0.85);
          margin-top: 8px;
          word-break: break-all;
        }
      }
    }
    .pagination-box {
      float: right;
    }
  }
}
</style>
