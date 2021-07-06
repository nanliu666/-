<template>
  <div class="EvaluationApprentices">
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
          v-p="DELETE_COURSE"
          style="margin-bottom: 0"
          type="text"
          @click="() => handleRemoveItems(selection)"
        >
          批量出师
        </el-button>
      </template>

      <!-- <template slot="progress" slot-scope="{ row }">
        <el-progress :percentage="row.progress"></el-progress>
      </template> -->
      <!-- 操作 -->
      <template slot="handler" slot-scope="scope">
        <el-button v-if="scope.row.operation == 1" type="text" @click="GraduationBtn(scope.row)">
          出师
        </el-button>
        <el-button v-else-if="scope.row.operation == 2" type="text" @click="evaluateBtn(scope.row)">
          评价
        </el-button>
        <el-button
          v-else-if="scope.row.operation == 4"
          type="text"
          @click="seeBtn(scope.row.cancelReason)"
        >
          查看
        </el-button>
        <el-button v-else-if="scope.row.operation == 3" type="text" @click="evaluateBtn(scope.row)">
          查看评价
        </el-button>
        <span v-else>--</span>
      </template>
    </common-table>
    <!-- dialog -->
    <el-dialog :visible.sync="dialogVisible" width="30%">
      <div slot="title" class="dialog_title">
        <span>评价徒弟 </span>
        <el-tooltip placement="top">
          <div slot="content">
            优秀：95-100分；良好：85-94分； <br />
            合格：75-84分；不合格：75分以下
          </div>
          <i class="el-icon-question"></i>
        </el-tooltip>
      </div>

      <div class="dialog_content">
        <el-form
          ref="dialogForm"
          label-position="top"
          :rules="rules"
          :model="formData"
          label-width="80px"
        >
          <el-form-item label="评分" prop="score">
            <el-input-number
              v-model="formData.score"
              placeholder="请输入徒弟评分，满分100分"
              :disabled="evaluateData == 3"
              style="width:100%;"
              controls-position="right"
              :min="0"
              :max="100"
            ></el-input-number>
          </el-form-item>

          <el-form-item label="评语" prop="comment">
            <el-input
              v-model="formData.comment"
              :disabled="evaluateData == 3"
              type="textarea"
              maxlength="200"
              show-word-limit
              placeholder="请输入评语，总结徒弟的优势与不足。"
              rows="5"
            ></el-input>
          </el-form-item>
        </el-form>

        <div v-show="evaluateData != 3" slot="footer" class="dialog-footer">
          <div class="dialog-btn">
            <el-button @click="cancelBtn">取 消</el-button>
            <el-button type="primary" @click="determineBtn">确 定</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { studentList, grantCertificate, revokeCertificate } from '@/api/training/training'
import { studentList, tutorDetail, updateStatus, evaluateStudent } from '@/api/personal'
import searchPopOver from '@/components/searchPopOver'
import { queryStation, getOrgTreeSimple } from '@/api/lecturerTask'

import { mapGetters } from 'vuex'
// 表格属性
const TABLE_COLUMNS = [
  {
    label: '姓名',
    prop: 'studentName',
    slot: true,
    width: 150
  },
  {
    label: '所属部门',
    prop: 'orgName',
    width: 200
  },
  {
    label: '岗位',
    prop: 'positionName'
  },
  {
    label: '性别',
    prop: 'sex',
    formatter: (row) => {
      const END_STATUS = {
        0: '男',
        1: '女'
      }
      return END_STATUS[row.sex]
    }
  },
  {
    label: '是否出师',
    prop: 'completeStatus', // 线上课程通过状态Yes/No
    formatter: (row) => {
      const END_STATUS = {
        0: '否',
        1: '是'
      }
      return END_STATUS[row.completeStatus]
    }
  },
  {
    label: '评定等级',
    prop: 'level',
    formatter: (row) => {
      const END_STATUS = {
        1: '优秀',
        2: '良好',
        3: '合格',
        4: '不合格'
      }
      return END_STATUS[row.level]
    }
  },
  {
    label: '得分',
    prop: 'score',
    slot: true
  },
  {
    label: '协议期',
    prop: 'agreementStartTime',
    formatter: (row) => {
      return row.agreementStartTime + '~' + row.agreementEndTime
    },
    width: 300
  },

  {
    label: '手机号',
    prop: 'phonenum',
    width: 150
  }
]

