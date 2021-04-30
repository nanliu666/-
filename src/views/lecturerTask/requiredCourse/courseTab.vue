<template>
  <div class="courseTab">
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

      <!-- <template slot="handler" slot-scope="scope">
        <el-button
          v-if="scope.row.status == 6 || scope.row.status == 4"
          type="text"
          disabled
          @click="toAnswer(scope.row)"
        >
          查看答卷
        </el-button>
        <el-button v-else type="text" @click="toAnswer(scope.row)">
          查看答卷
        </el-button>
      </template> -->
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
    label: '课程名称',
    prop: 'courseName'
  },
  {
    label: '受课日期',
    prop: 'joinNumValue',
    slot: true
  },
  {
    label: '状态',
    prop: 'score'
  },
  {
    label: '通过条件',
    prop: 'isPass',
    slot: true
  },
  {
    label: '学习通过率',
    prop: 'status',
    slot: true
  },
  {
    label: '作业提交率',
    prop: 'status1',
    slot: true
  },
  {
    label: '允许学习次数',
    prop: 'statu2',
    slot: true
  }
]
const TABLE_CONFIG = {
  // handlerColumn: {
  //   width: 200
  // },
  enableMultiSelect: true, //复选框
  enablePagination: true,
  showHandler: false,
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
.courseTab {
  margin-top: 20px;
}
</style>
