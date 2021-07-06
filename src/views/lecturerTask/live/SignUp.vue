<template>
  <div class="rsignUp">
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
        <el-button
          style="margin-bottom: 0"
          type="text"
          @click="() => handleRemoveItems(selection, '1')"
        >
          批量同意
        </el-button>
        <el-button
          style="margin-bottom: 0"
          type="text"
          @click="() => handleRemoveItems(selection, '2')"
        >
          批量拒绝
        </el-button>
      </template>
      <template slot="Name" slot-scope="{ row }">
        <el-button type="text">{{ row.Name }}</el-button>
      </template>

      <template slot="handler" slot-scope="scope">
        <el-button type="text" @click="isApprovalTrainApplyJoin(scope.row, '1')">
          同意
        </el-button>
        <el-button type="text" @click="isApprovalTrainApplyJoin(scope.row, '2')">
          拒绝
        </el-button>
      </template>
    </common-table>
  </div>
</template>

<script>
import { liveApplyJoin, approvalLiveApplyJoin } from '@/api/lecturerTask'
// import { forEach } from 'node_modules/jszip'
// 表格属性
const TABLE_COLUMNS = [
  {
    label: '名字',
    prop: 'userName'
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
    handleRemoveItems(selection, type) {
      let params = {
        signUpId: [],
        type: type,
        rejectDesc: '',
        trainId: this.$route.query.id // '1397804680091906050' //
      }
      selection.forEach((item) => {
        params.signUpId.push(item.signUpId)
      })
      approvalLiveApplyJoin(params).then(() => {
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
        liveId: this.$route.query.id,
        type: type,
        approvalDesc: ''
      }

      approvalLiveApplyJoin(params).then(() => {
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
        livePlanId: this.$route.query.id
      }

      let { data, totalNum } = await liveApplyJoin(params)

      this.page.total = totalNum
      this.tableData = data
    }
  }
}
</script>

<style lang="scss" scoped>
.rsignUp {
  // margin-top: 20px;
  /deep/.cell:empty::before {
    content: '--';
    color: gray;
  }
}
</style>
