<template>
  <div class="examinationTab">
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
      <!-- 是否通过: 0-否 1-是 -->
      <template slot="isPass" slot-scope="{ row }">
        <span v-if="row.isPass == 0">不通过</span>
        <span v-if="row.isPass == 1"> 通过</span>
      </template>

      <template slot="handler" slot-scope="scope">
        <el-button type="text" @click="toAnswer(scope.row)">
          考试详情
        </el-button>
      </template>
    </common-table>
  </div>
</template>

<script>
// 表格属性
const TABLE_COLUMNS = [
  {
    label: '序号',
    type: 'index',
    width: 80
  },
  {
    label: '考试名称',
    prop: 'courseName'
  },
  {
    label: '考试日期',
    prop: 'joinNumValue',
    slot: true
  },
  {
    label: '状态',
    prop: 'score'
  },
  {
    label: '考试时长(分钟)',
    prop: 'isPass',
    slot: true
  },
  {
    label: '通过率',
    prop: 'status',
    slot: true
  }
]
const TABLE_CONFIG = {
  handlerColumn: {
    width: 200
  },
  enableMultiSelect: true, //复选框
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
      pitch: 'CurrencyExam',
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
      tableData: [{}, {}],
      tablePageConfig: TABLE_PAGE_CONFIG
    }
  },

  created() {
    this.getInfo()
  },
  activated() {
    this.getInfo()
  },
  methods: {
    toAnswer() {
      this.$router.push({ path: '/examinationDetail', query: {} })
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
      // currentPage	当前页	body	true
      // size	页面显示数量	body	true
      //   let params = {
      //     type: this.pitch, //考试类型 CurrencyExam-通用考试 CourseExam-课程考试 TrainExam-培训班考试
      //     name: this.searchInput
      //   }
      //   let res = await examList({ ...params, ...this.page })
      //   this.tableData = res.data
      //   this.page.total = res.totalNum
    }
  }
}
</script>

<style lang="scss" scoped>
.examinationTab {
  margin-top: 20px;
}
</style>
