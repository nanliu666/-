<template>
  <div class="Integral">
    <common-breadcrumb ref="breadcrumb" :route-list="routeList" />

    <ul class="Integral_top">
      <li>
        <div>
          <span class="title"> 总积分 </span>
          <span class="num"> {{ resDate.totalScore }} </span>
        </div>
      </li>
      <li>
        <div>
          <span class="title"> 年度积分 </span>
          <span class="num"> {{ resDate.yearScore }} </span>
        </div>
      </li>
      <li>
        <div>
          <span class="title"> 月度积分 </span>
          <span class="num"> {{ resDate.monthScore }} </span>
        </div>
      </li>
    </ul>

    <div class="content">
      <div class="lfet">
        <div class="search">
          查询：

          <el-date-picker
            v-model="dateValue"
            type="daterange"
            range-separator="至 "
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="getInfo"
          >
          </el-date-picker>
        </div>
        <div class="lfet_table">
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
          </common-table>
        </div>
      </div>
      <div class="right">
        <div class="title">
          积分规则
        </div>
        <ul>
          <li>
            <div>登录积分</div>
            <span>每日首次登录可获得登录积分。</span>
          </li>
          <li>
            <div>在线学习积分</div>
            <span>每有效观看课程视频，可获得相应的在线学习积分。</span>
          </li>
          <li>
            <div>知识库积分</div>
            <span>查看知识，可获得相应的知识积分。 </span>
          </li>
          <li>
            <div>资源共享积分</div>
            <span>上传的知识审核通过，获得相应的知识积分。 </span>
          </li>
          <li>
            <div>课程积分</div>
            <span>通过某一课程学习，获得对应的课程积分。</span>
          </li>
          <li>
            <div>考试积分</div>
            <span>通过某一门考试，获得对应的考试积分。 </span>
          </li>
          <li>
            <div>培训积分</div>
            <span>完成某一培训学习，获得对应的培训积分。 </span>
          </li>
          <li>
            <div>问卷积分</div>
            <span>提交某一份问卷，获得对应的问卷积分。</span>
          </li>
          <li>
            <div>竞赛积分</div>
            <span>参与某一个闯关竞赛，获得对应的闯关竞赛积分。</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { summary, scoreList } from '@/api/my'
import CommonBreadcrumb from '@/components/common-breadcrumb/Breadcrumb'

// 表格属性
const TABLE_COLUMNS = [
  {
    label: '积分来源',
    prop: 'stuName'
  },
  {
    label: '分值',
    prop: 'score'
  },
  // {
  //   label: '是否通过',
  //   prop: 'examStatus',
  //   slot: true
  // },
  {
    label: '获得时间',
    prop: 'createTime'
  }
]
const TABLE_CONFIG = {
  // handlerColumn: {
  //   width: 200
  // },
  enablePagination: true,
  // showHandler: true,
  showIndexColumn: false
}
const TABLE_PAGE_CONFIG = {}

export default {
  filters: {
    // 过滤不可见的列
    columnsFilter: (visibleColProps) =>
      _.filter(TABLE_COLUMNS, ({ prop }) => _.includes(visibleColProps, prop))
  },
  components: { CommonBreadcrumb },

  data() {
    return {
      routeList: [
        {
          path: '/personal',
          title: '个人中心'
        },
        {
          path: '',
          title: _.get(this.$route.meta, 'title', ' ')
        }
      ],

      sysRuleSource: '', //学分类型
      resDate: {}, //学分学时汇总
      sehrchBtn: 0,
      dateValue: '',
      searchInput: '',
      pitch: 0,
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
  // watch: {
  //   dateValue: function() {
  //     this.getInfo()
  //   }
  // },
  created() {
    this.getInfo()
    this.getresDate()
  },
  activated() {
    this.getInfo()
    this.getresDate()
  },
  methods: {
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
      // 学时
      //search 搜索栏值
      //type 类型-系统学分/考评学分
      //startTime
      //endTime
      //sysRuleSource 学分类型-登录学分/在线学习学分/知识库学习学分/资源共享学分（直接传中文就行）
      const date = this.dateValue || []
      const [startTime = '', endTime = ''] = date
      let params = {
        search: this.searchInput,
        type: this.sehrchBtn,
        startTime,
        endTime,
        sysRuleSource: this.sysRuleSource
      }
      let res = await scoreList({ ...params, ...this.page })
      this.tableData = res.data
      this.page.total = res.totalNum
    },
    async getresDate() {
      this.resDate = await summary()
    }
  }
}
</script>

<style lang="scss" scoped>
.Integral {
  .Integral_top {
    background-color: #fff;
    box-shadow: 0 2px 8px 0 rgba(0, 63, 161, 0.06);
    padding: 32px 0;
    display: flex;
    li {
      width: 33.33%;
      border-right: 1px solid rgba(0, 11, 21, 0.08);
      &:last-child {
        border: none;
      }
      .title {
        display: block;
        text-align: center;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: rgba(0, 11, 21, 0.45);
        line-height: 22px;
        font-weight: 400;
      }
      .num {
        display: block;
        text-align: center;
        font-family: Helvetica;
        font-size: 30px;
        color: #2875d4;
        letter-spacing: 1.07px;
        line-height: 22px;
        font-weight: 400;
        margin-top: 15px;
      }
    }
  }
  .content {
    margin-top: 24px;
    display: flex;

    .lfet {
      background-color: #fff;
      box-shadow: 0 2px 8px 0 rgba(0, 63, 161, 0.06);
      width: 67%;
      .search {
        padding: 15px 24px;
        color: #666;
        /deep/ .el-range__icon {
          line-height: 28px !important;
        }

        /deep/ .el-range__close-icon {
          line-height: 28px !important;
        }
        /deep/ .el-range-separator {
          padding: 0;
        }
      }
      .lfet_table {
        margin-top: 24px;
        padding: 0 24px;
      }
    }
    .right {
      margin-left: 2%;
      width: 31%;
      background-color: #fff;
      box-shadow: 0 2px 8px 0 rgba(0, 63, 161, 0.06);
      .title {
        height: 60px;
        line-height: 60px;
        padding-left: 24px;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: rgba(0, 11, 21, 0.85);
        font-weight: 400;
        border-bottom: 1px solid rgba(0, 11, 21, 0.08);
      }
      ul {
        padding: 0 20px 100px;
        li {
          margin-top: 24px;
          div {
            margin-bottom: 5px;
            font-family: PingFangSC-Medium;
            font-size: 14px;
            color: rgba(0, 11, 21, 0.85);
            letter-spacing: 0;
            line-height: 22px;
            font-weight: 500;
          }
          span {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: rgba(0, 11, 21, 0.45);
            letter-spacing: 0;
            line-height: 22px;
            font-weight: 400;
          }
        }
      }
    }
  }
}
</style>
