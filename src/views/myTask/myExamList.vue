<template>
  <div class="exam-style">
    <el-card class="search-card">
      <el-input
        v-model="queryInfo.examName"
        class="input-box"
        placeholder="输入考试名称搜索"
        prefix-icon="el-icon-search"
        clearable
        @input="searchFun"
      />
      <el-popover
        placement="bottom"
        width="412"
        trigger="click"
        popper-class="course-list-filter-pop"
      >
        <ul class="course-list-filter-pop__wrap">
          <li class="course-list-filter-pop__li">
            <div class="course-list-filter-pop__label">考试时间</div>
            <el-date-picker
              v-model="queryInfo.examTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </li>
          <li class="course-list-filter-pop__li">
            <div class="course-list-filter-pop__label">是否通过</div>
            <el-select
              v-model="queryInfo.isPass"
              class="course-list-filter-pop__value"
              placeholder="请选择"
            >
              <el-option
                v-for="item in passTypeOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </li>
          <li class="course-list-filter-pop__li">
            <div class="course-list-filter-pop__label">状态</div>
            <el-select
              v-model="queryInfo.status"
              class="course-list-filter-pop__value"
              placeholder="请选择"
            >
              <el-option
                v-for="item in statusOption"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </li>
          <div class="course-list-filter-pop__footer">
            <el-button type="primary" size="medium" @click="filterFun"> 确定 </el-button>
            <el-button size="medium" @click="restSearch"> 重置 </el-button>
          </div>
        </ul>
        <el-button slot="reference" size="medium"> 高级检索 </el-button>
      </el-popover>
    </el-card>
    <el-card class="table-style">
      <common-table
        id="demo"
        ref="table"
        :columns="columnsVisible"
        :config="tableConfig"
        :data="tableData"
        :loading="tableLoading"
        :page-config="tablePageConfig"
        :page="page"
        @current-page-change="handleCurrentPageChange"
        @page-size-change="handlePageSizeChange"
      >
        <template #examTime="{ row }"> {{ row.examBeginTime }} - {{ row.examEndTime }} </template>
        <template #isPass="{ row }">
          {{ getPass(row) }}
        </template>
        <template #status="{ row }">
          {{ row.status | statusFilter }}
        </template>
        <template #score="{ row }">
          {{ row.score ? row.score : '--' }}
        </template>
        <template #handler="{ row }">
          <el-button type="text" :disabled="JoinDisabled(row)" @click="joinExam(row)">
            参加考试
          </el-button>
          <el-button type="text" :disabled="JoinView(row)" @click="handleView(row)">
            查看答卷
          </el-button>
        </template>
      </common-table>
    </el-card>
  </div>
</template>

