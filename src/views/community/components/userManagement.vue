<template>
  <div class="userManagement">
    <!-- 筛选 -->
    <div class="screening">
      <el-row type="flex" justify="end">
        <el-col :span="8">
          <el-input
            v-model="keyword"
            placeholder="请输入用户名"
            suffix-icon="el-icon-search"
            @input="searchName"
            clearable
            size="small"
            style="width: 380px"
          >
          </el-input>
        </el-col>
      </el-row>
    </div>
    <!-- 数据表格 -->
    <common-table
      ref="table"
      style="margin-top: 15px"
      :columns="columns"
      :config="tableConfig"
      :data="cloneTableData"
      :page-config="tablePageConfig"
      :page="page"
      @current-page-change="handleCurrentPageChange"
      @page-size-change="handlePageSizeChange"
      v-loading="loading"
    >
      <template slot="name" slot-scope="{ row }">
        <el-button type="text" @click="goHomePages(row)">{{ row.name }}</el-button>
      </template>
      <template slot="status" slot-scope="{ row }">
        {{ row.status ? '正常' : `禁言中 剩余${countdown(row.forbitEndTime)}` }}
      </template>
      <template slot="handler" slot-scope="scope">
        <el-button type="text" @click="banned(scope.row)" v-if="scope.row.status"> 禁言</el-button>
        <el-button type="text" @click="removeBanned(scope.row)" v-else>解除禁言</el-button>
      </template>
    </common-table>
    <!-- 禁言弹出框 -->
    <el-dialog :visible.sync="dialogVisible" width="40%" custom-class="userDialog">
      <!-- 头部插槽 -->
      <div slot="title" class="dialogTitle">
        禁言
        <el-divider></el-divider>
      </div>
      <el-form label-width="100px" label-position="left">
        <el-form-item label="用户名">
          <span>{{ bannedData.name }}</span>
        </el-form-item>
        <el-form-item label="用户编号">
          <span>{{ bannedData.workNo }}</span>
        </el-form-item>
        <el-form-item label="所在部门">
          <span>{{ bannedData.orgName }}</span>
        </el-form-item>
        <el-form-item label="禁言时长">
          <el-select v-model="bannedValue" placeholder="请选择" style="width: 100%">
            <el-option
              v-for="item in bannedOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 底部插槽 -->
      <div slot="footer">
        <el-divider></el-divider>
        <el-button size="medium" @click="handleClose"> 取 消 </el-button>
        <el-button type="primary" size="medium" @click="handleConfirm" :loading="confirmLoading">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryAreaUserList, forbidPost, removeForbidPost } from '@/api/community'
