<template>
  <div class="rsignUp">
    <div class="top_title">
      <span class="input">
        <el-input
          v-model="getSigninForm.name"
          placeholder="请输入学员姓名搜索"
          suffix-icon="el-input__icon el-icon-search"
          :clearable="true"
        >
        </el-input>
      </span>
      <span class="btn">
        <el-button size="medium" type="primary" @click="downcodeDlgVisible = true">
          签到二维码
        </el-button>
      </span>
    </div>

    <!-- <common-table
      ref="table"
      :columns="columnsVisible | columnsFilter"
      :config="tableConfig"
      :data="tableData"
      :page-config="tablePageConfig"
      :page="page"
      @current-page-change="handleCurrentPageChange"
      @page-size-change="handlePageSizeChange"
    >
      <template slot="Name" slot-scope="{ row }">
        <el-button type="text">{{ row.Name }}</el-button>
      </template>
    </common-table> -->

    <el-table class="signin-table" :data="signinData">
      <el-table-column
        v-for="(item, index) in signinLevel"
        :key="index"
        :fixed="item.prop === 'userName'"
        show-overflow-tooltip
        :prop="item.prop"
        :label="item.label"
        :min-width="item.prop === 'userName' ? '110' : item.prop === 'phonenum' ? '150' : '200'"
        :width="tiemProp(item.prop)"
      >
        <template slot-scope="scope">
          {{ getSigninColumn(scope.row[item.prop], item.dynamic) }}
        </template>
      </el-table-column>
    </el-table>

    <div style="margin-right: 45px">
      <pagination
        :total="signinTotal"
        :page="getSigninForm.pageNo"
        :limit="getSigninForm.pageSize"
        @pagination="signinPagination"
      ></pagination>
    </div>
    <!-- <QrCode ref="QrCode"></QrCode> -->
    <down-code-dialog :dialog-visibe.sync="downcodeDlgVisible" :train-id="getSigninForm.trainId" />
  </div>
</template>

<script>
import DownCodeDialog from './downCodeDialog'

import pagination from '@/components/common-pagination'
import { trainSignList } from '@/api/lecturerTask'
// const signinRef = {
//   userName: '用户',
//   phonenum: '手机号',
//   orgName: '部门'
// }

const signinRef = [
  { label: '姓名', prop: 'userName' },
  { label: '手机号', prop: 'phonenum' },
  { label: '所属部门', prop: 'orgName' }
]

export default {
  components: {
    pagination,
    DownCodeDialog
  },
  data() {
    return {
      downcodeDlgVisible: false,
      searchInput: '',
      signinData: [],
      // signinLevel: Object.keys(signinRef).map((key) => ({
      //   label: signinRef[key],
      //   prop: key
      // })),

      signinLevel: signinRef,
      signinTotal: 0,
      getSigninForm: {
        pageNo: 1,
        pageSize: 10,
        name: '',
        trainId: ''
      }
    }
  },
  watch: {
    'getSigninForm.name': {
      handler() {
        this.getSigninData()
      }
    }
  },

  created() {
    this.getSigninData()
  },
  activated() {
    this.getSigninData()
  },
  methods: {
    tiemProp(i) {
      let titleWidth = ''
      if (i != 'userName' && i != 'phonenum' && i != 'orgName') titleWidth = '200'
      return titleWidth
    },
    showDialog() {
      this.$nextTick(() => {
        this.$refs.QrCode.dialogVisible = true
      })
    },
    //  处理页码改变
    signinPagination({ page, limit }) {
      this.getSigninForm.pageNo = page
      this.getSigninForm.pageSize = limit
      this.getSigninData()
    },

    getSigninColumn(value, d) {
      if (d) {
        switch (value) {
          case '1':
            return '缺勤'
          case '2':
            return '已签到'
          case '3':
            return '未开始'
          default:
            return '--'
        }
      }
      return value || '--'
    },

    // 拿数据
    getSigninData() {
      this.getSigninForm.trainId = this.$route.query.id
      trainSignList(this.getSigninForm).then((res) => {
        const { data = [], totalNum = 0 } = res
        this.signinData = data
        this.signinTotal = totalNum
        const value = data[0]
        if (!value) return
        const level = []
        Object.keys(value).forEach((key) => {
          if (key === 'userId') return
          console.log(value)
          if (key === 'signInSituation') {
            value[key].forEach((obj) => {
              const timeArr = obj['todoTime'].split(' ')
              const year = timeArr[0].replace(/-/g, '/')
              const date = timeArr[1].slice(0, -3) + '-' + timeArr[2].slice(0, -3)
              const label = year + ' ' + date
              level.push({
                prop: label,
                label,
                dynamic: true
              })
            })
          } else {
            // level.push({
            //   prop: key,
            //   label: signinRef[key]
            // })
          }
        })
        level.forEach((item, index) => {
          this.signinLevel[index + 3] = item
        })
        // this.signinLevel.push(...level)
        this.signinData = data.map((item) => {
          item.signInSituation.forEach((sign) => {
            const { todoTime, signStatus } = sign
            item[todoTime] = signStatus
          })
          delete item.signInSituation
          return item
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.rsignUp {
  margin-top: 20px;
  .top_title {
    display: flex;
    justify-content: space-between;
    padding: 0 0 20px 0;
    .input {
      width: 380px;
      height: 32px;
    }
  }
  ::v-deep .el-input.el-input--suffix {
    width: 380px;
    height: 32px;
  }
  ::v-deep input.el-input__inner {
    width: 380px;
    height: 32px;
  }
  ::v-deep span.el-input__suffix {
    top: -4px;
  }
  /deep/.cell:empty::before {
    content: '--';
    color: gray;
  }
}
</style>
