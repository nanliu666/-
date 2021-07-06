<template>
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
    <template #topMenu>
      <div class="operations">
        <searchPopOver
          :popover-options="searchPopoverConfig.popoverOptions"
          :require-options="searchPopoverConfig.requireOptions"
          @submit="handleSearch"
        />
      </div>
    </template>

    <template #multiSelectMenu="{ selection }">
      <el-button
        style="margin-bottom: 0"
        type="text"
        :disabled="selection.some((item) => item.certificate != 2)"
        @click="() => handleRemoveItems(selection, 1)"
      >
        发放证书
      </el-button>
      <el-button
        style="margin-bottom: 0"
        type="text"
        :disabled="selection.some((item) => item.certificate != 1)"
        @click="() => handleRemoveItems(selection, 0)"
      >
        撤回证书
      </el-button>
    </template>

    <!-- 姓名 -->
    <template slot="stuName" slot-scope="{ row }">
      <!-- <el-button type="text" @click="toUserDetail(row)"> -->
      {{ row.stuName }}
      <!-- </el-button> -->
    </template>

    <template slot="signPercent" slot-scope="{ row }">
      <span>{{
        !!row.signTimes && !!row.signPercent ? row.signTimes + '次/' + row.signPercent + '%' : '--'
      }}</span>
    </template>
    <!-- <template slot="deptName" slot-scope="{ row }">
              <div>
                {{ row.deptName || "--" }}
              </div>
            </template> -->
    <!-- 选修学习进度 -->
    <template slot="electiveProgress" slot-scope="{ row }">
      <el-progress
        v-if="typeof row.electiveProgress === 'number'"
        :percentage="row.electiveProgress || 0"
      ></el-progress>

      <span v-else>--</span>
    </template>
    <!-- 在线学习进度(必修) -->
    <template slot="onlineProgress" slot-scope="{ row }">
      <el-progress
        v-if="typeof row.onlineProgress === 'number'"
        :percentage="row.onlineProgress || 0"
      ></el-progress>

      <span v-else>--</span>
    </template>

    <!-- 作业提交率 -->
    <!-- <template slot="job" slot-scope="{ row }">
      <span>{{
        typeof row.jobTimes == 'number' && typeof row.jobPercent == 'number'
          ? row.jobTimes + '次/' + row.jobPercent + '%'
          : '--'
      }}</span>
    </template> -->
    <!-- 上报材料 -->
    <template slot="isSubmit" slot-scope="{ row }">
      <span style="text-align: center; display: inline-block; width: 100%">{{
        row.isSubmit === 'Yes' ? '已提交' : '未提交'
      }}</span>
    </template>

    <!-- 考试情况 // 1：已通过；2：未通过；3：未开始）-->
    <template slot="examStatus" slot-scope="{ row }">
      <span v-if="row.examStatus == 2">已通过</span>
      <span v-if="row.examStatus == 3">未通过</span>
      <span v-if="row.examStatus == 1">未开始</span>
    </template>
    <!-- 评估情况 // （1：已评估；2：未评估；3：未开始）-->
    <template slot="evaluate" slot-scope="{ row }">
      <span v-if="row.evaluate == 1">已评估</span>
      <span v-if="row.evaluate == 2">未评估</span>
      <span v-if="row.evaluate == 3">未开始</span>
    </template>

    <!-- 操作 -->
    <template slot="handler" slot-scope="scope">
      <el-button type="text" size="medium" @click.stop="toStuffDetail(scope.row)">
        查看上报材料
      </el-button>

      <el-button
        v-if="scope.row.certificate == 1"
        :disabled="scope.row.certificate != 1"
        type="text"
        size="medium"
        @click.stop="isrevokeCertificate(scope.row)"
      >
        撤回证书
      </el-button>
      <!-- :disabled="scope.row.certificate != 2" -->
      <el-button v-else type="text" size="medium" @click.stop="isgrantCertificate(scope.row)">
        发放证书
      </el-button>
    </template>
  </common-table>
</template>