export default {
  name: 'UserManagement',
  props: {
    areaId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      keyword: '', // 搜索关键词
      columns: [
        {
          label: '用户名',
          prop: 'name',
          slot: true
        },
        {
          label: '用户编号',
          width: 100,
          prop: 'workNo'
        },
        {
          label: '所在部门',
          prop: 'orgName'
        },
        {
          label: '是否关注',
          prop: 'isFocus',
          width: 100,
          formatter: function (row) {
            return { 0: '否', 1: '是' }[row.isFocus]
          }
        },
        {
          label: '发帖数量',
          width: 100,
          prop: 'topicNum'
        },
        {
          label: '是否专家',
          width: 100,
          prop: 'isExpert',
          formatter: function (row) {
            return { 0: '否', 1: '是' }[row.isExpert]
          }
        },
        {
          label: '状态',
          prop: 'status',
          slot: true
        }
      ],
      tableConfig: {
        handlerColumn: {
          width: 100
        },
        enablePagination: true,
        showHandler: true,
        showIndexColumn: false
      },
      tableData: [], // 表格数据
      tablePageConfig: {
        currentPage: 1
      },
      page: {
        // 分页配置
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      loading: false,
      dialogVisible: false,
      bannedData: {}, // 禁言数据
      bannedValue: 'hour', // 禁言时长
      bannedOptions: [
        {
          value: 'hour',
          label: '1小时'
        },
        {
          value: 'day',
          label: '1天'
        },
        {
          value: 'week',
          label: '1周'
        },
        {
          value: 'month',
          label: '1个月'
        }
      ],
      confirmLoading: false,
      timer: null
    }
  },
  computed: {
    cloneTableData: {
      get() {
        return this.tableData
      }
    }
  },
  methods: {
    //  处理页码改变
    handleCurrentPageChange(param) {
      this.page.pageNo = param
      this.initAreaUserList()
    },
    handlePageSizeChange(param) {
      this.page.pageSize = param
      this.initAreaUserList()
    },
    // 查询用户管理列表
    async initAreaUserList() {
      let params = {
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
        areaId: this.areaId,
        name: this.keyword
      }
      this.loading = true
      await queryAreaUserList(params)
        .then((res) => {
          let list = res.data
          //首先循环数组 在 正常的情况下这个数组是后台传递过来的 然后将这个数组中的最后截止时间减去当前时间获得时间戳
          for (let i = 0, len = list.length; i < len; i++) {
            const item = list[i]
            item.forbitEndTime = new Date(item.forbitEndTime).getTime() - new Date().getTime()
          }
          this.tableData = list //将改变后的数组赋值给自定义的数组 然后调用计时器 每秒减去指定字段的时间戳 -1000毫秒
          if (this.timer) {
            //这一段是防止进入页面出去后再进来计时器重复启动
            clearInterval(this.timer)
          }
          this.beginTimer() //启动计时器减指定字段的时间
          this.page.total = res.totalNum
        })
        .finally(() => {
          this.loading = false
        })
    },
    beginTimer() {
      //这个计时器是每秒减去数组中指定字段的时间
      this.timer = setInterval(() => {
        for (let i = 0, len = this.tableData.length; i < len; i++) {
          const item = this.tableData[i]
          if (item.forbitEndTime > 0) {
            item.forbitEndTime = item.forbitEndTime - 1000
          } else {
            this.$set(item, 'status', 1)
          }
        }
      }, 1000)
    },
    countdown(timeStamp) {
      let result = ''
      let days = Math.floor(timeStamp / 1000 / 60 / 60 / 24) //获取天数
      let hours = Math.floor((timeStamp / 1000 / 60 / 60) % 24) // 获取小时
      let minutes = Math.floor((timeStamp / 1000 / 60) % 60) //获取分钟数
      let seconds = Math.floor((timeStamp / 1000) % 60) //获取秒数
      //   不到10前面加0
      const checkTime = (i) => {
        //将0-9的数字前面加上0，例1变为01
        if (i < 10) {
          i = '0' + i
        }
        return i
      }
      days = checkTime(days)
      hours = checkTime(hours)
      minutes = checkTime(minutes)
      seconds = checkTime(seconds)
      // 判断天、时、分、秒;
      if (days > 0) {
        result = `${days}天${hours}时${minutes}分${seconds}秒`
      } else {
        if (hours > 0) {
          result = `${hours}时${minutes}分${seconds}秒`
        } else {
          if (minutes > 0) {
            result = `${minutes}分${seconds}秒`
          } else {
            if (seconds >= 0) {
              result = `${seconds}秒`
            }
          }
        }
      }
      return result
    },
    // 筛选
    searchName: _.debounce(function (val) {
      this.keyword = val
      this.page.pageNo = 1
      this.initAreaUserList()
    }, 300),
    // 禁言
    banned(row) {
      this.bannedData = row
      this.dialogVisible = true
    },
    handleClose() {
      this.bannedData = {}
      this.bannedValue = 'hour'
      this.dialogVisible = false
    },
    async handleConfirm() {
      let bannedTime = 0,
        params = {
          areaId: this.areaId,
          userId: this.bannedData.userId
        }
      // 计算禁言时间(小时)
      switch (this.bannedValue) {
        case 'hour':
          bannedTime = 1
          break
        case 'day':
          bannedTime = 1 * 24
          break
        case 'week':
          bannedTime = 1 * 24 * 7
          break
        case 'month':
          bannedTime = 1 * 24 * 30
          break
      }
      params = Object.assign(params, { hours: bannedTime })
      this.confirmLoading = true
      await forbidPost(params)
        .then(() => {
          this.handleClose()
          this.initAreaUserList()
          this.$message.success('禁言成功!')
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },
    // 解除禁言
    async removeBanned(row) {
      let params = {
        areaId: this.areaId,
        userId: row.userId
      }
      await removeForbidPost(params).then(() => {
        this.initAreaUserList()
        this.$message.success('解除禁言成功!')
      })
    },
    // 跳转他人主页
    goHomePages(item) {
      this.$router.push({ path: '/community/otherHomePage', query: { userId: item.userId } })
    }
  },
  created() {
    this.initAreaUserList()
  }
}
</script>

<style lang="scss" scoped>
.userManagement {
  /deep/ .userDialog {
    .el-dialog__body {
      padding: 0 20px;
    }
    .el-form-item {
      margin-bottom: 0;
    }
  }
}
</style>
