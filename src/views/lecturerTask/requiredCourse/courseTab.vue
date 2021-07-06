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
      <template slot="startTime" slot-scope="{ row }">
        {{ row.startTime }} - {{ row.endTime }}
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
import { getLearningCourseList } from '@/api/lecturerTask'
// 表格属性
const TABLE_COLUMNS = [
  {
    label: '序号',
    type: 'index',
    width: 80
  },
  {
    label: '课程名称',
    prop: 'name'
  },
  {
    label: '授课日期',
    prop: 'startTime',
    slot: true,
    width: 320
  },
  {
    label: '状态',
    prop: 'status',
    formatter: (row) => {
      const END_STATUS = {
        1: '未开始',
        2: '进行中',
        3: '已结束'
      }
      return END_STATUS[row.status]
    }
  },
  {
    label: '通过条件',
    prop: 'passCondition',
    formatter: (row) => {
      const END_STATUS1 = {
        a: '教师评定',
        b: '考试通过',
        c: '达到课程学时'
      }
      let list = row.passCondition.split(',')
      let returnData = []
      list.forEach((item) => {
        returnData.push(END_STATUS1[item])
      })
      return returnData.join(',')
    }
  },
  {
    label: '学习通过率',
    prop: 'passRate',
    formatter: (row) => {
      return row.passRate + '%'
    }
  },
  {
    label: '作业提交率',
    prop: 'jobSubmitRate',
    formatter: (row) => {
      return row.jobSubmitRate + '%'
    }
  },
  {
    label: '允许学习次数',
    prop: 'studyFrequency'
  }
]
const TABLE_CONFIG = {
  // handlerColumn: {
  //   width: 200
  // },
  enableMultiSelect: false, //复选框
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
      tableData: [],
      tablePageConfig: TABLE_PAGE_CONFIG
    }
  },

  created() {
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
      let params = {
        ...this.page,
        id: this.$route.query.id
      }
      let { data, totalNum } = await getLearningCourseList(params)
      this.page.total = totalNum
      this.tableData = data
    }
  }
}
</script>

<style lang="scss" scoped>
.courseTab {
  margin-top: 20px;
  /deep/.cell:empty::before {
    content: '--';
    color: gray;
  }
}
</style>
