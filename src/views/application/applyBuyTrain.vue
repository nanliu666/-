<template>
  <div class="outsideTraining">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/" style="padding: 25px 0 20px">
      <el-breadcrumb-item to="/approvalCenter/approveIndex">业务申请</el-breadcrumb-item>
      <el-breadcrumb-item>外购培训申请</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主体内容 -->
    <div class="form-card">
      <el-card>
        <div class="container">
          <!-- 申请人信息 -->
          <div class="applicant-information">
            <div class="title">申请人信息</div>
            <el-row>
              <el-col :span="8"><span class="name">姓名：</span>{{ personInfor.name }}</el-col>
              <el-col :span="8"><span class="name">性别：</span>{{ personInfor.sex === 1 ? '男' : '女' }}</el-col>
              <el-col :span="8"><span class="name">出生年月：</span>{{ personInfor.birthDate }}</el-col>
              <el-col :span="8"><span class="name">所属部门：</span>{{ personInfor.orgName }}</el-col>
              <el-col :span="8"><span class="name">工作岗位：</span>{{ personInfor.position }}</el-col>
              <el-col :span="8"><span class="name">职业资格/职称：</span>{{ personInfor.positionTitle }}</el-col>
            </el-row>
          </div>
          <!-- 申请信息 -->
          <div class="application-information">
            <div class="title">申请信息</div>
            <!-- 表单信息 -->
            <common-form ref="formRef" :model="formData" :columns="columns">
              <template slot="budget">
                <el-input-number
                  v-model="formData.budget"
                  style="width: 100%"
                  controls-position="right"
                  placeholder="请输入金额"
                  :precision="2"
                  :min="0"
                  :max="9999999999.99"
                />
                <a class="inputNumber-icon">￥</a>
              </template>
              <template slot="internalization">
                <el-radio-group v-model="formData.internalization">
                <el-radio :label="1">课程开发</el-radio>
                <el-radio :label="2">经验交流</el-radio>
                <el-radio :label="3">其他形式</el-radio>
              </el-radio-group>
              <el-input v-if="formData.internalization===3" max="100" v-model="formData.internalizationContent" placeholder="请输入内容"></el-input>
              </template>
              </common-form>
          </div>
          <!-- 提交按钮 -->
          <div class="submit-btn">
            <el-button type="primary" size="medium" @click="submitFn">提交申请</el-button>
            <el-button style="margin-left: 10px" size="medium" @click="toApproveIndex">取消</el-button>
          </div>
        </div>
      </el-card>
    </div>
    <!-- 审批发起组件 -->
    <appr-submit
      ref="apprSubmit"
      category-id="10"
      :budget="formData.budget"
      @submit="handleSubmit"
    />
  </div>
</template>

