<template>
  <div class="Integral">
    <common-breadcrumb ref="breadcrumb" :route-list="routeList" />

    <ul class="Integral_top">
      <li>
        <div>
          <span class="title"> 总积分 </span>
          <span class="num"> 9999 </span>
        </div>
      </li>
      <li>
        <div>
          <span class="title"> 年度积分 </span>
          <span class="num"> 9999 </span>
        </div>
      </li>
      <li>
        <div>
          <span class="title"> 月度积分 </span>
          <span class="num"> 9999 </span>
        </div>
      </li>
    </ul>

    <div class="content">
      <div class="lfet">
        <div class="search">
          查询：

          <el-date-picker
            v-model="dateSearch"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </div>

        <div class="lfet_table">
          <common-table
            ref="table"
            :columns="columnsVisible | columnsFilter"
            :config="tableConfig"
            :data="tableData"
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
            <span>每日首次登录累计1积分</span>
          </li>
          <li>
            <div>在线学习积分</div>
            <span>每有效观看课程视频一个积1积分，上限6积分。</span>
          </li>
          <li>
            <div>知识库积分</div>
            <span>每有效阅读知识库文章一篇，上限6积分。 </span>
          </li>
          <li>
            <div>资源共享积分</div>
            <span>上传共享资源每被下载一次，上限6积分。 </span>
          </li>
          <li>
            <div>课程积分</div>
            <span>完成某一课程学习，获得课程对应的课程积分。 </span>
          </li>
          <li>
            <div>考试积分</div>
            <span>通过某一门考试，获得考试对应的考试积分。 </span>
          </li>
          <li>
            <div>培训积分</div>
            <span>完成某一培训学习，获得培训对应的培训积分。 </span>
          </li>
          <li>
            <div>问卷积分</div>
            <span>提交某一份问卷，获得问卷对应的问卷积分 </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
// 表格属性
const TABLE_COLUMNS = [
  {
    label: '积分来源',
    prop: 'examName'
  },
  {
    label: '分值',
    prop: 'joinNumValue',
    slot: true
  },
  {
    label: '获得时间',
    prop: 'score'
  }
]
const TABLE_CONFIG = {
  // handlerColumn: {
  //   width: 200
  // },
  enablePagination: true,
  showHandler: false,
  showIndexColumn: false
}
export default {
  filters: {
    // 过滤不可见的列
    columnsFilter: (visibleColProps) =>
      _.filter(TABLE_COLUMNS, ({ prop }) => _.includes(visibleColProps, prop))
  },

  components: {
    // certificateDetail: () => import('./CertificateDetail'),
    CommonBreadcrumb: () => import('@/components/common-breadcrumb/Breadcrumb')
  },
  data() {
    return {
      // 默认选中所有列
      columnsVisible: _.map(TABLE_COLUMNS, ({ prop }) => prop),
      // query: {},
      tableColumns: TABLE_COLUMNS,
      tableConfig: TABLE_CONFIG,
      tableData: [],
      dateSearch: '',
      routeList: [
        {
          path: '/personal',
          title: '个人中心'
        },
        {
          path: '',
          title: _.get(this.$route.meta, 'title', ' ')
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.Integral {
  .Integral_top {
    height: 80px;
    background-color: #fff;
    box-shadow: 0 2px 8px 0 rgba(0, 63, 161, 0.06);
    display: flex;
    line-height: 80px;
    padding: 0 24px;
    li {
      margin-right: 100px;
      .title {
        color: #666;
        font-size: 18px;
      }
      .num {
        color: #207efa;
        font-size: 22px;
      }
    }
  }
  .content {
    margin-top: 24px;
    display: flex;
    .lfet {
      width: 73%;
      .search {
        padding: 15px 24px;
        background-color: #fff;
        box-shadow: 0 2px 8px 0 rgba(0, 63, 161, 0.06);
        color: #666;
      }
      .lfet_table {
        margin-top: 24px;
        background-color: #fff;
        box-shadow: -4px -1px 8px 0 rgba(0, 63, 161, 0.06);
      }
    }
    .right {
      margin-left: 2%;
      width: 25%;
      background-color: #fff;
      box-shadow: 0 2px 8px 0 rgba(0, 63, 161, 0.06);
      .title {
        height: 60px;
        line-height: 60px;
        text-align: center;
        font-size: 16px;
        border-bottom: 1px solid #ccc;
        color: #666;
      }
      ul {
        padding: 0 20px 100px;
        li {
          margin-top: 24px;
          color: #333;
          div {
            margin-bottom: 5px;
          }
          span {
            color: #999;
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>
