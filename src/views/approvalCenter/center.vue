<template>
  <div class="center">
    <div class="header">审批中心</div>
    <div class="center_bar">
      <div class="bar_btn">
        <div :class="{ pitch: pitch == 1 }" @click="setPitch(1)">
          待我审批 <span class="bar_btn_num">{{ totalNum }}</span>
        </div>
        <div :class="{ pitch: pitch == 2 }" @click="setPitch(2)">我已审批</div>
        <div :class="{ pitch: pitch == 3 }" @click="setPitch(3)">抄送我的</div>
        <div :class="{ pitch: pitch == 4 }" @click="setPitch(4)">我发起的</div>
      </div>
      <div class="bar_search">
        <div cclass="search_input">
          <el-input
            v-model="searchInput"
            class="searchInput"
            placeholder="查找相关数据"
            suffix-icon="el-icon-search"
          >
          </el-input>
        </div>
        <div class="search_popover">
          <el-popover v-model="visible" placement="bottom" width="428">
            <div class="popover_box">
              <el-form ref="form" :model="searchForm" label-position="top">
                <el-form-item label="流程类型">
                  <el-select v-model="searchForm.categoryId" placeholder="请选择">
                    <el-option
                      v-for="(item, index) in tableData"
                      :key="index"
                      :label="item.processName"
                      :value="item.categoryId"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item v-show="pitch != 4" label="申请人">
                  <el-select v-model="searchForm.applyUserId" placeholder="请选择">
                    <el-option
                      v-for="(item, index) in tableData"
                      :key="index"
                      :label="item.userName"
                      :value="item.userId"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="申请时间">
                  <el-date-picker
                    v-model="searchForm.dateValue"
                    type="daterange"
                    range-separator="~"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  >
                  </el-date-picker>
                </el-form-item>

                <el-form-item v-show="pitch != 1" label="当前状态">
                  <el-select v-model="searchForm.status" placeholder="请选择">
                    <el-option label="审批中" value="Approve"></el-option>
                    <el-option label="已通过" value="Pass"></el-option>
                    <el-option label="已拒绝" value="Reject"></el-option>
                    <el-option label="已撤回" value="Cancel"></el-option>
                    <el-option label="待完善" value="Corvidae"></el-option>
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
    </div>

    <div class="center_table">
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
        <!-- 当前状态 -->
        <template slot="status" slot-scope="{ row }">
          <span v-show="row.status == 'Approve'">审批中</span>
          <span v-show="row.status == 'Pass'">已通过</span>
          <span v-show="row.status == 'Reject'">已拒绝</span>
          <span v-show="row.status == 'Corvidae'">待完善</span>
          <span v-show="row.status == 'Cancel'">已撤回</span>
        </template>

        <!-- 流程类型 现在只有课程审批，先写死 -->
        <template slot="processName">
          课程审批
        </template>

        <!-- 当前审批人 -->
        <template slot="approveUser" slot-scope="{ row }">
          <span v-if="row.approveUser.length == 0"> - - </span>
          <span v-else>
            <span v-for="(item, index) in row.approveUser" :key="index">{{ item.userName }}
              {{ index != row.approveUser.length - 1 ? ',' : '' }}
            </span>
          </span>
        </template>

        <template slot="handler" slot-scope="scope">
          <el-button type="text" @click="toDetails(scope.row)"> 查看 </el-button>
        </template>
      </common-table>
    </div>
  </div>
</template>

<script>
import { waitApproveList, hasApproveList, myApproveList, ccApproveList } from '@/api/approvalCenter'

