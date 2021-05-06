<template>
  <div class="examinationDetail">
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/lecturerTask/task' }">我的任务</el-breadcrumb-item>
        <el-breadcrumb-item><span @click="goBack"> 必须课详情</span></el-breadcrumb-item>
        <el-breadcrumb-item>考试详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="title_top">
      <div class="title">
        <span>JAVA编程考试</span>

        <ul>
          <li>未开始</li>
          <li>已结束</li>
          <li>进行中</li>
        </ul>
      </div>
      <ul class="text">
        <li><span>考试日期：</span> <span>2020-20-20 ~ 2020-20-20</span></li>
        <li><span>考试时间：</span> <span>1000分钟</span></li>
        <li><span>关联用卷：</span> <span>JAVA编程考试</span></li>
        <li><span>评卷人：</span> <span>名字长长长长期他</span></li>
      </ul>
    </div>

    <div class="table">
      <div class="table_title_box">
        <span>
          考生列表
        </span>

        <span>
          刷新
        </span>
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
            考试详情
          </el-button>
        </template>
      </common-table>
    </div>
  </div>
</template>

<script>
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
    label: '状态',
    prop: 'isPass',
    slot: true
  },
  {
    label: '完成时间',
    prop: 'status',
    slot: true
  },
  {
    label: '成绩',
    prop: 'status1',
    slot: true
  },
  {
    label: '是否通过',
    prop: 'status2',
    slot: true
  }
]
const TABLE_CONFIG = {
  handlerColumn: {
    width: 200
  },
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
    goBack() {
      this.$router.go(-1)
    },
    toAnswer() {},
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
.examinationDetail {
  .breadcrumb {
    padding: 20px 0;
    span {
      cursor: pointer;
    }
  }
  .title_top {
    margin: 24px 0;
    background: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
    padding: 30px 80px;
    .title {
      font-size: 18px;
      font-weight: bold;
      color: #666;
      display: flex;
      ul {
        font-size: 12px;
        display: flex;
        li {
          padding: 5px 10px;
          background-color: pink;
          border-radius: 4px;
          margin-left: 20px;
        }
      }
    }
    .text {
      display: flex;
      margin-top: 24px;
      color: #666;
      li {
        margin-right: 80px;
        &:nth-child(4) {
          margin: 0;
        }
      }
    }
  }
  .table {
    background: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
    padding: 24px;

    .table_title_box {
      color: #666;
      font-weight: bold;
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      margin: 20px 0;
    }
  }
}
</style>