<script>
import {
  studentList,
  grantCertificate,
  revokeCertificate,
  getOrgTreeSimple
} from '@/api/lecturerTask'
// import { getOrgTreeSimple } from '@/api/org/org'
import searchPopOver from '@/components/searchPopOver'
import { mapGetters } from 'vuex'
// 表格属性
const TABLE_COLUMNS = [
  {
    label: '姓名',
    prop: 'stuName',
    slot: true
  },
  {
    label: '手机号码',
    prop: 'phone'
  },
  {
    label: '所属部门',
    prop: 'deptName',
    minWidth: 120,
    slot: true
  },
  {
    label: '线下签到率',
    prop: 'signPercent',
    minWidth: 150,
    slot: true
  },
  {
    label: '在线学习进度(必修)',
    prop: 'onlineProgress',
    minWidth: 180,
    slot: true
  },
  {
    label: '选修学习进度',
    prop: 'electiveProgress',
    minWidth: 120,
    slot: true
  },
  // 1：已通过；2：未通过；3：未开始）
  {
    label: '作业提交率',
    prop: 'job',
    minWidth: 150,
    formatter: (row) => {
      const data = row.jobTimes ? row.jobTimes + '次/' + row.jobPercent + '%' : '--'
      return data
    }
  },
  {
    label: '学习心得提交率',
    prop: 'feelTimes',
    minWidth: 150,
    formatter: (row) => {
      const data = row.feelTimes ? row.feelTimes + '次/' + row.feelPercent + '%' : '--'
      return data
    }
  },
  {
    label: '上报材料',
    prop: 'isSubmit',
    slot: true
  },
  {
    label: '考试情况',
    prop: 'examStatus',
    slot: true
  },
  // {
  //   label: '结业状态',
  //   prop: 'endStatus',
  //   formatter: (row) => {
  //     const END_STATUS = {
  //       0: '未结业',
  //       1: '已结业'
  //     }
  //     return END_STATUS[row.endStatus]
  //   }
  // },
  // （1：已评估；2：未评估；3：未开始）
  {
    label: '评估情况',
    prop: 'evaluate',
    slot: true
  }
]