// 表格属性
let TABLE_COLUMNS = [
  {
    label: '审批单号',
    prop: 'apprNo'
  },
  {
    label: '流程类型',
    prop: 'processName',
    slot: true,
    width: '130px'
  },
  {
    label: '申请人',
    prop: 'userName',
    width: '130px'
  },
  {
    label: '申请时间',
    prop: 'applyTime'
  },
  {
    label: '完成时间',
    prop: 'completeTime'
  },
  {
    label: '当前状态',
    prop: 'status',
    slot: true
  },
  {
    label: '当前审批人',
    prop: 'approveUser', //数组里面的userName   要遍历出来
    slot: true
  }
]
const TABLE_CONFIG = {
  handlerColumn: {
    width: 100
  },
  enablePagination: true,
  showHandler: true,
  showIndexColumn: false
}
const TABLE_PAGE_CONFIG = {
  currentPage: 1
}
export default {
  filters: {
    // 过滤不可见的列
    columnsFilter: (visibleColProps) =>
      _.filter(TABLE_COLUMNS, ({ prop }) => _.includes(visibleColProps, prop))
  },
  data() {
    return {
      totalNum: '0',
      searchInput: '',
      visible: false,
      pitch: 1,
      searchForm: {},

      // 默认选中所有列
      columnsVisible: _.map(TABLE_COLUMNS, ({ prop }) => prop),
      tableConfig: TABLE_CONFIG,
      tableData: [],
      tablePageConfig: TABLE_PAGE_CONFIG,
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      }
    }
  },

  watch: {
    searchInput: _.debounce(function() {
      this.page.pageNo = 1
      this.page.pageSize = 10
      this.page.total = 0
      this.getTableData()
    }, 600)
  },

  activated() {
    this.setPitch(1)
  },
  methods: {
    searchBtn() {
      this.visible = false
      if (this.searchForm.dateValue && this.searchForm.dateValue.length) {
        this.setPitch(this.pitch, this.searchForm.dateValue[0], this.searchForm.dateValue[1])
      } else {
        this.setPitch(this.pitch)
      }
    },
    //   导航栏btn
    setPitch(i, beginApplyTime, endApplyTime) {
      this.pitch = i
      this.searchInput = ''
      this.searchForm = {}
      this.page.pageNo = 1
      this.page.pageSize = 10
      this.page.total = 0
      if (i == 1) {
        TABLE_COLUMNS.splice(4, 1)
        TABLE_COLUMNS.splice(5, 1)
      } else {
        TABLE_COLUMNS[4] = {
          label: '完成时间',
          prop: 'completeTime'
        }
        TABLE_COLUMNS[5] = {
          label: '当前状态',
          prop: 'status',
          slot: true
        }
        TABLE_COLUMNS[6] = {
          label: '当前审批人',
          prop: 'approveUser',
          slot: true
        }
      }
      this.getTableData(beginApplyTime, endApplyTime)
    },
    //切换导航栏查询数据
    getTableData(beginApplyTime, endApplyTime) {
      let params = {
        ...this.page,
        ...this.searchForm,
        search: this.searchInput,
        categoryId: '1', //分类ID
        beginApplyTime: beginApplyTime,
        endApplyTime: endApplyTime
      }
      // 调接口
      if (this.pitch == 1) {
        // 待我审批
        waitApproveList(params).then((res) => {
          this.tableData = res.data
          this.page.total = res.totalNum
          this.totalNum = res.totalNum
        })
      } else if (this.pitch == 2) {
        // 我已审批
        hasApproveList(params).then((res) => {
          this.tableData = res.data
          this.page.total = res.totalNum
        })
      } else if (this.pitch == 3) {
        // 抄送我的
        myApproveList(params).then((res) => {
          this.tableData = res.data
          this.page.total = res.totalNum
        })
      } else if (this.pitch == 4) {
        // 我发起的
        ccApproveList(params).then((res) => {
          this.tableData = res.data
          this.page.total = res.totalNum
        })
      }
    },
    toDetails(item) {
      //   window.console.log(id)

      this.$router.push({
        path: '/approvalCenter/details',
        query: { apprNo: item.apprNo }
      })
    },
    //  处理页码改变
    handleCurrentPageChange(param) {
      this.page.pageNo = param
      this.getTableData()
    },
    handlePageSizeChange(param) {
      this.page.pageSize = param
      this.getTableData()
    }
  }
}
</script>

<style lang="scss" scoped>
.center {
  font-family: PingFangSC-Medium;

  .header {
    margin: 24px 0 16px;
    font-size: 14px;
    color: rgba(0, 11, 21, 0.85);
    font-weight: bold;
  }
  .center_bar {
    background: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
    border-radius: 4px;
    height: 160px;
    padding: 24px;
    .bar_btn {
      font-size: 16px;
      color: #01aafc;
      letter-spacing: 0;
      text-align: center;
      display: flex;
      border-bottom: 1px solid #ebeced;
      div {
        position: relative;
        margin-right: 40px;
        padding: 16px 0;
        cursor: pointer;
        .bar_btn_num {
          position: absolute;
          top: 18px;
          right: -23px;
          display: inline-block;
          padding: 0 4px;
          background: #ff6464;
          font-size: 12px;
          color: #ffffff;
          letter-spacing: 0;
          line-height: 16px;
          border-radius: 8px;
        }
      }
      .pitch {
        border-bottom: 2px solid #01aafc;
      }
    }
    .bar_search {
      display: flex;
      padding-top: 24px;
      .search_input {
        width: 240px;
      }
      .search_popover {
        margin-left: 16px;
      }
    }
  }
  .center_table {
    padding: 24px;
    background: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
    border-radius: 4px;
    margin-top: 20px;
    .status1 {
      background: #e7fbff;
      border-radius: 4px;
      display: inline-block;
      padding: 1px 8px;
      font-size: 12px;
      color: #01aafc;
      text-align: center;
    }
    .status2 {
      background: #e7ffee;
      border-radius: 4px;
      display: inline-block;
      padding: 1px 8px;
      font-size: 12px;
      color: #00b061;
      text-align: center;
    }
    .status3 {
      background: #fff4f0;
      border-radius: 4px;
      display: inline-block;
      padding: 1px 8px;
      font-size: 12px;
      color: #d92919;
      text-align: center;
    }
    .status4 {
      background: #f5f5f6;
      border-radius: 4px;
      display: inline-block;
      padding: 1px 8px;
      font-size: 12px;
      color: rgba(0, 11, 21, 0.45);
      text-align: center;
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
