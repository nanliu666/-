<template>
  <div v-loading="loading">
    <common-breadcrumb :route-list="routeList" />
    <div class="system-tab">
      <el-tabs v-model="queryData.reqType" @tab-click="toggle_activeName">
        <el-tab-pane
          v-for="item in rankingTabs"
          :key="item.name"
          :label="item.title"
          :name="item.name"
        ></el-tab-pane>
      </el-tabs>
      <div>
        <el-select v-model="queryData.type" placeholder="请选择" @change="getChangeType">
          <el-option
            v-for="item in rankOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="ranking-box">
      <div class="ranking-currenUser">
        <a class="ranking-no" :style="noColor(userInfo.rank)">{{ formmat(userInfo.rank) }}</a>
        <img v-if="userInfo.url" :src="userInfo.url" alt="" class="ranking-headImg" />
        <img v-else :src="headImg" alt="" class="ranking-headImg" />
        <div class="ranking-userInfo">
          <span class="ranking-name">{{ userInfo.name }}</span>
          <span class="ranking-org">{{ userInfo.orgCode }}</span>
        </div>
        <div v-show="tabIndex == '0'" class="ranking-score">{{ userInfo.totalScore || 0 }}分</div>
        <div v-show="tabIndex == '1'" class="ranking-score">{{ userInfo.totalPeriod || 0 }}h</div>
      </div>

      <ul class="ranking-list">
        <li v-for="(val, idx) in rankingList" :key="idx">
          <a class="ranking-no" :style="noColor(val.nowRank)">{{ formmat(val.nowRank) }}</a>
          <img v-if="val.url" :src="val.url" alt="" class="ranking-headImg" />
          <img v-else :src="headImg" alt="" class="ranking-headImg" />
          <div class="ranking-userInfo">
            <span class="ranking-name">{{ val.name }}</span>
            <span class="ranking-org">{{ val.orgCode }}</span>
          </div>
          <div v-show="tabIndex == '0'" class="ranking-score">{{ val.totalScore || 0 }}分</div>
          <div v-show="tabIndex == '1'" class="ranking-score">{{ val.totalPeriod || 0 }}h</div>
        </li>
      </ul>
      <div v-if="rankingList.length > 0" class="pagination">
        <el-pagination
          layout="total,prev,pager,next,sizes,jumper"
          :total="queryData.totalNum"
          :page-size.sync="queryData.pageSize"
          :current-page.sync="queryData.pageNo"
          @current-change="toggle_page"
          @size-change="toggle_pageSize"
        >
          <span class="pageSizeInput"> <el-input class="pageSizeBorder"></el-input>条/页</span>
        </el-pagination>
      </div>
      <div v-else style="text-align: center">
        <img src="../../assets/images/nodata.png" />
        <div>暂无数据</div>
      </div>
    </div>
  </div>
</template>
<script>
import CommonBreadcrumb from '@/components/common-breadcrumb/Breadcrumb'
import { queryRanking, queryMyRanking } from '@/api/home'
export default {
  name: 'RankIntegralList',
  components: {
    CommonBreadcrumb
  },
  data() {
    return {
      userInfo: {},
      rankingList: [],
      rankOptions: [
        { label: '月度', value: '0' },
        { label: '年度', value: '1' },
        { label: '累计', value: '2' }
      ],
      headImg: require('../../../public/img/userIconBig.png'),
      rankingTabs: [
        {
          title: '积分排行榜',
          name: '0'
        },
        {
          title: '学时排行榜',
          name: '1'
        }
      ],
      tabIndex: '0',
      queryData: {
        reqType: 0,
        type: '0',
        pageSize: 10,
        pageNo: 1,
        totalNum: 0
      },
      loading: false,
      routeList: [
        {
          path: '/home',
          title: '首页'
        },
        {
          path: '',
          title: _.get(this.$route.meta, 'title', ' ')
        }
      ]
    }
  },
  mounted() {
    if (this.$route.query.name === 'interHour') {
      this.queryData.reqType = '1'
      this.tabIndex = '1'
    }
    this.getList()
    this.getMyRank()
  },
  methods: {
    getList(isLoad) {
      if (isLoad) {
        this.$set(this.queryData, 'pageNo', 1)
      }
      const param = {
        pageSize: this.queryData.pageSize,
        pageNo: this.queryData.pageNo,
        type: this.queryData.type,
        reqType: this.queryData.reqType
      }
      this.loading = true
      queryRanking(param)
        .then((res) => {
          this.queryData.totalNum = res.page.total || 0
          res.page.records.forEach((val, idx) => {
            val.nowRank = (this.queryData.pageNo - 1) * this.queryData.pageSize + (idx + 1)
          })
          this.rankingList = res.page.records
        })
        .finally(() => {
          this.loading = false
        })
    },
    getMyRank() {
      const param = {
        type: this.queryData.type,
        reqType: this.queryData.reqType
      }
      queryMyRanking(param).then((res) => {
        this.userInfo = res
      })
    },
    getChangeType(type) {
      this.queryData.type = type
      this.getList(true)
      this.getMyRank()
    },
    //颜色显示
    noColor(rank) {
      if (rank == 1) {
        return 'color:#FCBA00'
      } else if (rank == 2) {
        return 'color:#5DC914'
      } else if (rank == 3) {
        return 'color:#2875D4'
      }
      return 'color:#BFC2C4'
    },
    //补零操作
    formmat(rank) {
      if (parseInt(rank) < 10) {
        return `0${rank}`
      }
      return rank
    },

    // 切换制度清单
    toggle_activeName() {
      if (this.tabIndex == this.queryData.reqType) {
        return
      }
      this.tabIndex = this.queryData.reqType
      this.queryData.totalNum = 0
      this.queryData.pageSize = 10
      this.queryData.type = '0'
      this.getList(true)
      this.getMyRank()
    },
    // 分页切换到某一页面
    toggle_page(index) {
      this.queryData.pageNo = index
      this.getList()
    },
    // 修改分页每次列表显示数据数量
    toggle_pageSize(size) {
      this.queryData.pageSize = size
      this.getList(true)
    }
  }
}
</script>
<style lang="scss" scoped>
.system-tab {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 56px;
  background: #fff;
  padding: 0 20px 0;
  box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
  margin: 20px 0;
  /deep/.el-tabs__header {
    margin: 0;
  }
  /deep/.el-tabs {
    // margin-top: 8px;
  }
  /deep/.el-tabs__nav-wrap::after {
    height: 0;
  }
  /deep/.el-tabs__item {
    height: 45px;
  }
}
.ranking-box {
  box-sizing: border-box;
  padding: 24px;
  box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
  border-radius: 4px;
  .ranking-currenUser {
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.06), 0 2px 8px 0 rgba(0, 61, 112, 0.08);
    border-radius: 6px;
  }
  .ranking-list {
    margin-bottom: 20px;
  }
  li,
  .ranking-currenUser {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 16px 24px;
    .ranking-no {
      font-size: 16px;
      color: #bfc2c4;
      font-weight: 900;
    }
    .ranking-headImg {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      margin: 0 16px;
    }
    .ranking-userInfo {
      flex: 1;
      span {
        display: block;
      }
      .ranking-name {
        color: #000000;
        opacity: 0.85;
        margin-bottom: 4px;
      }
      .ranking-org {
        color: #000000;
        opacity: 0.45;
      }
    }
    .ranking-score {
      font-size: 14px;
      color: rgba(0, 11, 21, 0.85);
    }
  }
}
.pagination {
  display: flex;
  justify-content: flex-end;
}
</style>
