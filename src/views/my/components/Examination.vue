<template>
  <div class="cultivate">
    <div class="search">
      <div class="search_btn">
        <span
          :class="{ pitch: pitch == 'CurrencyExam' }"
          style="cursor:pointer;"
          @click="showBtn('CurrencyExam')"
        >通用考试</span>
        <span
          :class="{ pitch: pitch == 'CourseExam' }"
          style="cursor:pointer;"
          @click="showBtn('CourseExam')"
        >课程考试</span>
        <span
          :class="{ pitch: pitch == 'TrainExam' }"
          style="cursor:pointer;"
          @click="showBtn('TrainExam')"
        >培训班考试</span>
      </div>
      <div class="search_bar">
        <el-input
          v-show="pitch == 'CurrencyExam'"
          v-model="searchInput"
          class="searchInput"
          placeholder="查找我的通用考试"
          suffix-icon="el-icon-search"
        >
        </el-input>

        <el-input
          v-show="pitch == 'CourseExam'"
          v-model="searchInput"
          class="searchInput"
          placeholder="查找我的课程考试"
          suffix-icon="el-icon-search"
        >
        </el-input>

        <el-input
          v-show="pitch == 'TrainExam'"
          v-model="searchInput"
          class="searchInput"
          placeholder="查找我的培训班考试"
          suffix-icon="el-icon-search"
        >
        </el-input>

        <el-button v-show="searchInput" type="primary" size="medium" @click="searchInput = ''">
          重置
        </el-button>
      </div>
    </div>

    <div v-show="tableData.length" class="courselist">
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
        <!-- 考试次数 -->
        <template slot="joinNumValue" slot-scope="{ row }">
          <span>
            {{ row.examTimes }}/{{ `${row.joinNum == 0 ? '不限制' : row.joinNumValue}` }}
          </span>
        </template>

        <!-- 是否通过: 0-否 1-是 -->
        <template slot="isPass" slot-scope="{ row }">
          <span v-if="row.isPass == 0">不通过</span>
          <span v-if="row.isPass == 1"> 通过</span>
        </template>

        <!--答卷状态: 1-已发布 2-考试中 3-已提交 4-阅卷中 5-已阅卷 6-缺考 -->
        <template slot="status" slot-scope="{ row }">
          <span v-if="row.status == 1">已发布</span>
          <span v-if="row.status == 2">考试中</span>
          <span v-if="row.status == 3">已提交</span>
          <span v-if="row.status == 4">阅卷中</span>
          <span v-if="row.status == 5">已阅卷</span>
          <span v-if="row.status == 6">缺考</span>
        </template>

        <template slot="handler" slot-scope="scope">
          <el-button
            v-if="scope.row.status == 6 || scope.row.status == 4"
            type="text"
            disabled
            @click="toAnswer(scope.row)"
          >
            查看答卷
          </el-button>
          <el-button v-else type="text" @click="toAnswer(scope.row)">
            查看答卷
          </el-button>
        </template>
      </common-table>
    </div>

    <!-- 无数据 -->
    <div v-show="!tableData.length" class="content">
      <div class="content_box">
        <img src="@/assets/images/my_noData.png" alt="" />
        <div class="text">
          还没有参加的考试
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { examList } from '@/api/my'
// 表格属性
const TABLE_COLUMNS = [
  {
    label: '考试名称',
    prop: 'examName'
  },
  {
    label: '考试次数',
    prop: 'joinNumValue',
    slot: true
  },
  {
    label: '成绩',
    prop: 'score'
  },
  {
    label: '是否通过',
    prop: 'isPass',
    slot: true
  },
  {
    label: '状态',
    prop: 'status',
    slot: true
  }
]
const TABLE_CONFIG = {
  // handlerColumn: {
  //   width: 200
  // },
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
      tablePageConfig: TABLE_PAGE_CONFIG
    }
  },
  watch: {
    searchInput: function() {
      this.getInfo()
    }
  },
  created() {
    this.getInfo()
  },
  activated() {
    this.getInfo()
  },
  methods: {
    // 去答案
    toAnswer(row) {
      this.$router.push({
        name: 'ExamDetail',
        query: { examId: row.id, batchId: row.examineeBatchId }
      })
    },
    // 查询培训考试结果列表
    isExamResult() {},

    // 查询培训考试安排详情
    isExamDetail() {},

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
      let params = {
        type: this.pitch, //考试类型 CurrencyExam-通用考试 CourseExam-课程考试 TrainExam-培训班考试
        name: this.searchInput
      }
      let res = await examList({ ...params, ...this.page })
      this.tableData = res.data
      this.page.total = res.totalNum
    },

    showBtn(i) {
      this.pitch = i
      this.getInfo()
    }
  }
}
</script>

<style lang="scss" scoped>
.cultivate {
  // margin-bottom: -100%;
  .search {
    margin-top: 20px;
    padding: 24px 24px 0;
    background: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    .search_btn {
      height: 56px;
      line-height: 56px;
      display: flex;
      font-size: 16px;
      color: rgba(0, 11, 21, 0.65);
      letter-spacing: 0;
      span {
        margin-right: 32px;
      }
      .pitch {
        font-weight: bold;
        color: #01aafc;
        border-bottom: 2px solid #01aafc;
      }
    }
    .search_bar {
      padding-top: 11px;
      /deep/.el-input {
        width: 380px;
        margin-right: 16px;
      }
    }
  }
  .courselist {
    width: 1200px;
    padding: 24px;
    background-color: #fff;
  }
  .content {
    background: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
    border-radius: 4px;
    width: 1200px;
    height: 627px;
    display: flex;
    display: flex;
    justify-content: center;
    align-items: center;
    .content_box {
      width: 338px;
      height: 290px;
      img {
        width: 100%;
        height: 100%;
      }
      .text {
        text-align: center;
        margin-top: 16px;
        font-size: 14px;
        color: rgba(0, 11, 21, 0.65);
        letter-spacing: 0;
      }
    }
  }
}
</style>
