<template>
  <!-- 培训主页面 首页 -->
  <div
    ref="train"
    class="train layout"
  >
    <div class="layout_search bgStyle">
      <el-input v-model="searchCondition.name" />
      <div class="line"></div>
      <div class="search_container">
        <span>类型:</span>
        <el-radio-group v-model="searchCondition.type">
          <el-radio :label="3">
            全部
          </el-radio>
          <el-radio :label="6">
            面授
          </el-radio>
          <el-radio :label="9">
            在线
          </el-radio>
          <el-radio :label="1">
            混合
          </el-radio>
        </el-radio-group>
      </div>
      <div class="search_container">
        <span>状态:</span>
        <el-radio-group v-model="searchCondition.state">
          <el-radio :label="3">
            全部
          </el-radio>
          <el-radio :label="6">
            未开始
          </el-radio>
          <el-radio :label="9">
            进行中
          </el-radio>
          <el-radio :label="1">
            已结办
          </el-radio>
        </el-radio-group>
      </div>
      <div class="search_container">
        <span>日期:</span>
        <el-date-picker
          v-model="searchCondition.date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
        <el-button
          type="primary"
          class="searchBtn"
          size="medium"
        >
          查询
        </el-button>
      </div>
    </div>
    <ul class="layout_content">
      <li
        v-for="item in 5"
        :key="item"
        class="layout_list bgStyle"
      >
        <div class="list_header clearfix">
          java编程培训<span class="header_type going">进行中</span>
          <el-button
            v-if="true"
            class="header_btn"
            type="primary"
            size="medium"
          >
            前往学习
          </el-button>
          <el-button
            v-else
            class="header_btn"
            size="medium"
          >
            查看详情
          </el-button>
        </div>
        <div class="list_content">
          <div><span>培训类型:</span>面授</div>
          <div><span>培训时间:</span>2018年10月10日 —2018年11月11日</div>
          <div><span>培训讲师:</span>马云</div>
          <div><span>培训地点:</span>花神科技园3栋402</div>
        </div>
        <i></i>
      </li>
    </ul>
    <!-- <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400">
      </el-pagination> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchCondition: {
        name: '', // 培训名称/讲师
        type: '', // 类型
        state: '', // 状态
        date: [] // 日期
      },
      total: 100 // 总页数
    }
  },
  mounted() {
    let domHeight = document.body.clientHeight
    this.$refs.train.style.height = domHeight
  }
}
</script>

<style lang="scss" scoped>
.train.layout {
  padding-top: 24px;
  .clearfix {
    &::after {
      content: '';
      clear: both;
      display: block;
    }
  }
  .bgStyle {
    background: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
    border-radius: 4px;
  }
  .layout_search {
    padding: 24px;
    box-sizing: border-box;
    margin-bottom: 20px;
    .el-input {
      width: 380px;
      margin-bottom: 16px;
    }
    .line {
      border-top: 1px solid #ebeced;
    }
    .search_container {
      font-size: 14px;
      line-height: 22px;
      margin-top: 16px;
      & > span {
        color: rgba(0, 11, 21, 0.45);
      }
      /deep/.el-radio__input {
        display: none;
      }
      .searchBtn {
        margin-left: 16px;
      }
      .el-date-editor {
        margin-left: 8px;
        vertical-align: middle;
      }
    }
    .el-radio__label {
      color: rgba(0, 11, 21, 0.85);
    }
  }
  .layout_content {
    .layout_list {
      margin-bottom: 20px;
      padding: 24px;
      .list_header {
        font-size: 18px;
        color: rgba(0, 11, 21, 0.85);
        .header_type {
          font-size: 12px;
          width: 52px;
          // padding: 2px 4px;
          display: inline-block;
          text-align: center;
          line-height: 20px;
          margin-left: 8px;
          &.going {
            color: #fcba00;
            background-color: #fffce6;
          }
          &.noStart {
            color: #00b061;
            background-color: #e7ffee;
          }
          &.reserved {
            color: #01aafc;
            background-color: #e7fbff;
          }
        }
        .header_btn {
          float: right;
        }
      }
      .list_content {
        & > div {
          display: inline-block;
          width: 33.333%;
          font-size: 14px;
          color: rgba(0, 11, 21, 0.85);
          & > span {
            color: rgba(0, 11, 21, 0.45);
          }
          &:nth-child(4) {
            margin-top: 16px;
          }
        }
      }
    }
  }
}
</style>
