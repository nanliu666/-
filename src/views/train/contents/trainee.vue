<template>
  <div class="trainee">
    <div class="filter-container">
      <el-input
        v-model="filterForm.stuName"
        size="small"
        clearable
        placeholder="输入学员名称搜索"
        suffix-icon="el-icon-search"
        class="search-box"
      >
      </el-input>

      <el-popover v-model="filterFormVisible" placement="bottom" width="780" transition="false">
        <el-form
          :inline="true"
          :model="filterForm"
          class="filter-form"
          label-width="110px"
          style="padding: 24px;"
        >
          <el-form-item label="所属部门">
            <el-input
              v-model="filterForm.department"
              clearable
              style="width: 202px;"
              placeholder="请输入所属部门"
            >
            </el-input>
          </el-form-item>

          <el-form-item label="在线学习进度（必修）">
            <el-select v-model="filterForm.onlineProgress" clearable placeholder="请选择">
              <el-option label="已完成" :value="1"></el-option>
              <el-option label="未完成" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="考试情况">
            <el-select v-model="filterForm.examStatus" clearable placeholder="请选择">
              <el-option label="已通过" :value="1"></el-option>
              <el-option label="未通过" :value="2"></el-option>
              <el-option label="未开始" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="评估情况">
            <el-select v-model="filterForm.evaluate" clearable placeholder="请选择">
              <el-option label="已评估" :value="1"></el-option>
              <el-option label="未评估" :value="2"></el-option>
              <el-option label="未开始" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="证书状态">
            <el-select v-model="filterForm.certificate" clearable placeholder="请选择">
              <el-option label="已获得" :value="1"></el-option>
              <el-option label="未获得" :value="2"></el-option>
              <el-option label="未开始" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <div style="text-align: right; margin-right: 75px;">
            <el-button type="primary" size="medium" @click.native="getList">
              搜索
            </el-button>
            <el-button size="medium" @click="resetForm">
              重置
            </el-button>
          </div>
        </el-form>
        <el-button slot="reference" size="medium">
          筛选
        </el-button>
      </el-popover>
    </div>
    <div class="table-container">
      <el-table
        :header-cell-style="headerCellStyle"
        :data="tableData"
        style="width: 100%"
        height="527"
      >
        <el-table-column type="selection" width="55" align="center"> </el-table-column>
        <el-table-column fixed prop="stuName" label="姓名" width="76" align="center">
        </el-table-column>
        <el-table-column prop="phone" label="手机号" align="center"> </el-table-column>
        <el-table-column prop="deptName" label="所属部门" align="center"> </el-table-column>
        <el-table-column
          prop="onlineProgress"
          label="在线学习进度（必修）"
          width="200"
          align="center"
        >
          <template slot-scope="scope">
            <el-progress :percentage="scope.row.onlineProgress" :stroke-width="4"></el-progress>
          </template>
        </el-table-column>
        <el-table-column prop="electiveProgress" label="选修学习进度" width="200" align="center">
          <template slot-scope="scope">
            <el-progress :percentage="scope.row.electiveProgress" :stroke-width="4"></el-progress>
          </template>
        </el-table-column>
        <el-table-column prop="examStatus" label="考试情况" align="center">
          <template slot-scope="scope">
            {{
              scope.row.examStatus === 1
                ? '未开始'
                : scope.row.examStatus === 2
                  ? '已通过'
                  : '未通过'
            }}
          </template>
        </el-table-column>
        <el-table-column prop="evaluate" label="评估情况" align="center">
          <template slot-scope="scope">
            {{
              scope.row.evaluate === 1 ? '已评估' : scope.row.evaluate === 2 ? '未评估' : '未开始'
            }}
          </template>
        </el-table-column>
      </el-table>
    </div>

    <pagination
      :total="total"
      :limit="filterForm.pageSize"
      :page="filterForm.pageNo"
      @pagination="pagination"
    >
    </pagination>
  </div>
</template>

<script>
import Pagination from 'src/components/common-pagination'
import { studentList } from 'src/api/train'
const originForm = {
  stuName: '',
  department: '',
  onLinePro: '',
  creater: '',
  exam: '',
  rate: '',
  state: '',
  pageNo: 1,
  pageSize: 10
}
export default {
  name: 'Trainee',
  components: {
    Pagination
  },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      tableData: [],
      filterFormVisible: false,
      filterForm: Object.assign({}, originForm),
      total: 0,
      stuName: ''
    }
  },
  watch: {
    filterForm: {
      handler(val) {
        const stuName = val.stuName
        if (stuName !== this.stuName) {
          this.filterForm.pageNo = 1
          this.filterForm.pageSize = 10
          this.stuName = stuName
          this.getList()
        }
      },
      deep: true
    }
  },
  created() {
    this.filterForm.trainId = this.data.trainId
    this.getList()
  },
  methods: {
    resetForm() {
      this.filterForm = Object.assign({ trainId: this.data.trainId }, originForm)
    },
    getList() {
      studentList(this.filterForm).then((res) => {
        const { records, current: pageNo, size: pageSize } = res
        this.tableData = records
        Object.assign(this.filterForm, { pageNo, pageSize })
      })
    },
    pagination(data) {
      const { page: pageNo, limit: pageSize } = data
      Object.assign(this.filterForm, { pageNo, pageSize })
      this.getList()
    },
    headerCellStyle() {
      return 'height: 50px; font-size: 14px; color: rgba(0,11,21,0.45); font-weight: 500;'
    }
  }
}
</script>

<style lang="scss" scoped>
.trainee {
  .filter-container {
    .search-box {
      width: 380px;
      margin-right: 16px;
    }
  }
  .table-container {
    margin-top: 16px;
  }
  .pagination {
    margin-top: 16px;
  }
}
</style>

<style lang="scss">
.filter-form .el-form-item__label {
  text-align: center !important;
}
</style>
