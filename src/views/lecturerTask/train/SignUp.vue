<template>
  <div class="rsignUp">
    <ul class="top_title">
      <li>
        <span>计划人数：</span>
        <span v-if="statisticsData.plannedPopulation == 0"> 无限制 </span>
        <span v-else> {{ statisticsData.plannedPopulation }} 人 </span>
      </li>
      <li>
        <span>已参加：</span>
        <span> {{ statisticsData.participated || 0 }} 人 </span>
      </li>
      <li>
        <span>剩余名额：</span>
        <span> {{ statisticsData.remainingPlaces || 0 }} 人 </span>
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
      <template #multiSelectMenu="{ selection }">
        <el-button style="margin-bottom: 0" type="text" @click="() => handleRemoveItems(selection)">
          批量拒绝
        </el-button>
      </template>
      <template slot="Name" slot-scope="{ row }">
        <el-button type="text">{{ row.Name }}</el-button>
      </template>

      <template slot="handler" slot-scope="scope">
        <el-button type="text" @click="isApprovalTrainApplyJoin(scope.row, 'agree')">
          同意
        </el-button>
        <el-button type="text" @click="isApprovalTrainApplyJoin(scope.row, 'reject')">
          拒绝
        </el-button>
      </template>
    </common-table>
  </div>
</template>

<script>
import { queryTrainApplyJoinList, statistics, approvalTrainApplyJoin } from '@/api/lecturerTask'
// import { forEach } from 'node_modules/jszip'
// 表格属性
const TABLE_COLUMNS = [
  {
    label: '名字',
    prop: 'name'
  },
  {
    label: '手机号',
    prop: 'phonenum'
  },
  {
    label: '所属部门',
    prop: 'orgName'
  }
]
const TABLE_CONFIG = {
  // handlerColumn: {
  //   width: 200
  // },
  rowKey: 'signUpId',
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
      tableData: [],
      statisticsData: {},
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
    // 批量操作
    handleRemoveItems(selection) {
      console.log(selection)
      let params = {
        signUpId: [],
        type: 'reject',
        rejectDesc: '',
        trainId: this.$route.query.id // '1383334937523924993' //
      }
      selection.forEach((item) => {
        params.signUpId.push(item.signUpId)
      })
      approvalTrainApplyJoin(params).then(() => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.$refs.table.clearSelection()
        this.getInfo()
      })
    },
    isApprovalTrainApplyJoin(row, type) {
      let params = {
        signUpId: [row.signUpId],
        trainId: this.$route.query.id,
        type: type,
        rejectDesc: ''
      }

      approvalTrainApplyJoin(params).then(() => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.getInfo()
      })
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
        trainId: this.$route.query.id
      }
      let { data, totalNum } = await queryTrainApplyJoinList(params)
      this.page.total = totalNum
      this.tableData = data

      this.statisticsData = await statistics({ trainId: this.$route.query.id })
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
