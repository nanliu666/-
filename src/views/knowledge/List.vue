<template>
  <div>
    <el-card style="margin-top: 20px">
      <el-input
        v-model="queryInfo.knowledgeName"
        placeholder="请输入知识库名称搜索"
        style="width: 380px"
      >
        <i
          slot="suffix"
          class="el-input__icon el-icon-search"
        ></i>
      </el-input>
      <div class="split"></div>
    </el-card>
    <el-card class="table-style">
      <el-menu
        class="el-menu"
        :default-active="activeIndex"
        :active-text-color="activeColor"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item index="0">
          综合排序
        </el-menu-item>
        <el-menu-item index="1">
          最新上传
        </el-menu-item>
        <el-menu-item index="2">
          评分最高
        </el-menu-item>
      </el-menu>
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
            @click="handleView(row)"
          >
            查看
          </el-button>
          <el-button
            type="text"
            :disabled="row.allowDownload === 0 ? false : true"
            @click="handleDownload(row)"
          >
            下载
          </el-button>
        </template>
      </common-table>
    </el-card>
  </div>
</template>

<script>
const TABLE_COLUMNS = [
  {
    label: '名称',
    prop: 'resName',
    minWidth: 150
  },
  {
    label: '创建人',
    prop: 'providerName',
    minWidth: 120
  },
  {
    label: '查看人数',
    sortable: true,
    prop: 'watchPeople',
    minWidth: 120
  },
  {
    label: '下载人数',
    sortable: true,
    prop: 'downloadPeople',
    minWidth: 120
  },
  {
    label: '评分',
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
    minWidth: 100
  }
}
import styles from '@/styles/variables.scss'
import { getKnowledgeList } from '@/api/knowledge'
export default {
  name: 'KnowledgeList',
  data() {
    return {
      tablePageConfig: {},
      page: {
        currentPage: 1,
        size: 10,
        total: 0
      },
      queryInfo: {
        pageNo: '',
        pageSize: '',
        knowledgeName: ''
      },
      activeColor: styles.primaryColor,
      activeIndex: '0',
      columnsVisible: TABLE_COLUMNS,
      tableConfig: TABLE_CONFIG,
      tableData: [{ resName: 'Java函数式编程' }],
      tableLoading: false
    }
  },
  activated() {
    // this.loadTableData()
  },
  methods: {
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
    // 切换nav
    handleSelect(key) {
      this.activeIndex = key
      this.handleSearch({ type: Number(key) })
      this.setConfig()
    },
    handleView(row) {
      this.$router.push({ name: 'KnowledgeDetail', query: { id: row.id } })
    },
    // 搜索
    handleSearch(params) {
      this.queryInfo = _.assign(this.queryInfo, params)
      this.loadTableData()
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
      }
    },
    handleDownload(row) {
      window.open(row.resUrl)
    }
  }
}
</script>

<style scoped lang="scss">
.table-style {
  margin-top: 20px;
  .el-menu {
    margin-bottom: 24px;
  }
  /deep/ .el-menu--horizontal {
    border-bottom: 1px solid #ebeced !important;
  }
}
.split {
  border-bottom: 1px solid #ebeced;
  margin: 16px 0;
}
</style>