const TABLE_CONFIG = {
  rowKey: 'stuId',
  handlerColumn: {
    width: 200
  },
  enableMultiSelect: true,
  enablePagination: true,
  showHandler: true,
  showIndexColumn: false
}
// 搜索配置
const SEARCH_POPOVER_REQUIRE_OPTIONS = [
  {
    config: { placeholder: '请输入学员名称搜索' },
    data: '',
    field: 'stuName',
    label: '',
    type: 'input'
  }
]
const SEARCH_POPOVER_POPOVER_OPTIONS = [
  {
    // config: { placeholder: 'deptId' },
    data: '',
    field: 'deptCode',
    label: '所属部门',
    type: 'treeSelect',
    config: {
      selectParams: {
        placeholder: '请输入内容',
        multiple: false
      },
      treeParams: {
        data: [],
        'check-strictly': true,
        'default-expand-all': false,
        'expand-on-click-node': false,
        clickParent: true,
        filterable: false,
        props: {
          children: 'children',
          label: 'orgName',
          disabled: 'disabled',
          value: 'code'
        }
      }
    }
  },
  {
    config: { placeholder: '请选择' },
    data: '',
    field: 'onlineProgress',
    label: '在线学习进度(必修)',
    type: 'select',
    options: [
      { value: 1, label: '已完成' },
      { value: 2, label: '未完成' }
    ]
  },
  {
    config: { placeholder: '请选择' },
    data: '',
    field: 'examStatus',
    label: '考试情况',
    type: 'select',
    options: [
      { value: 1, label: '已通过' },
      { value: 2, label: '未通过' },
      { value: 3, label: '未开始' }
    ]
  },
  {
    config: { placeholder: '请选择' },
    data: '',
    field: 'evaluate',
    label: '评估情况',
    type: 'select',
    options: [
      { value: 1, label: '已评估' },
      { value: 2, label: '未评估' },
      { value: 3, label: '未开始' }
    ]
  },
  {
    config: { placeholder: '请选择' },
    data: '',
    field: 'sign',
    label: '线下签到率',
    type: 'select',
    options: [
      { value: 1, label: '全部' },
      { value: 2, label: '未完成' },
      { value: 3, label: '已完成' }
    ]
  }
]
const TABLE_PAGE_CONFIG = {}
const SEARCH_POPOVER_CONFIG = {
  popoverOptions: SEARCH_POPOVER_POPOVER_OPTIONS,
  requireOptions: SEARCH_POPOVER_REQUIRE_OPTIONS
}
export default {
  components: { searchPopOver },
  filters: {
    // 过滤不可见的列
    columnsFilter: (visibleColProps) =>
      _.filter(TABLE_COLUMNS, ({ prop }) => _.includes(visibleColProps, prop))
  },
  data() {
    return {
      // 默认选中所有列
      columnsVisible: _.map(TABLE_COLUMNS, ({ prop }) => prop),
      tableConfig: TABLE_CONFIG,
      tableData: [],
      tablePageConfig: TABLE_PAGE_CONFIG,
      searchPopoverConfig: SEARCH_POPOVER_CONFIG,
      page: {
        currentPage: 1,
        size: 10,
        total: 0
      }
    }
  },
  created() {
    this.isStudentList()
    this.loadOrgData()
  },
  computed: {
    ...mapGetters(['orgIds'])
  },
  methods: {
    toStuffDetail(row) {
      let data = { ...row }
      // const { trainName, trainId } = this.showTrainDetail
      // data.trainName = trainName
      data.trainId = data.stuId
      data.studyPlanId = this.$route.query.id
      const query = {}
      Object.keys(data).forEach((key) => {
        query[key] = data[key]
      })

      console.log(query)

      this.$router.push({
        path: '/trainMaterials',
        query
      })

      // this.$router.push({
      //   path: '/trainMaterials',
      //   query: { trainId: row.stuId, studyPlanId: this.$route.query.id }
      // })
    },
    //  处理页码改变
    handleCurrentPageChange(param) {
      this.page.currentPage = param
      this.isStudentList()
    },
    handlePageSizeChange(param) {
      this.page.size = param
      this.isStudentList()
    },
    handleSearch(searchParams) {
      // this.loadTableData(_.pickBy(searchParams))
      this.page.currentPage = 1
      this.isStudentList(searchParams)
    },

    // 学员培训列表
    isStudentList(courseName) {
      // console.log('id', this.$route.query.id)
      let page = {
        pageNo: '',
        pageSize: '',
        totalNum: ''
      }
      page.pageNo = this.page.currentPage
      page.pageSize = this.page.size
      let params = { ...page, ...courseName }
      params.status = this.status
      // params.trainId = 1
      params.trainId = this.$route.query.id
      studentList(params).then((res) => {
        this.tableData = res.data.map((item) => {
          if (!item.deptName) {
            item.deptName = '--'
          }
          return item
        })
        this.page.total = res.totalNum
        SEARCH_POPOVER_POPOVER_OPTIONS[0].options = []
        this.tableData.forEach((item) => {
          // console.log(item.id,item.deptName);
          SEARCH_POPOVER_POPOVER_OPTIONS[0].options.push({
            value: item.id,
            label: item.deptName
          })
        })
      })
    },

    //发放学员证书
    isgrantCertificate(row) {
      grantCertificate({ stuIds: row.stuId, trainId: this.$route.query.id }).then(() => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.page.currentPage = 1
        this.page.size = 10
        this.isStudentList()
      })
    },
    // 撤回学员证书
    isrevokeCertificate(row) {
      revokeCertificate({ stuIds: row.stuId, trainId: this.$route.query.id }).then(() => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.isStudentList()
      })
    },

    handleRemoveItems(selection, i) {
      let idData = _.map(selection, ({ stuId }) => stuId).join(',')
      this.$confirm(
        `您确定要为${selection[0].stuName}等${selection.length}个学员${
          i ? '发放证书' : '撤回证书'
        }吗？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          this.batchFn(idData, i)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
    },

    loadOrgData() {
      getOrgTreeSimple({ parentOrgId: 0 }).then(
        (res) =>
          (this.searchPopoverConfig.popoverOptions[0].config.treeParams.data = _.concat(
            [
              {
                orgName: '全部',
                orgId: ''
              }
            ],
            res
          ))
      )
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep input.el-input__inner {
  width: 370px;
  height: 32px;
}
::v-deep button.el-button.select-btn.el-button--default.el-button--medium.el-popover__reference {
  padding: 8px 20px;
}
/deep/.cell:empty::before {
  content: '--';
  color: gray;
}
</style>
