<template>
  <div class="credit">
    <div class="date_bar">
      <div class="bar_l">
        <div class="title">
          学分合计：
        </div>
        <div class="text">
          120.1
        </div>
      </div>
      <div class="bar_r">
        <div class="title">
          学分合计：
        </div>
        <div class="text">
          120.1h
        </div>
        <span></span>
        <div class="title">
          学分合计：
        </div>
        <div class="text">
          120.1h
        </div>
        <span></span>
        <div class="title">
          学分合计：
        </div>
        <div class="text">
          120.1h
        </div>
      </div>
    </div>
    <div class="table_box">
      <div class="sehrch_bar">
        <div class="bar">
          <div
            :class="{ btn: sehrchBtn === 0 }"
            @click="showBtn(0)"
          >
            系统学分
          </div>
          <div
            :class="{ btn: sehrchBtn === 1 }"
            @click="showBtn(1)"
          >
            考评学分
          </div>
        </div>
        <div class="sehrch">
          <el-input placeholder="请输入内容"></el-input>
        </div>
      </div>
      <div class="select_bar">
        <span>类型：</span>
        <span>全部</span>
        <span>登陆学分</span>
        <span>创在线学习学分</span>
        <span>知识库学分</span>
        <span>资源共享学分</span>
      </div>
      <div class="select_date">
        <span>日期: &nbsp; &nbsp;</span>
        <el-date-picker
          v-model="value1"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
        &nbsp; &nbsp;&nbsp; &nbsp;
        <el-button
          type="primary"
          size="medium"
        >
          查询
        </el-button>
      </div>

      <div class="table">
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
          <template
            slot="examStatus"
            slot-scope="{ row }"
          >
            <span v-if="row.electiveType === 2">已通过</span>
            <span v-if="row.electiveType === 3">未通过</span>
            <span v-if="row.electiveType === 4">未考试</span>
            <span v-if="row.electiveType === 5">缺考</span>
          </template>

          <!-- 是否及格 -->
          <template
            slot="examPass"
            slot-scope="{ row }"
          >
            <span v-if="row.examPass === 0">不及格</span>
            <span v-if="row.examPass === 1">及格</span>
          </template>
        </common-table>
      </div>
    </div>
  </div>
</template>

<script>
// 表格属性
const TABLE_COLUMNS = [
  {
    label: '学分来源',
    prop: 'createName',
    minWidth: 180
  },
  {
    label: '学分类型',
    prop: 'phone',
    minWidth: 150
  },
  {
    label: '分值',
    prop: 'deptName',
    minWidth: 180
  },
  // {
  //   label: '是否通过',
  //   prop: 'examStatus',
  //   slot: true
  // },
  {
    label: '获得时间',
    prop: 'examTime'
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
      sehrchBtn: 0,
      value1: '',
      searchInput: '',
      pitch: 0,
      page: {
        currentPage: 1,
        size: 10,
        total: 0
      },

      // 默认选中所有列
      columnsVisible: _.map(TABLE_COLUMNS, ({ prop }) => prop),
      // query: {},
      tableColumns: TABLE_COLUMNS,
      tableConfig: TABLE_CONFIG,
      tableData: [
        {
          isRecommend: 1,
          passCondition: 'c',
          catalogId: 4,
          teacherId: 4,
          isTop: 1,
          createId: 4,
          name: 'dd',
          electiveType: 2,
          id: 4,
          type: 2,
          createName: '小红'
        },
        {
          isRecommend: 1,
          passCondition: 'c',
          catalogId: 4,
          teacherId: 4,
          isTop: 1,
          createId: 4,
          name: 'dd',
          electiveType: 2,
          id: 4,
          type: 2,
          createName: '小红'
        },
        {
          isRecommend: 1,
          passCondition: 'c',
          catalogId: 4,
          teacherId: 4,
          isTop: 1,
          createId: 4,
          name: 'dd',
          electiveType: 2,
          id: 4,
          type: 2,
          createName: '小红'
        }
      ],
      tablePageConfig: TABLE_PAGE_CONFIG
    }
  },
  created() {},
  activated() {
    this.getInfo()
  },
  methods: {
    showBtn(i) {
      this.sehrchBtn = i
    },
    // 查询培训考试结果列表
    isExamResult() {},

    // 查询培训考试安排详情
    isExamDetail() {},

    //  处理页码改变
    handleCurrentPageChange(param) {
      this.page.currentPage = param
      this.isExamResult()
    },
    handlePageSizeChange(param) {
      this.page.size = param
      this.isExamResult()
    }

    // 拿数据
    // getInfo(courseName) {
    //   // currentPage	当前页	body	true
    //   // size	页面显示数量	body	true
    // },
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
        width: 380px;
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
}
</style>
