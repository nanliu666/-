<template>
  <div class="exam-style">
    <el-card class="search-card">
      <el-input
        v-model="queryInfo.name"
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
            <div class="course-list-filter-pop__label">
              考试时间
            </div>
            <el-date-picker
              v-model="queryInfo.examTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </li>
          <li class="course-list-filter-pop__li">
            <div class="course-list-filter-pop__label">
              是否通过
            </div>
            <el-select
              v-model="queryInfo.passType"
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
            <div class="course-list-filter-pop__label">
              状态
            </div>
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
            <el-button
              type="primary"
              size="medium"
              @click="loadTableData"
            >
              确定
            </el-button>
            <el-button
              size="medium"
              @click="restSearch"
            >
              重置
            </el-button>
          </div>
        </ul>
        <el-button
          slot="reference"
          size="medium"
        >
          高级检索
        </el-button>
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
        <template #handler="{row}">
          <el-button
            type="text"
            @click="joinExam(row)"
          >
            参加考试
          </el-button>
          <el-button
            type="text"
            @click="handleView(row)"
          >
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
    prop: 'resName',
    minWidth: 150
  },
  {
    label: '考试时间',
    prop: 'providerName',
    minWidth: 120
  },
  {
    label: '参加次数',
    prop: 'watchPeople',
    minWidth: 120
  },
  {
    label: '考试成绩',
    prop: 'downloadPeople',
    minWidth: 120
  },
  {
    label: '是否通过',
    prop: 'downloadPeople1',
    minWidth: 120
  },
  {
    label: '状态',
    prop: 'scope',
    minWidth: 120
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
    value: 3,
    label: '缺考'
  }
]
import { getKnowledgeList, getKnowledgeCatalog } from '@/api/knowledge'
export default {
  name: 'ExamList',
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
        name: '',
        passType: 0,
        status: 0
      },
      activeIndex: '1',
      columnsVisible: TABLE_COLUMNS,
      tableConfig: TABLE_CONFIG,
      tableData: [],
      tableLoading: false
    }
  },
  created() {
    this.loadTableData()
  },
  methods: {
    restSearch() {
      const queryParams = { examTime: [], passType: '', status: '' }
      this.queryInfo = _.assign(this.queryInfo, queryParams)
    },
    searchFun: _.debounce(function() {
      this.loadTableData()
    }, 500),
    loadCategory(id) {
      return getKnowledgeCatalog(id)
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
      this.loadTableData()
    },
    // 参加考试
    joinExam(row) {
      this.$router.push({ name: 'ExamPaper', query: { id: row.id } })
    },
    // 查看答案
    handleView(row) {
      this.$router.push({ name: 'ExamDetail', query: { id: row.id } })
    },

    // 加载函数
    async loadTableData() {
      if (this.tableLoading) return
      try {
        this.tableData = []
        this.tableLoading = true
        let { totalNum, data } = await getKnowledgeList(this.queryInfo)
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
