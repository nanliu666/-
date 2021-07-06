<template>
  <div class="Agreement">
    <ul class="top_title">
      <li>
        <div class="title">培训项目</div>
        <div class="text">{{ resData.trainName || '--' }}</div>
      </li>
      <li>
        <div class="title">人均费用</div>
        <div class="text">{{ resData.costBudgetAvg || '--' }}</div>
      </li>
      <li>
        <div class="title">服务年限</div>
        <div class="text">{{ resData.serviceYear || '--' }}</div>
      </li>
      <li>
        <div class="title">协议日期</div>
        <div class="text">{{ getHMS(resData.agreementStartTime) }}</div>
      </li>
    </ul>
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

      <template slot="signDate" slot-scope="{ row }">
        {{ getHMS(row.signDate) }}
      </template>

      <template slot="agreementStartTime" slot-scope="{ row }">
        {{ getHMS(row.agreementStartTime) }}
      </template>

      <template slot="breakDate" slot-scope="{ row }">
        {{ getHMS(row.breakDate) }}
      </template>

      <template slot="positionName" slot-scope="{ row }">
        {{ row.positionName || '--' }}
      </template>

      <template slot="breakAmount" slot-scope="{ row }">
        {{ row.breakAmount || '--' }}
      </template>

      <!-- 操作 -->
      <template slot="handler" slot-scope="{ row }">
        <!-- 如果有签订时间就显示违约，反之签订 -->

        <el-button v-if="!row.signDate" type="text" @click="operationBtn('Sign', row)">
          签订
        </el-button>

        <el-button v-else type="text" @click="operationBtn('Liquidated', row)"> 违约 </el-button>
      </template>
    </common-table>

    <!-- 弹框 -->
    <el-dialog
      :title="`${dialogVisibleBtn == 'Sign' ? '签订' : '违约'}`"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <div class="dialog_form_bxo">
        <ul>
          <li>
            <span class="title"> 姓名: </span>
            <span class="text"> {{ dialogData.name || '--' }} </span>
          </li>
          <li>
            <span class="title"> 所在部门： </span>
            <span class="text"> {{ dialogData.orgName || '--' }} </span>
          </li>
          <li>
            <span class="title"> 用户岗位： </span>
            <span class="text"> {{ dialogData.position || '--' }} </span>
          </li>
          <li>
            <span class="title"> 协议日期： </span>
            <span class="text"> {{ getHMS(dialogData.agreementStartTime) }} </span>
          </li>
        </ul>

        <el-form
          ref="ruleForm"
          :model="dialogForm"
          :rules="rules"
          label-width="100px"
          class="demo-ruleForm"
          label-position="top"
        >
          <el-form-item v-if="dialogVisibleBtn == 'Sign'" prop="signTime" label="签订日期" required>
            <el-date-picker
              v-model="dialogForm.signTime"
              type="date"
              placeholder="选择签订日期"
              style="width: 100%;"
              value-format="timestamp"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            v-if="dialogVisibleBtn == 'Liquidated'"
            prop="breakTime"
            label="违约日期"
            required
          >
            <el-date-picker
              v-model="dialogForm.breakTime"
              type="date"
              placeholder="选择违约日期"
              style="width: 100%;"
              value-format="timestamp"
            ></el-date-picker>
          </el-form-item>
          <el-form-item v-if="dialogVisibleBtn == 'Liquidated'" label="*违约金" prop="breakAmount">
            <el-input v-model="dialogForm.breakAmount" :maxlength="8"></el-input>
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogBtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import { studentList, grantCertificate, revokeCertificate } from '@/api/training/training'
// import { getOrgTreeSimple } from '@/api/org/org'
import {
  getTrainAgreementDetail,
  getOrgTreeSimple,
  queryStation,
  trainAgreementSign,
  trainAgreementBreak
} from '@/api/lecturerTask'
import searchPopOver from '@/components/searchPopOver'
// 表格属性
const TABLE_COLUMNS = [
  {
    label: '用户编号',
    prop: 'workNo',
    slot: true,
    width: 100
  },
  {
    label: '姓名',
    prop: 'name',
    slot: true
  },
  {
    label: '所在部门',
    prop: 'orgName',
    minWidth: 120,
    slot: true
  },
  {
    label: '用户岗位',
    prop: 'positionName',
    minWidth: 120,
    slot: true
  },
  {
    label: '签订日期',
    prop: 'signDate',
    minWidth: 120,
    slot: true
  },
  {
    label: '协议日期',
    prop: 'agreementStartTime',
    minWidth: 120,
    slot: true
  },
  {
    label: '违约日期',
    prop: 'breakDate',
    minWidth: 120,
    slot: true
  },
  {
    label: '违约金',
    prop: 'breakAmount',
    minWidth: 120,
    slot: true
  }
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
]