<script>
import { getuserInfo } from '@/api/my'
import { categoryMap, toApproveIndex } from '@/const/approve'
import ApprSubmit from '@/components/appr-submit/ApprSubmit'
import { trainingOuterBuy, queryUserList } from '@/api/apply'
export default {
  name: 'ApplyBuyTrain',
  components: {
    CommonForm: () => import('@/components/common-form/CommonForm'),
    ApprSubmit
  },
  data() {
    return {
      formKey: 'applyTrainingOuterBuy',
      loading: false,
      personInfor: {}, //个人信息
      toApproveIndex,
      formData: {
        trainConent: '',
        joinNum: '',
        internalization: '',
        internalizationContent:'',
        projectName: '',
        introduce: '',
        trainTime: [],
        trainStartTime: '',
        trainEndTime: '',
        trainTarget: '',
        budget: '',
        lessonPeriod: '',
        pm: '',
        contactInfo: '',
        applyUnit: '',
        trainObject: '',
        address: ''
      },
      columns: [
        {
          prop: 'projectName',
          itemType: 'input',
          label: '项目名称',
          offset: 0,
          span: 10,
          required: true
        },
        {
          prop: 'applyUnit',
          itemType: 'input',
          label: '申请单位',
          offset: 4,
          span: 10,
          required: true
        },
        {
          prop: 'trainObject',
          itemType: 'input',
          label: '培训对象',
          offset: 0,
          span: 10,
          required: true
        },
        {
          prop: 'joinNum',
          itemType: 'inputNumber',
          label: '计划人数',
          min: 0,
          offset: 4,
          span: 10,
          precision: 0,
          maxlength: 32,
          required: true
        },
        {
          prop: 'trainTime',
          itemType: 'datePicker',
          label: '培训时间',
          span: 10,
          type: 'datetimerange',
          required: true,
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          pickerOptions: {
            // disabledDate(time) {
            //   return moment(new Date()).isAfter(time, 'day')
            // }
          }
        },
        {
          prop: 'address',
          itemType: 'input',
          label: '培训地点',
          offset: 4,
          span: 10,
          required: true
        },
        {
          prop: 'lessonPeriod',
          itemType: 'inputNumber',
          label: '总课时',
          offset: 0,
          min: 0,
          precision: 1,
          maxlength: 32,
          span: 10,
          required: true
        },
        {
          prop: 'budget',
          itemType: 'slot',
          label: '费用预算',
          min: 0,
          offset: 4,
          span: 10,
          precision: 2,
          maxlength: 32,
          required: true
        },
        {
          prop: 'pm',
          itemType: 'select',
          label: '项目经理',
          offset: 0,
          span: 10,
          required: false,
          filterable: true,
          remote: true,
          multiple: false,
          remoteMethod: this.getUserFn,
          props: {
            label: 'name',
            value: 'userId'
          },
          options: []
        },
        {
          prop: 'contactInfo',
          itemType: 'input',
          label: '联系方式',
          offset: 4,
          span: 10,
          required: false,
          rules: [{ pattern: /^[0-9]{11}$/, message: '长度必须为11位数字', trigger: 'blur' }]
        },
        {
          prop: 'internalization',
          itemType: 'slot',
          label: '内化形式',
          offset: 0,
          required: true,
          span: 24,
        },
        {
          prop: 'trainTarget',
          itemType: 'input',
          required: true,
          label: '培训目标',
          span: 24,
          maxlength: 1000,
          showWordLimit:true,
          rows: 6,
          type: 'textarea'
        },
        {
          prop: 'trainConent',
          itemType: 'input',
          required: true,
          label: '培训内容',
          span: 24,
          maxlength: 1000,
          showWordLimit:true,
          rows: 6,
          type: 'textarea'
        },
        {
          prop: 'introduce',
          itemType: 'input',
          required: true,
          label: '讲师/机构介绍',
          span: 24,
          maxlength: 1000,
          showWordLimit:true,
          rows: 6,
          type: 'textarea'
        }
      ]
    }
  },
  watch: {
    'formData.trainTime'(val) {
      if (val) {
        this.formData.trainStartTime = val[0]
        this.formData.trainEndTime = val[1]
      }
    }
  },
  activated() {
    this.clearData() // 清楚缓存数据
  },
  created() {
    this.initPersonInfor()
    this.getUserFn()
  },
  methods: {
    getUserFn(val) {
      //查询人员
      // 搜索请求
      let params = {
        pageNo: 1,
        pageSize: 900,
        search: val
      }
      queryUserList(params).then((res) => {
        this.columns.find((item) => item.prop === 'pm').options = res.data
      })
    },
    clearData() {
      // 清楚缓存数据
      this.formData = {
        trainConent: '',
        joinNum: '',
        internalization: '',
        projectName: '',
        introduce: '',
        trainStartTime: '',
        trainEndTime: '',
        trainTarget: '',
        budget: '',
        lessonPeriod: '',
        pm: '',
        contactInfo: '',
        applyUnit: '',
        trainObject: '',
        address: ''
      }
    },
    async initPersonInfor() {
      // 查询个人信息
      this.personInfor = await getuserInfo()
    },
    // 审批发起组件的弹窗确认回调
    handleSubmit() {
      this.submitFn()
    },
    submitFn() {
      // 提交申请表
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          let sendData = {}
          sendData = { ...this.formData }
          // validate方法返回Promise,校验是否可发起，如果可发起Promise直接resolve
          this.$refs.apprSubmit.validate().then((process) => {
            trainingOuterBuy(sendData).then((res) => {
              // 如果没有任何审批流程可选则不需要经过审批
              if (process) {
                // 状态设置为审批中
                this.submitApprApply(res.id)
              } else {
                //提交成功，跳转到成功页面
                this.$router.push({
                  path: '/approvalCenter/submitSucceed',
                  query: { id: '', key: this.formKey }
                })
              }
              console.log(res)
            })
          })
        }
      })
    },
    // 提交课程审批
    submitApprApply(applyId) {
      //申请表   给formData 添加id,catalogName字段
      this.formData.id = applyId
      // this.formData.catalogName = this.parentOrgIdLabel
      this.$refs.apprSubmit
        .submit({
          formId: applyId,
          processName: categoryMap['10'],
          formKey: this.formKey,
          formTitle: this.formData.name,
          formData: JSON.stringify(this.formData)
        })
        .then((res) => {
          this.disabledBtn = false
          //提交成功，跳转到成功页面
          this.$router.push({
            path: '/approvalCenter/submitSucceed',
            query: { id: res.apprNo, key: this.formKey }
          })
          //发布成功清除数据
          //this.isdeleteData()
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.outsideTraining .container {
  padding: 30px 65px 0;
}
.outsideTraining .applicant-information {
  padding: 0 0 33px 0;
}
.outsideTraining .title {
  color: #000b15;
  opacity: 0.85;
  font-size: 16px;
  font-weight: bold;
  padding-bottom: 18px;
}
.outsideTraining .applicant-information .name {
  color: #000b15;
  opacity: 0.45;
}

.outsideTraining .applicant-information /deep/ .el-col {
  margin-bottom: 9px;
}
.outsideTraining .application-information {
  padding: 0 0 33px 0;
}

.outsideTraining .application-information /deep/ .el-form-item {
  margin-bottom: 7px;
}
.submit-btn .el-button--primary {
  background-color: #2875d4;
  border-color: #2875d4;
}
/deep/ .el-input-number.is-controls-right .el-input__inner {
  padding-left: 20px;
  text-align: left;
}
.inputNumber-icon {
  position: absolute;
  top: 0;
  left: 5px;
}
</style>
