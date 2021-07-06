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
import { students, getOrgTreeSimple } from '@/api/lecturerTask'
import searchPopOver from '@/components/searchPopOver'
// 表格属性
const TABLE_COLUMNS = [
  {
    label: '姓名',
    prop: 'userName',
    slot: true
  },
  {
    label: '手机号码',
    prop: 'phone'
  },
  {
    label: '所属部门',
    prop: 'dept',
    minWidth: 120,
    slot: true
  },
  //   {
  //     label: '结业状态',
  //     prop: 'endStatus',
  //     formatter: (row) => {
  //       const END_STATUS = {
  //         0: '未结业',
  //         1: '已结业'
  //       }
  //       return END_STATUS[row.endStatus]
  //     }
  //   },
  // （1：已评估；2：未评估；3：未开始）
  {
    label: '是否指定学员',
    prop: 'appointTrainee',
    formatter: (row) => {
      const END_STATUS = {
        0: '否',
        1: '是'
      }
      return END_STATUS[row.appointTrainee]
    }
  }
]

const TABLE_CONFIG = {
  rowKey: 'stuId',
  handlerColumn: {
    width: 200
  },
  enableMultiSelect: false,
  enablePagination: true,
  showHandler: true,
  showIndexColumn: false
}
// 搜索配置
const SEARCH_POPOVER_REQUIRE_OPTIONS = [
  {
    config: { placeholder: '请输入学员名称搜索' },
    data: '',
    field: 'username',
    label: '',
    type: 'input'
  }
]
const SEARCH_POPOVER_POPOVER_OPTIONS = [
  {
    // config: { placeholder: 'deptId' },
    data: '',
    field: 'orgId',
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
          value: 'orgId'
        }
      }
    }
  },
  {
    config: { placeholder: '请选择' },
    data: '',
    field: 'appointTrainee',
    label: '是否指定学员',
    type: 'select',
    options: [
      { value: 1, label: '是' },
      { value: 0, label: '否' }
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
      searchParams: {}
    }
  },
  created() {
    this.getInfo()
    this.loadOrgData()
  },
  methods: {
    toStuffDetail(row) {
      let data = { ...row }
      data.trainId = data.userId
      data.stuId = data.userId
      data.studyPlanId = this.$route.query.id
      data.name = data.userName
      data.deptName = data.dept

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
      this.page.pageNo = param
      this.getInfo()
    },
    handlePageSizeChange(param) {
      this.page.pageSize = param
      this.getInfo()
    },
    handleSearch(searchParams) {
      // this.loadTableData(_.pickBy(searchParams))
      this.searchParams = searchParams
      this.page.pageNo = 1
      this.getInfo(searchParams)
    },
    // 拿数据
    async getInfo() {
      let params = {
        ...this.page,
        ...this.searchParams,
        trainId: this.$route.query.id
      }
      let { data, totalNum } = await students(params)
      this.page.total = totalNum
      this.tableData = data
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

<style></style>