const TABLE_CONFIG = {
  rowKey: 'id',
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
    field: 'stuName',
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
    // config: { placeholder: 'deptId' },
    data: '',
    field: 'position',
    label: '用户岗位', // 数据后面再换接口
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
          label: 'name',
          disabled: 'disabled',
          value: 'id'
        }
      }
    }
  },
  {
    config: { placeholder: '请选择' },
    data: '',
    field: 'onlineProgress',
    label: '签订状态',
    type: 'select',
    options: [
      { value: 1, label: '未签订' },
      { value: 2, label: '已签订' },
      { value: 3, label: '违约' }
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
      dialogVisible: false,
      dialogForm: { signTime: '', breakTime: '', breakAmount: '' },
      rules: {
        signTime: [
          { required: true, message: '请选择签订日期', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        breakTime: [{ required: true, message: '请选择违约日期', trigger: 'blur' }],
        breakAmount: [{ required: true, message: '请输入违约金', trigger: 'blur' }]
      },
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
      dialogVisibleBtn: '',
      resData: {},
      dialogData: {}
    }
  },
  created() {
    this.isGetTrainAgreementDetail()

    this.loadOrgData()
    this.loadOrgDataInfo()
  },

  methods: {
    //时间戳转时间  年/月/日 时:分:秒
    getHMS(value) {
      if (typeof value == 'undefined' || value == '') {
        return '--'
      } else {
        let date = new Date(parseInt(value))
        let y = date.getFullYear()
        let MM = date.getMonth() + 1
        MM = MM < 10 ? '0' + MM : MM
        let d = date.getDate()
        d = d < 10 ? '0' + d : d
        let h = date.getHours()
        h = h < 10 ? '0' + h : h
        let m = date.getMinutes()
        m = m < 10 ? '0' + m : m
        let s = date.getSeconds()
        s = s < 10 ? '0' + s : s
        return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s
      }
    },

    operationBtn(i, row) {
      this.dialogData = row
      this.dialogVisible = true
      this.dialogVisibleBtn = i
    },
    dialogBtn() {
      // this.dialogVisibleBtn =='Sign'  //签订
      // this.dialogVisibleBtn == 'Liquidated'  // 违约

      let params = {
        ...this.dialogForm,
        ids: this.dialogData.id
      }
      console.log(params)
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if (this.dialogVisibleBtn == 'Sign') {
            //签订
            // eslint-disable-next-line no-unused-vars
            trainAgreementSign(params).then((res) => {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.dialogVisible = false
              this.isGetTrainAgreementDetail()
              this.$refs['ruleForm'].resetFields()
            })
          } else {
            // 违约
            // eslint-disable-next-line no-unused-vars
            trainAgreementBreak(params).then((res) => {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.dialogVisible = false
              this.isGetTrainAgreementDetail()
              this.$refs['ruleForm'].resetFields()
            })
          }
        }
      })
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        // eslint-disable-next-line no-unused-vars
        .then((_) => {
          done()
        })
        // eslint-disable-next-line no-unused-vars
        .catch((_) => {})
    },
    toStuffDetail() {},
    //  处理页码改变
    handleCurrentPageChange(param) {
      this.page.pageNo = param
      this.isGetTrainAgreementDetail()
    },
    handlePageSizeChange(param) {
      this.page.pageSize = param
      this.isGetTrainAgreementDetail()
    },
    handleSearch(searchParams) {
      this.searchParams = searchParams
      this.page.pageNo = 1
      this.isGetTrainAgreementDetail()
    },

    async isGetTrainAgreementDetail() {
      let params = {
        ...this.page,
        ...this.searchParams,
        id: this.$route.query.id
      }
      let res = await getTrainAgreementDetail(params)
      this.resData = res
      this.tableData = res.page.records
      this.page.total = res.page.total
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
    },
    loadOrgDataInfo() {
      queryStation({ parentOrgId: 0 }).then(
        (res) =>
          (this.searchPopoverConfig.popoverOptions[1].config.treeParams.data = _.concat(
            [
              {
                name: '全部',
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
.Agreement {
  .top_title {
    display: flex;
    margin: 20px 0;
    li {
      width: 25%;
      font-size: 14px;

      .title {
        color: #666;
      }
      .text {
        color: #333;
      }
    }
  }
  .dialog_form_bxo {
    padding: 0 20px;
    ul {
      color: #333;
      li {
        margin-top: 10px;
        .title {
          display: inline-block;
          width: 70px;
          color: #999;
        }
      }
    }
    .demo-ruleForm {
      margin-top: 30px;
    }
  }
}
</style>
