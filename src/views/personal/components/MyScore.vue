<template>
  <div class="MyScore">
    <ul class="title">
      <li>
        综合得分： <span>{{ detailData.totalScore || 0 }}</span>
      </li>
      <li>
        徒弟综合评分： <span>{{ detailData.avgScore || 0 }}</span>
      </li>
      <li>
        部门负责人评分： <span>{{ detailData.leaderScore || 0 }}</span>
      </li>
    </ul>
    <div class="title_comment">
      <span>部门负责人评语：</span>
      {{ detailData.leaderComment || '-- ' }}
    </div>
    <div class="serach">
      <el-input
        v-model="searchInput"
        placeholder="输入徒弟姓名/手机号搜索"
        suffix-icon="el-icon-search"
      ></el-input>
    </div>

    <common-table
      ref="table"
      class="table"
      :columns="columnsVisible | columnsFilter"
      :config="tableConfig"
      :data="tableData"
      :page-config="tablePageConfig"
      :page="page"
      @current-page-change="handleCurrentPageChange"
      @page-size-change="handlePageSizeChange"
    >
      <!-- 是否通过: 0-否 1-是 -->
      <template slot="isPass" slot-scope="{ scope }">
        <span v-if="scope.row.isPass == 0">不通过</span>
        <span v-if="scope.row.isPass == 1"> 通过</span>
      </template>

      <template slot="handler" slot-scope="scope">
        <el-button
          v-if="scope.row.scoreList && scope.row.scoreList.length"
          type="text"
          @click="toAnswer(scope.row)"
        >
          查看详情
        </el-button>
        <span v-else>--</span>
      </template>
    </common-table>

    <!-- dialog -->
    <el-dialog title="查看详情" :visible.sync="dialogVisible" width="40%" top="3%">
      <div class="dialog_content">
        <div class="evaluationtutor">
          注：“5分”表示完全同意，“1分”表示完全不同意
        </div>

        <el-form ref="form" label-position="top" label-width="80px">
          <el-form-item label="1.导师的责任心强、带徒水平高、对我的帮助非常大">
            <el-radio-group v-model="formData[0]" disabled>
              <el-radio label="5">5分</el-radio><el-radio label="4">4分</el-radio><el-radio label="3">3分</el-radio><el-radio label="2">2分</el-radio><el-radio label="1">1分</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="2.导师每周都有与我做工作及思想方面的交流">
            <el-radio-group v-model="formData[1]" disabled>
              <el-radio label="5">5分</el-radio><el-radio label="4">4分</el-radio><el-radio label="3">3分</el-radio><el-radio label="2">2分</el-radio><el-radio label="1">1分</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="3.导师给我制定的工作计划非常清晰,我清楚的知道每天的工作任务">
            <el-radio-group v-model="formData[2]" disabled>
              <el-radio label="5">5分</el-radio><el-radio label="4">4分</el-radio><el-radio label="3">3分</el-radio><el-radio label="2">2分</el-radio><el-radio label="1">1分</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="4.我能感受到导师对本岗位相关知识非常了解">
            <el-radio-group v-model="formData[3]" disabled>
              <el-radio label="5">5分</el-radio><el-radio label="4">4分</el-radio><el-radio label="3">3分</el-radio><el-radio label="2">2分</el-radio><el-radio label="1">1分</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="5.导师出色的表达和逻辑组织能力，让我更易理解">
            <el-radio-group v-model="formData[4]" disabled>
              <el-radio label="5">5分</el-radio><el-radio label="4">4分</el-radio><el-radio label="3">3分</el-radio><el-radio label="2">2分</el-radio><el-radio label="1">1分</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="6.我觉得导师的指导非常实用,能够帮助我快速掌握岗位应知应会知识">
            <el-radio-group v-model="formData[5]" disabled>
              <el-radio label="5">5分</el-radio><el-radio label="4">4分</el-radio><el-radio label="3">3分</el-radio><el-radio label="2">2分</el-radio><el-radio label="1">1分</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { tutorDetail, studentList } from '@/api/personal'
// 表格属性
const TABLE_COLUMNS = [
  {
    label: '姓名',
    prop: 'studentName'
  },
  {
    label: '所属部门',
    prop: 'orgName'
  },
  {
    label: '岗位',
    prop: 'positionName'
  },
  {
    label: '性别',
    prop: 'sex',
    formatter: (row) => {
      const END_STATUS = {
        0: '男',
        1: '女'
      }
      return END_STATUS[row.sex]
    }
  },
  {
    label: '徒弟打分',
    prop: 'scoreTutor'
  },
  {
    label: '手机号',
    prop: 'phonenum'
  }
]
const TABLE_CONFIG = {
  handlerColumn: {
    width: 200
  },
  enableMultiSelect: false, //复选框
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
      detailData: {},
      // 默认选中所有列
      columnsVisible: _.map(TABLE_COLUMNS, ({ prop }) => prop),
      // query: {},
      tableColumns: TABLE_COLUMNS,
      tableConfig: TABLE_CONFIG,
      tableData: [{}],
      tablePageConfig: TABLE_PAGE_CONFIG,
      dialogVisible: false,
      formData: []
    }
  },

  watch: {
    searchInput: function() {
      this.isstudentList()
    }
  },

  created() {
    this.istutorDetail(), this.isstudentList()
  },

  methods: {
    toAnswer(row) {
      this.formData = row.scoreList
      // this.formData = row.scoreList.split(',')
      this.dialogVisible = true
    },
    //  处理页码改变
    handleCurrentPageChange(param) {
      this.page.pageNo = param
      this.isstudentList()
    },
    handlePageSizeChange(param) {
      this.page.pageNo = 1
      this.page.pageSize = param
      this.isstudentList()
    },

    async istutorDetail() {
      this.detailData = await tutorDetail({ platFlag: 1 })
      this.isstudentList()
    },

    // 拿数据
    async isstudentList() {
      if (this.detailData.idStr) {
        let params = {
          ...this.page,
          id: this.detailData.idStr,
          queryCondition: this.searchInput
        }
        let { data, totalNum } = await studentList(params)

        this.page.total = totalNum
        this.tableData = data
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.MyScore {
  .title {
    display: flex;
    font-weight: bold;
    font-size: 16px;
    color: #666;

    li {
      margin-right: 55px;
      span {
        color: #333;
      }
    }
  }
  .title_comment {
    margin: 20px 0;
    color: #666;
    font-size: 14px;
    span {
      font-size: 16px;
    }
  }
  .serach {
    width: 260px;
  }
  .table {
    margin-top: 24px;
  }

  .dialog_content {
    border-top: 1px solid rgba(153, 153, 153, 0.651);
    margin: 0 -20px;
    padding: 0 60px;
    .evaluationtutor {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: rgba(0, 11, 21, 0.45);
      letter-spacing: 0;
      line-height: 22px;
      font-weight: 400;
      padding: 14px 0;
    }
    /deep/ .el-form-item__label {
      padding: 0;
    }
  }
  /deep/.cell:empty::before {
    content: '--';
    color: gray;
  }
}
</style>
