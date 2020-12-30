<template>
  <div class="cultivate">
    <div class="search">
      <div class="search_btn">
        <span
          :class="{ pitch: pitch === 0 }"
          @click="showBtn(0)"
        >通用考试</span>
        <span
          :class="{ pitch: pitch === 1 }"
          @click="showBtn(1)"
        >课程考试</span>
        <span
          :class="{ pitch: pitch === 2 }"
          @click="showBtn(2)"
        >培训班考试</span>
      </div>
      <div class="search_bar">
        <el-input
          v-model="searchInput"
          class="searchInput"
          placeholder="查找我的通过考试"
          suffix-icon="el-icon-search"
        >
        </el-input>

        <el-button
          v-show="searchInput"
          type="primary"
          size="medium"
        >
          重置
        </el-button>
      </div>
    </div>

    <div class="courselist">
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

        <template #handler>
          <el-button type="text">
            查看答卷
          </el-button>
        </template>
      </common-table>
    </div>
  </div>
</template>

<script>
// 表格属性
const TABLE_COLUMNS = [
  {
    label: '考试名称',
    prop: 'stuName',
    minWidth: 180
  },
  {
    label: '考试次数',
    prop: 'phone',
    minWidth: 150
  },
  {
    label: '成绩',
    prop: 'deptName',
    minWidth: 180
  },
  {
    label: '是否通过',
    prop: 'examStatus',
    slot: true
  },
  {
    label: '状态',
    prop: 'examTime'
  }
]
const TABLE_CONFIG = {
  // handlerColumn: {
  //   width: 200
  // },
  enablePagination: true,
  showHandler: true,
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
    },

    // 拿数据
    // getInfo(courseName) {
    //   // currentPage	当前页	body	true
    //   // size	页面显示数量	body	true
    // },

    showBtn(i) {
      this.pitch = i
    }
  }
}
</script>

<style lang="scss" scoped>
.cultivate {
  margin-bottom: -100%;
  .search {
    margin-top: 20px;
    padding: 24px 24px 0;
    background: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    .search_btn {
      height: 56px;
      line-height: 56px;
      display: flex;
      font-size: 16px;
      color: rgba(0, 11, 21, 0.65);
      letter-spacing: 0;
      span {
        margin-right: 32px;
      }
      .pitch {
        font-weight: bold;
        color: #01aafc;
        border-bottom: 2px solid #01aafc;
      }
    }
    .search_bar {
      padding-top: 11px;
      /deep/.el-input {
        width: 380px;
        margin-right: 16px;
      }
    }
  }
  .courselist {
    width: 1200px;
    padding: 24px;
    background-color: #fff;
  }
}
</style>