<script>
const TABLE_COLUMNS = [
  {
    label: '考试名称',
    prop: 'examName',
    minWidth: 150
  },
  {
    label: '考试时间',
    prop: 'examTime',
    slot: true,
    align: 'center',
    minWidth: 150
  },
  {
    label: '来源',
    prop: 'examSourceName',
    align: 'center',
    minWidth: 100
  },
  {
    label: '参加次数',
    prop: 'examTimes',
    align: 'center',
    minWidth: 100
  },

  {
    label: '考试成绩',
    slot: true,
    align: 'center',
    prop: 'score',
    minWidth: 100
  },
  {
    label: '是否通过',
    prop: 'isPass',
    align: 'center',
    slot: true,
    minWidth: 100
  },
  {
    label: '状态',
    prop: 'status',
    align: 'center',
    slot: true,
    minWidth: 100
  }
]
const TABLE_CONFIG = {
  rowKey: 'id',
  showHandler: true,
  defaultExpandAll: true,
  showIndexColumn: false,
  enablePagination: true,
  enableMultiSelect: false,
  handlerColumn: {
    minWidth: 120
  }
}
const PASS_TYPE = [
  {
    label: '全部',
    value: 0
  },
  {
    value: 1,
    label: '未通过'
  },
  {
    value: 2,
    label: '待发布'
  },
  {
    value: 3,
    label: '已通过'
  }
]
const STATUS_TYPE = [
  {
    value: 0,
    label: '全部'
  },
  {
    value: 1,
    label: '未开考'
  },
  {
    value: 2,
    label: '未考试'
  },
  {
    value: 3,
    label: '已考试'
  },
  {
    value: 4,
    label: '缺考'
  }
]
import { getExamList } from '@/api/exam'
import examUtils from '../exam/examUtils'
import moment from 'moment'
import { mapGetters } from 'vuex'
export default {
  name: 'ExamList',
  filters: {
    statusFilter(data) {
      const target = _.find(STATUS_TYPE, (item) => {
        return item.value === data
      })
      return target.label
    }
  },
  data() {
    return {
      passTypeOption: PASS_TYPE,
      statusOption: STATUS_TYPE,
      tablePageConfig: {},
      page: {
        currentPage: 1,
        size: 10,
        total: 0
      },
      queryInfo: {
        pageNo: 1,
        pageSize: 10,
        examTime: [],
        examName: '',
        isPass: 0,
        status: 0
      },
      activeIndex: '1',
      columnsVisible: TABLE_COLUMNS,
      tableConfig: TABLE_CONFIG,
      tableData: [],
      tableLoading: false
    }
  },
  computed: {
    ...mapGetters(['userId'])
  },
  created() {
    this.loadTableData()
  },
  methods: {
    getPass(row) {
      return _.find(PASS_TYPE, (item) => {
        return item.value === row.isPass
      }).label
    },
    restSearch() {
      const queryParams = { examTime: [], isPass: '', status: '', pageNo: 1, pageSize: 10 }
      this.queryInfo = _.assign(this.queryInfo, queryParams)
    },
    filterFun() {
      this.queryInfo.pageNo = 1
      this.loadTableData()
    },
    searchFun() {
      this.queryInfo.pageNo = 1
      this.loadTableData()
    },
    handleCategoryChange(category) {
      this.queryInfo.catalogId = category.id
      this.loadTableData()
    },
    /**
     * 处理页码改变
     */
    handleCurrentPageChange(param) {
      this.queryInfo.pageNo = param
      this.loadTableData()
    },
    /**
     * 处理页码大小更改
     */
    handlePageSizeChange(param) {
      this.queryInfo.pageSize = param
      this.queryInfo.pageNo = 1
      this.loadTableData()
    },
    // 参加考试置灰
    JoinDisabled(row) {
      return examUtils.JoinDisabled(row)
    },
    // 参加考试
    joinExam(row) {
      const { tips, isReNew, isShowConfirm } = examUtils.getJoinExamTips(row)
      this.$confirm(tips, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showConfirmButton: isShowConfirm,
        type: 'warning'
      }).then(() => {
        this.$router.push({
          name: 'ExamPaper',
          query: { examId: row.examId, batchId: row.batchId, isReNew: isReNew }
        })
      })
    },
    // 查看答卷置灰规则
    JoinView(row) {
      // status缺考4、未考试2和未开考1状态下，不能查看答卷，按钮置灰
      // 若创建考试时，不允许考生查看答卷。则不能查看答卷，按钮置灰
      // 已提交过答卷的点击“查看答卷”挑跳转到【查看答卷】页面
      const { status, openAnswerSheet } = row
      const isJoinDisabled = status === 1 || status === 2 || status === 4 || !openAnswerSheet
      return isJoinDisabled
    },
    // 查看答案
    handleView(row) {
      this.$router.push({
        name: 'ExamDetail',
        query: { examId: row.examId, batchId: row.batchId }
      })
    },

    // 加载函数
    async loadTableData() {
      if (this.tableLoading) return
      try {
        this.tableData = []
        this.tableLoading = true
        const examTimeTemp = _.cloneDeep(this.queryInfo.examTime)
        const examTime = _.map(examTimeTemp, (item) => {
          return moment(item).format('YYYY-MM-DD HH:mm:ss')
        })
        const params = _.assign(_.cloneDeep(this.queryInfo), { examTime })
        let { totalNum, data } = await getExamList(params)
        this.tableLoading = false
        this.tableData = data
        this.page.total = totalNum
      } catch (error) {
        this.tableLoading = false
        this.$message.error(error.message)
        window.console.error(JSON.stringify(this.queryInfo))
      }
    }
  }
}
</script>

<style scoped lang="scss">
/deep/ .el-range-separator {
  padding: 0;
}
/deep/ .el-range-editor {
  width: 100%;
}
/deep/ .el-range__icon {
  line-height: 28px;
}
.exam-style {
  .search-card {
    margin-top: 16px;
    .input-box {
      width: 240px;
      margin-right: 16px;
    }
  }
  .table-style {
    margin-top: 20px;
  }
}
</style>
<style lang="scss">
.course-list-filter-pop {
  &__wrap {
    padding: 24px 16px;
  }
  &__li {
    margin-bottom: 16px;
  }
  &__label {
    margin-bottom: 8px;
  }
  &__value {
    width: 100%;
  }
  &__footer {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
    .el-button {
      padding: 9px 13px;
    }
  }
}
</style>
