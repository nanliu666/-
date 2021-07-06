<template>
  <div class="rsignUp">
    <ul class="top_title">
      <li>
        <span>计划人数：</span>
        <span> {{ statisticsData.people || 0 }} 人 </span>
      </li>
      <li>
        <span>人均费用：</span>
        <span> {{ statisticsData.costBudget || 0 }} 元 </span>
      </li>
      <li>
        <span>已参加：</span>
        <span> {{ statisticsData.join || 0 }} 人 </span>
      </li>
      <li>
        <span>剩余名额：</span>
        <span> {{ statisticsData.leave || 0 }} 人 </span>
      </li>
    </ul>

    <common-table
      ref="table"
      class="table_"
      :columns="columnsVisible | columnsFilter"
      :config="tableConfig"
      :data="tableData"
      :page-config="tablePageConfig"
      :page="page"
      @current-page-change="handleCurrentPageChange"
      @page-size-change="handlePageSizeChange"
    >
    </common-table>
  </div>
</template>

<script>
import { count, signUp } from '@/api/lecturerTask'
// 表格属性
const TABLE_COLUMNS = [
  {
    label: '名字',
    prop: 'userName'
  },
  {
    label: '手机号',
    prop: 'phone'
  },
  {
    label: '所属部门',
    prop: 'dept'
  },
  {
    label: '是否指定学员',
    prop: 'appointTrainee',
    formatter: (row) => {
      const END_STATUS = {
        0: '否',
        1: '是'
      }
      return END_STATUS[row.appointTrainee]
    }
  },
  {
    label: '审批状态',
    prop: 'status',
    formatter: (row) => {
      const END_STATUS = {
        1: '审批中',
        2: '已通过',
        3: '已撤回'
      }
      return END_STATUS[row.endStatus]
    }
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
      statisticsData: {},
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
        trainId: this.$route.query.id
      }
      let { data, totalNum } = await signUp(params)
      this.page.total = totalNum
      this.tableData = data

      this.statisticsData = await count({ trainId: this.$route.query.id })
    }
  }
}
</script>

<style lang="scss" scoped>
.rsignUp {
  margin-top: 20px;
  .top_title {
    display: flex;
    color: #333;
    margin-bottom: 20px;
    font-size: 14px;
    li {
      margin-right: 24px;
    }
  }
  .table_ {
  }
  /deep/.cell:empty::before {
    content: '--';
    color: gray;
  }
}
</style>
