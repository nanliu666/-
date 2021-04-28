<template>
  <div class="situationTab">
    <div class="search">
      <div class="search_input">
        <el-input
          v-model="searchInput"
          placeholder="请输入学员姓名搜索"
          suffix-icon="el-icon-search"
        >
        </el-input>
      </div>
      <div class="search_popover">
        <el-popover v-model="visible" placement="bottom" width="428">
          <div class="popover_box">
            <el-form ref="form" :model="searchForm" label-position="top">
              <el-form-item label="所在分类" prop="catalogId">
                <el-select v-model="searchForm.catalogId" :multiple-limit="10" placeholder="请选择">
                  <el-option
                    style="height: auto; padding: 0"
                    :value="searchForm.catalogId"
                    :label="parentOrgIdLabel"
                  >
                    <el-tree
                      ref="orgTree"
                      :data="catalogIdoptions"
                      node-key="catalogId"
                      :props="{
                        children: 'children',
                        label: 'name',
                        value: 'id'
                      }"
                      @node-click="handleOrgNodeClick"
                    />
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="在线学习进度（必修）">
                <el-select v-model="searchForm.region" placeholder="请选择">
                  <el-option label="未完成" value="0"></el-option>
                  <el-option label="已完成" value="1"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="作业提交率">
                <el-select v-model="searchForm.region" placeholder="请选择">
                  <el-option label="未完成" value="0"></el-option>
                  <el-option label="全部提交" value="1"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="课程通过状态">
                <el-select v-model="searchForm.region" placeholder="请选择">
                  <el-option label="未通过" value="0"></el-option>
                  <el-option label="已通过" value="1"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="考试情况">
                <el-select v-model="searchForm.region" placeholder="请选择">
                  <el-option label="未通过" value="0"></el-option>
                  <el-option label="已通过" value="1"></el-option>
                  <el-option label="未开始" value="2"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item>
                <div class="popover_btn">
                  <el-button size="medium" type="primary" @click="searchBtn"> 确定 </el-button>
                  <el-button size="medium" @click="visible = false"> 取消 </el-button>
                </div>
              </el-form-item>
            </el-form>
          </div>

          <el-button slot="reference" size="medium"> 高级检索 </el-button>
        </el-popover>
      </div>
    </div>

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
        <el-button type="text" @click="toAnswer(scope.row)">
          查看上报材料
        </el-button>
      </template>
    </common-table>
  </div>
</template>

<script>
import { queryCategoryOrgList } from '@/api/lecturerTask'
// 表格属性
const TABLE_COLUMNS = [
  {
    label: '姓名',
    prop: 'courseName'
  },
  {
    label: '手机号',
    prop: 'joinNumValue',
    slot: true
  },
  {
    label: '所属部门',
    prop: 'score'
  },
  {
    label: '学习进度',
    prop: 'isPass',
    slot: true
  },
  {
    label: '作业提交率',
    prop: 'status',
    slot: true
  },
  {
    label: '课程通过状态',
    prop: 'status1',
    slot: true
  },
  {
    label: '考试情况',
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
      searchForm: {},
      visible: false,
      parentOrgIdLabel: '',
      catalogIdoptions: '',
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
    this.isgetCatalog()
  },
  activated() {
    this.getInfo()
  },
  methods: {
    searchBtn() {},
    handleOrgNodeClick(data) {
      if (data !== undefined) {
        this.searchForm.catalogId = data.id
        this.parentOrgIdLabel = data.name
      }
    },
    // 拿到筛选数据
    isgetCatalog() {
      queryCategoryOrgList({ source: 'course' }).then((res) => {
        let resList = this.ListData(res)
        this.catalogIdoptions = resList
      })
    },

    // 递归过滤数据
    ListData(arr) {
      if (arr.length > 0) {
        for (let i = arr.length - 1; i >= 0; i--) {
          if (arr[i].status == 1) {
            arr.splice(i, 1)
          } else if (arr[i].children) {
            this.ListData(arr[i].children)
          }
        }
      }
      return arr
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
.situationTab {
  margin-top: 20px;
  .search {
    margin-bottom: 24px;
    display: flex;
    .search_input {
      width: 380px;
    }

    .search_popover {
      margin-left: 16px;
    }
  }
}
.popover_box {
  /deep/.el-select {
    width: 100% !important;
  }
  /deep/.el-form-item__label {
    padding: 0 !important;
  }
  /deep/.el-form-item {
    margin-bottom: 10px;
  }
  padding: 20px 20px 0;
  .popover_btn {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