const TABLE_CONFIG = {
  rowKey: 'stuId',
  handlerColumn: {
    width: 120
  },
  enableMultiSelect: false,
  enablePagination: true,
  showHandler: true,
  showIndexColumn: false
}
// 搜索配置
const SEARCH_POPOVER_REQUIRE_OPTIONS = [
  {
    config: { placeholder: '输入徒弟姓名/手机号搜索' },
    data: '',
    field: 'queryCondition',
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
    field: 'positionId',
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
    field: 'level',
    label: '等级',
    type: 'select',
    options: [
      { value: '', label: '全部' },
      { value: 1, label: '优秀' },
      { value: 2, label: '良好' },
      { value: 3, label: '合格' },
      { value: 4, label: '不合格' }
    ]
  },
  {
    config: { placeholder: '请选择' },
    data: '',
    field: 'completeStatus',
    label: '是否出师',
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
      queryParams: {},
      dialogVisible: false,
      formData: {
        comment: '',
        score: undefined
      },
      rules: {
        score: [{ required: true, message: '请输入评分', trigger: 'blur' }],
        comment: [{ required: true, message: '请输入评语', trigger: 'blur' }]
      },
      detailData: {},
      evaluateData: ''
    }
  },
  computed: {
    ...mapGetters(['orgIds'])
  },
  created() {
    // this.isStudentList()
    this.loadOrgData()
    this.loadOrgDataInfo()
    this.istutorDetail()
  },
  methods: {
    //   确定
    determineBtn() {
      this.$refs['dialogForm'].validate((valid) => {
        if (valid) {
          let params = {
            ...this.formData
          }
          evaluateStudent(params).then(() => {
            this.$message({
              message: '评价成功！',
              type: 'success'
            })
            this.dialogVisible = false
            this.isstudentList()
          })
        } else {
          this.$message.error('请填写完整！')
          return false
        }
      })
    },
    // 取消
    cancelBtn() {
      this.$refs['dialogForm'].resetFields()
      this.dialogVisible = false
    },
    evaluateBtn(row) {
      let { comment, score, operation, strId } = row
      this.formData.comment = comment
      this.formData.score = score
      this.formData.id = strId
      this.evaluateData = operation
      this.dialogVisible = true
    },
    // 查看
    seeBtn(i) {
      this.$alert(`<p>解约原因：</p> <br/>${i}`, '查看', {
        showConfirmButton: false,
        dangerouslyUseHTMLString: true
      })
    },

    GraduationBtn(row) {
      this.$confirm('确定该徒弟可以出师吗？', '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            ids: row.strId,
            completeStatus: 1
          }
          updateStatus(params).then(() => {
            this.isstudentList()

            this.$message({
              type: 'success',
              message: '操作成功!'
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
    },
    handleRemoveItems() {
      this.$confirm('确定所选徒弟可以出师吗？', '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
    },
    //  处理页码改变
    handleCurrentPageChange(param) {
      this.page.pageNo = param
      this.isstudentList()
    },
    handlePageSizeChange(param) {
      this.page.pageSize = param
      this.isstudentList()
    },
    handleSearch(searchParams) {
      // this.loadTableData(_.pickBy(searchParams))
      this.page.pageNo = 1
      this.queryParams = searchParams
      this.isstudentList()
    },

    istutorDetail() {
      tutorDetail({ platFlag: 1 }).then((res) => {
        this.detailData = res
        this.isstudentList()
      })
    },

    // 拿数据
    async isstudentList() {
      if (this.detailData.idStr) {
        let params = {
          ...this.page,
          ...this.queryParams,
          id: this.detailData.idStr
        }
        let { data, totalNum } = await studentList(params)
        this.page.total = totalNum
        this.tableData = data
      }
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

<style lang="scss" scoped>
.EvaluationApprentices {
  width: 843px;
  .dialog_content {
    border-top: 1px solid #ccc;
    margin: -20px;
    padding: 10px 40px;
    .dialog-btn {
      text-align: right;
    }
    /deep/ .el-input__inner {
      text-align: left;
    }
  }
}
/deep/.cell:empty::before {
  content: '--';
  color: gray;
}
</style>
