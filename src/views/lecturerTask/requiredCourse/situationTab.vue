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
      <el-button style="margin-bottom: 0" type="text" @click="() => handleRemoveItems(selection)">
        批量导出
      </el-button>
    </template>

    <template slot="progress" slot-scope="{ row }">
      <el-progress :percentage="row.progress"></el-progress>
    </template>
    <!-- 操作 -->
    <template slot="handler" slot-scope="scope">
      <el-button type="text" size="medium" @click.stop="toStuffDetail(scope.row)">
        查看上报材料
      </el-button>
    </template>
  </common-table>
</template>

<script>
// import { studentList, grantCertificate, revokeCertificate } from '@/api/training/training'
// import { getOrgTreeSimple } from '@/api/org/org'
import { parseTime } from '@/util/util'
import searchPopOver from '@/components/searchPopOver'
import { queryStudyList, getOrgTreeSimple } from '@/api/lecturerTask'
import { mapGetters } from 'vuex'
// 表格属性
const TABLE_COLUMNS = [
  {
    label: '姓名',
    prop: 'name',
    slot: true
  },
  {
    label: '手机号码',
    prop: 'phonenum'
  },
  {
    label: '所属部门',
    prop: 'deptName',
    slot: true
  },
  {
    label: '学习进度',
    prop: 'progress',
    slot: true,
    width: 180
  },
  {
    label: '作业提交率',
    prop: 'jobPercent',
    formatter: (row) => {
      return row.jobPercent ? row.jobPercent + '%' : ''
    }
  },
  {
    label: '课程通过状态',
    prop: 'isOnlineCourse', // 线上课程通过状态Yes/No
    formatter: (row) => {
      const END_STATUS = {
        Yes: '通过',
        No: '未通过'
      }
      return END_STATUS[row.isOnlineCourse]
    }
  },
  {
    label: '考试情况',
    prop: 'isExaimPass',
    formatter: (row) => {
      const END_STATUS = {
        Yes: '通过',
        No: '未通过'
      }
      return END_STATUS[row.isExaimPass]
    }
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
    field: 'userName',
    label: '',
    type: 'input'
  }
]
const SEARCH_POPOVER_POPOVER_OPTIONS = [
  {
    // config: { placeholder: 'deptId' },
    data: '',
    field: 'deptName',
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
          value: 'orgName'
        }
      }
    }
  },
  {
    config: { placeholder: '请选择' },
    data: '',
    field: 'progress',
    label: '学习进度',
    type: 'select',
    options: [
      { value: 'Yes', label: '已完成' },
      { value: 'no', label: '未完成' }
    ]
  },
  // {
  //   config: { placeholder: '请选择' },
  //   data: '',
  //   field: 'isExaimPass',
  //   label: '考试情况',
  //   type: 'select',
  //   options: [
  //     { value: 'yes', label: '已通过' },
  //     { value: 'Init', label: '未开始' },
  //     { value: 'no', label: '未通过' }
  //   ]
  // },
  {
    config: { placeholder: '请选择' },
    data: '',
    field: 'jobPercent',
    label: '作业提交情况',
    type: 'select',
    options: [
      { value: 'Yes', label: '已完成' },
      { value: 'no', label: '未完成' }
    ]
  },
  {
    config: { placeholder: '请选择' },
    data: '',
    field: 'isOnlineCourse',
    label: '课程通过状态',
    type: 'select',
    options: [
      { value: 'Yes', label: '已通过' },
      { value: 'no', label: '未通过' }
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
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      queryParams: {}
    }
  },
  computed: {
    ...mapGetters(['orgIds'])
  },
  created() {
    this.isStudentList()
    this.loadOrgData()
  },
  methods: {
    // 批量
    handleRemoveItems(selection) {
      import('@/vendor/Export2Excel').then((excel) => {
        const tHeader = [
          '姓名',
          '手机号码',
          '所属部门',
          '学习进度(%)',
          '作业提交率(%)',
          '课程通过状态',
          '考试情况'
        ]
        const filterVal = [
          'name',
          'phonenum',
          'deptName',
          'progress',
          'jobPercent',
          'isOnlineCourse',
          'isExaimPass'
        ]
        const list = selection
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '学习情况导出数据',
          autoWidth: true,
          bookType: 'xlsx'
        })
      })
      this.$refs.table.clearSelection()
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          if (j === 'startDate' || j == 'leaveDate') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        })
      )
    },

    toStuffDetail(row) {
      this.$router.push({
        path: '/materials',
        query: { stuId: row.stuId, studyPlanId: row.studyPlanId }
      })
    },
    //  处理页码改变
    handleCurrentPageChange(param) {
      this.page.pageNo = param
      this.isStudentList()
    },
    handlePageSizeChange(param) {
      this.page.pageSize = param
      this.isStudentList()
    },
    handleSearch(searchParams) {
      // this.loadTableData(_.pickBy(searchParams))
      this.page.pageNo = 1
      this.queryParams = searchParams
      this.isStudentList()
    },

    // 学员培训列表
    async isStudentList() {
      // console.log('id', this.$route.query.id)
      let params = {
        id: this.$route.query.id,
        ...this.queryParams
      }
      let res = await queryStudyList({ ...params, ...this.page })
      this.tableData = res.data
      this.page.total = res.totalNum
    },

    loadOrgData() {
      // eslint-disable-next-line no-undef
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
/deep/.cell:empty::before {
  content: '--';
  color: gray;
}
</style>
