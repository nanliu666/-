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
        <el-button type="text" @click="toAnswer(scope.row)"> 考试详情 </el-button>
      </template>
    </common-table>
  </div>
</template>

<script>
import { liveExamInfo } from '@/api/lecturerTask'
// 表格属性
const TABLE_COLUMNS = [
  {
    label: '序号',
    type: 'index',
    width: 80
  },
  {
    label: '考试名称',
    prop: 'examName'
  },
  {
    label: '考试日期',
    prop: 'examBeginTime',
    width: 220,
    formatter: (row) => {
      return row.examBeginTime + '-' + row.examEndTime
    }
  },
  {
    label: '状态',
    prop: 'status',
    formatter: (row) => {
      const END_STATUS = {
        0: '未开始',
        1: '进行中',
        3: '已结束'
      }
      return END_STATUS[row.status]
    }
  },
  {
    label: '考试时长(分钟)',
    prop: 'reckonTimeValue',
    formatter: (row) => (!+row.reckonTime ? '不限制' : row.reckonTimeValue)
  },
  {
    label: '通过率',
    prop: 'passRate',
    formatter: (row) => {
      return row.passRate + '%'
    }
  }
]
const TABLE_CONFIG = {
  handlerColumn: {
    width: 200
  },
  enableMultiSelect: false, //复选框
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
      tableData: [],
      tablePageConfig: TABLE_PAGE_CONFIG
    }
  },

  created() {
    this.getInfo()
  },

  methods: {
    toAnswer(row) {
      // console.log(row);
      // return
      this.$router.push({ path: '/liveExaminationDetail', query: { id: row.examId } })
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
      let params = {
        ...this.page,
        bizId: this.$route.query.id
      }
      let { records, total } = await liveExamInfo(params)
      this.page.total = total
      this.tableData = records
    }
  }
}
</script>

<style lang="scss" scoped>
.examinationTab {
  margin-top: 20px;
  /deep/.cell:empty::before {
    content: '--';
    color: gray;
  }
}
</style>
