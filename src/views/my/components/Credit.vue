<template>
  <div class="credit">
    <div class="date_bar">
      <div class="bar_l">
        <div class="title">
          学分合计：
        </div>
        <div class="text">
          {{ resDate.totalScore }}
        </div>
      </div>
      <div class="bar_r">
        <div class="title">
          昨日学时：
        </div>
        <div class="text">
          {{ resDate.yesterdayPeriod }}
        </div>
        <span></span>
        <div class="title">
          当月学时：
        </div>
        <div class="text">
          {{ resDate.monthPeriod }}
        </div>
        <span></span>
        <div class="title">
          学时合计：
        </div>
        <div class="text">
          {{ resDate.totalPeriod }}
        </div>
      </div>
    </div>
    <div class="table_box">
      <div class="sehrch_bar">
        <div class="bar">
          <div :class="{ btn: sehrchBtn === 0 }" @click="showBtn(0)">
            系统学分
          </div>
          <div :class="{ btn: sehrchBtn === 1 }" @click="showBtn(1)">
            考评学分
          </div>
        </div>
        <div class="sehrch">
          <div class="sehrch_input">
            <el-input
              v-show="sehrchBtn === 0"
              v-model="searchInput"
              placeholder="查询我的系统学分"
            ></el-input>
            <el-input
              v-show="sehrchBtn === 1"
              v-model="searchInput"
              placeholder="查询我的考评学分"
            ></el-input>
          </div>
          <div class="sehrch_btn">
            <el-button v-show="searchInput" type="primary" size="medium" @click="searchInput = ''">
              重置
            </el-button>
          </div>
        </div>
      </div>
      <div class="select_bar">
        <span>类型：</span>
        <span :class="{ typeBtn: sysRuleSource === '' }" @click="sysRuleSource = ''">全部</span>
        <span
          v-show="sehrchBtn === 0"
          :class="{ typeBtn: sysRuleSource === '登录学分' }"
          @click="sysRuleSource = '登录学分'"
        >登录学分</span>
        <span
          v-show="sehrchBtn === 0"
          :class="{ typeBtn: sysRuleSource === '在线学习学分' }"
          @click="sysRuleSource = '在线学习学分'"
        >在线学习学分</span>
        <span
          v-show="sehrchBtn === 0"
          :class="{ typeBtn: sysRuleSource === '知识库学分' }"
          @click="sysRuleSource = '知识库学分'"
        >知识库学分</span>
        <span
          v-show="sehrchBtn === 0"
          :class="{ typeBtn: sysRuleSource === '资源共享学分' }"
          @click="sysRuleSource = '资源共享学分'"
        >资源共享学分</span>

        <span
          v-show="sehrchBtn === 1"
          :class="{ typeBtn: sysRuleSource === '课程学分' }"
          @click="sysRuleSource = '课程学分'"
        >课程学分</span>
        <span
          v-show="sehrchBtn === 1"
          :class="{ typeBtn: sysRuleSource === '考试学分' }"
          @click="sysRuleSource = '考试学分'"
        >考试学分</span>
        <span
          v-show="sehrchBtn === 1"
          :class="{ typeBtn: sysRuleSource === '培训学分' }"
          @click="sysRuleSource = '培训学分'"
        >培训学分</span>
      </div>
      <div class="select_date">
        <span>日期: &nbsp; &nbsp;</span>
        <el-date-picker
          v-model="dateValue"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
        >
        </el-date-picker>
        &nbsp; &nbsp;&nbsp; &nbsp;
        <el-button type="primary" size="medium" @click="getInfo">
          查询
        </el-button>
      </div>

      <div v-show="tableData.length" class="table">
        <common-table
          ref="table"
          :columns="columnsVisible | columnsFilter"
          :config="tableConfig"
          :data="tableData"
          :page-config="tablePageConfig"
          :page="page"
          @current-page-change="handleCurrentPageChange"
          @page-size-change="handlePageSizeChange"
        >
          <!-- 状态 -->
          <!-- （2：已通过；3：未通过；4：未考试；5：缺考） -->
          <template slot="examStatus" slot-scope="{ row }">
            <span v-if="row.electiveType === 2">已通过</span>
            <span v-if="row.electiveType === 3">未通过</span>
            <span v-if="row.electiveType === 4">未考试</span>
            <span v-if="row.electiveType === 5">缺考</span>
          </template>

          <!-- 是否及格 -->
          <template slot="examPass" slot-scope="{ row }">
            <span v-if="row.examPass === 0">不及格</span>
            <span v-if="row.examPass === 1">及格</span>
          </template>
        </common-table>
      </div>

      <!-- 无数据 -->
      <div v-show="!tableData.length" class="content">
        <div class="content_box">
          <img src="@/assets/images/my_noData.png" alt="" />
          <div class="text">
            还没有累计的学分
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { summary, scoreList } from '@/api/my'
// 表格属性
const TABLE_COLUMNS = [
  {
    label: '学分来源',
    prop: 'stuName',
    minWidth: 180
  },
  {
    label: '学分类型',
    prop: 'sysRuleSource',
    minWidth: 150
  },
  {
    label: '分值',
    prop: 'score',
    minWidth: 180
  },
  // {
  //   label: '是否通过',
  //   prop: 'examStatus',
  //   slot: true
  // },
  {
    label: '获得时间',
    prop: 'createTime'
  }
]
const TABLE_CONFIG = {
  // handlerColumn: {
  //   width: 200
  // },
  enablePagination: true,
  // showHandler: true,
  showIndexColumn: false
}
const TABLE_PAGE_CONFIG = {}

