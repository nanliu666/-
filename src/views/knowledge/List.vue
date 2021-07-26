<template>
  <div>
    <el-card style="margin-top: 20px">
      <el-input
        v-model="queryInfo.knowledgeName"
        placeholder="请输入知识库名称搜索"
        style="width: 380px"
        clearable
        @input="searchFun"
      >
        <i slot="suffix" class="el-input__icon el-icon-search"></i>
      </el-input>

      <div style="float: right">
        <el-button type="primary" class="share-btn" @click="detailShare">一点分享</el-button>
      </div>
      <div class="split"></div>
      <category-select :load="loadCategory" @change="handleCategoryChange"></category-select>
    </el-card>
    <el-card class="table-style">
      <el-tabs v-model="activeIndex" @tab-click="handleSelect">
        <el-tab-pane label="综合排序" name="1" />
        <el-tab-pane label="最新上传" name="2" />
        <el-tab-pane label="评分最高" name="3" />
      </el-tabs>
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
        <template #handler="{ row }">
          <el-button type="text" @click="handleView(row)"> 查看 </el-button>
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
    width: '420px'
  },
  {
    label: '提供人',
    prop: 'providerName',
    width: '200px'
  },
  {
    label: '查看人数',
    sortable: true,
    prop: 'watchPeople'
  },
  {
    label: '下载人数',
    sortable: true,
    prop: 'downloadPeople'
  },
  {
    label: '评分',
    prop: 'scope'
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
    minWidth: 50
  }
}
import { getKnowledgeList, getKnowledgeCatalog } from '@/api/knowledge'
import CategorySelect from '../course/components/CategorySelect.vue'
import '@/styles/variables.scss'
export default {
  name: 'KnowledgeList',
  components: {
    CategorySelect
  },
  data() {
    return {
      tablePageConfig: {
        customClassName: 'pageName'
      },
      page: {
        currentPage: 1,
        size: 10,
        total: 0
      },
      queryInfo: {
        pageNo: 1,
        pageSize: 10,
        catalogId: '',
        knowledgeName: '',
        knowledgeSystemId: '',
        sortChoice: '' //排序选项 1：综合排序；2：最新上传；3：评分最高
      },
      activeIndex: '1',
      columnsVisible: TABLE_COLUMNS,
      tableConfig: TABLE_CONFIG,
      tableData: [],
      tableLoading: false
    }
  },
  activated() {
    this.loadTableData()
  },
  methods: {
    searchFun: _.debounce(function() {
      this.queryInfo.pageNo = 1
      this.loadTableData()
    }, 500),
    loadCategory(id) {
      return getKnowledgeCatalog(id)
    },
    handleCategoryChange(res) {
      this.queryInfo.catalogId = res.category.id
      this.queryInfo.knowledgeSystemId = res.knowledge.idStr
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
    // 切换nav
    handleSelect(tab) {
      this.activeIndex = tab.name
      this.handleSearch({ sortChoice: Number(this.activeIndex) })
    },
    handleView(row) {
      this.$router.push({ name: 'KnowledgeDetail', query: { id: row.id } })
    },

    //一点分享
    detailShare() {
      this.$router.push({ name: 'share' })
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
    }
  }
}
</script>

<style scoped lang="scss">
/deep/.cell:empty::before {
  content: '--';
  color: gray;
}
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
/deep/.pageName {
  margin-top: 24px;
}
.share-btn {
  line-height: 30px;
  padding: 0 20px;
}
</style>
