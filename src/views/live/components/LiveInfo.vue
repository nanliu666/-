<template>
  <div class="info">
    <div class="info__login">
      <div class="common__title">
        登录信息
      </div>
      <ul class="content__box">
        <li v-for="item in data.loginInfo" :key="item.id" class="box__li">
          <div class="content__title">
            {{ item.showUserName }}
          </div>
          <ul class="content__list">
            <li class="content__li">
              <span class="label">频道号：</span>
              <span class="value">{{ data.channelId }}</span>
            </li>
            <li class="content__li">
              <span class="label">密码：</span>
              <span class="value">{{ item.loginPassword }}</span>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="student__list">
      <div class="common__title">
        学员列表
      </div>
      <common-table
        v-if="data.authType === 'direct'"
        id="demo"
        ref="table"
        :columns="columnsVisible"
        :config="tableConfig"
        :data="tableData"
        :loading="tableLoading"
        :page="page"
        @current-page-change="handleCurrentPageChange"
        @page-size-change="handlePageSizeChange"
      />
      <div v-else>
        <div>
          <span>学员总数：</span>
          <span>{{ data.traineeCount }}</span>
        </div>
        <div>学员登录平台即可观看，链接分享给任意人员可以进行观看</div>
        <!-- 需要验证码 -->
        <div v-if="data.authType === 'code'">
          <span>直播验证码：</span>
          <span>{{ data.authSecretOrCode }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const TABLE_COLUMNS = [
  {
    label: '用户编号',
    prop: 'userNo',
    minWidth: 150
  },
  {
    label: '姓名',
    prop: 'userName',
    minWidth: 120
  },
  {
    label: '所在部门',
    prop: 'orgName',
    minWidth: 120
  },
  {
    label: '手机号码',
    prop: 'phoneNum',
    minWidth: 120
  }
]
const TABLE_CONFIG = {
  rowKey: 'id',
  showIndexColumn: false,
  enablePagination: true,
  enableMultiSelect: false
}
import { getStudentList } from '@/api/live'
export default {
  name: 'LiveInfo',
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      tableLoading: false,
      page: {
        currentPage: 1,
        size: 10,
        total: 0
      },
      queryInfo: {
        pageNo: 1,
        pageSize: 10,
        liveId: this.$route.query.id || '555'
      },
      columnsVisible: TABLE_COLUMNS,
      tableConfig: TABLE_CONFIG,
      tableData: []
    }
  },
  created() {
    this.loadTableData()
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
    // 加载函数
    async loadTableData() {
      if (this.tableLoading) return
      try {
        this.tableData = []
        this.tableLoading = true
        let { totalNum, data } = await getStudentList(this.queryInfo)
        this.tableLoading = false
        this.tableData = data
        this.page.total = totalNum
      } catch (error) {
        this.tableLoading = false
        this.$message.error(error.message)
        window.console.error(JSON.stringify(this.queryInfo))
      }
    }
  }
}
</script>

<style scoped lang="scss">
.info {
  padding-top: 9px;
  .label {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: rgba(#000b15, 0.45);
  }
  .value {
    opacity: 0.85;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #000b15;
  }
  .common__title {
    position: relative;
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: rgba(0, 11, 21, 0.85);
    font-weight: 550;
    padding-left: 12px;
    margin-bottom: 16px;
    &::before {
      content: '';
      position: absolute;
      left: 0;
      background-color: #01aafc;
      width: 4px;
      height: 100%;
    }
  }
  .info__login {
    margin-bottom: 24px;
    .content__box {
      .box__li {
        margin-bottom: 24px;
        &:last-child {
          margin-bottom: 0;
        }
        .content__title {
          font-family: PingFangSC-Medium;
          font-size: 14px;
          color: rgba(0, 11, 21, 0.85);
          font-weight: 550;
          margin-bottom: 8px;
        }
        .content__list {
          display: flex;
          .content__li {
            display: flex;
            &:first-child {
              margin-right: 200px;
            }
          }
        }
      }
    }
  }
  .student__list {
  }
}
</style>