export default {
  filters: {
    // 过滤不可见的列
    columnsFilter: (visibleColProps) =>
      _.filter(TABLE_COLUMNS, ({ prop }) => _.includes(visibleColProps, prop))
  },

  data() {
    return {
      sysRuleSource: '', //学分类型
      resDate: {}, //学分学时汇总
      sehrchBtn: 0,
      dateValue: '',
      searchInput: '',
      pitch: 0,
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },

      // 默认选中所有列
      columnsVisible: _.map(TABLE_COLUMNS, ({ prop }) => prop),
      // query: {},
      tableColumns: TABLE_COLUMNS,
      tableConfig: TABLE_CONFIG,
      tableData: [],
      tablePageConfig: TABLE_PAGE_CONFIG
    }
  },
  watch: {
    searchInput: function() {
      this.getInfo()
    }
  },
  created() {
    this.getInfo()
    this.getresDate()
  },
  activated() {
    this.getInfo()
    this.getresDate()
  },
  methods: {
    showBtn(i) {
      this.sehrchBtn = i
      this.dateValue = ''
      this.sysRuleSource = ''
      this.searchInput = ''
      this.getInfo()
    },
    //  处理页码改变
    handleCurrentPageChange(param) {
      this.page.pageNo = param
      this.getInfo()
    },
    handlePageSizeChange(param) {
      this.page.pageSize = param
      this.getInfo()
    },

    // 拿数据
    async getInfo() {
      // 学时
      //search 搜索栏值
      //type 类型-系统学分/考评学分
      //startTime
      //endTime
      //sysRuleSource 学分类型-登录学分/在线学习学分/知识库学习学分/资源共享学分（直接传中文就行）
      let params = {
        search: this.searchInput,
        type: this.sehrchBtn,
        startTime: this.dateValue[0],
        endTime: this.dateValue[1],
        sysRuleSource: this.sysRuleSource
      }
      let res = await scoreList({ ...params, ...this.page })
      this.tableData = res.data
      this.page.total = res.totalNum
    },
    async getresDate() {
      this.resDate = await summary()
    }
  }
}
</script>

<style lang="scss" scoped>
.credit {
  .date_bar {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    height: 56px;
    line-height: 56px;
    background: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
    border-radius: 4px;
    padding: 0 24px;
    .title {
      font-size: 16px;
      color: rgba(0, 11, 21, 0.45);
      letter-spacing: 0;
    }
    .text {
      font-size: 16px;
      color: rgba(0, 11, 21, 0.85);
      letter-spacing: 0;
    }
    .bar_l {
      display: flex;
    }
    .bar_r {
      display: flex;
    }
    span {
      display: inline-block;
      background: #d9dbdc;
      height: 16px;
      width: 1px;
      margin: 20px 16px;
    }
  }
  .table_box {
    margin-top: 24px;
    padding: 24px;
    background: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
    border-radius: 4px;
    .sehrch_bar {
      display: flex;
      justify-content: space-between;
      height: 56px;
      line-height: 56px;
      border-bottom: 1px solid #ebeced;

      .bar {
        display: flex;
        font-size: 16px;
        color: rgba(0, 11, 21, 0.65);
        letter-spacing: 0;
        text-align: center;
        div {
          margin-right: 32px;
        }
        .btn {
          font-size: 16px;
          color: #01aafc;
          letter-spacing: 0;
          text-align: center;
          border-bottom: 2px solid #01aafc;
        }
      }
      .sehrch {
        display: flex;
        .sehrch_input {
          width: 380px;
        }
        .sehrch_btn {
          margin-left: 20px;
        }
      }
    }
    .select_bar {
      margin-top: 24px;
      font-size: 14px;
      color: rgba(0, 11, 21, 0.85);
      letter-spacing: 0;
      display: flex;
      span {
        margin-right: 16px;
        cursor: pointer;
      }
      .typeBtn {
        color: #01aafc;
        font-weight: bold;
      }
    }
    .select_date {
      margin-top: 24px;
      display: flex;
      line-height: 30px;
      font-size: 14px;
      color: rgba(0, 11, 21, 0.85);
      letter-spacing: 0;
    }
    .table {
      margin-top: 16px;
    }
  }
  .content {
    background: #ffffff;
    border-radius: 4px;
    width: 1200px;
    height: 627px;
    display: flex;
    display: flex;
    justify-content: center;
    align-items: center;
    .content_box {
      width: 338px;
      height: 290px;
      img {
        width: 100%;
        height: 100%;
      }
      .text {
        text-align: center;
        margin-top: 16px;
        font-size: 14px;
        color: rgba(0, 11, 21, 0.65);
        letter-spacing: 0;
      }
    }
  }
}
</style>
