<template>
  <div v-loading="loading" class="outsideTraining">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/" style="padding: 25px 0 20px">
      <el-breadcrumb-item>业务申请</el-breadcrumb-item>
      <el-breadcrumb-item>培训请假申请</el-breadcrumb-item>
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
            <common-form ref="formRef" :model="formData" :columns="columns"> </common-form>
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
    <appr-submit ref="apprSubmit" category-id="4" @submit="handleSubmit" />
  </div>
</template>

<script>
import { getuserInfo } from '@/api/my'
import { categoryMap, toApproveIndex } from '@/const/approve'
import ApprSubmit from '@/components/appr-submit/ApprSubmit'
import { applyTrainLeave, trainOptionList } from '@/api/apply'
export default {
  name: 'ApplyLeave',
  components: {
    CommonForm: () => import('@/components/common-form/CommonForm'),
    ApprSubmit
  },
  // computed:{
  //   trainId(){
  //     return this.$router.query.trainId
  //   }
  // },
  data() {
    return {
      formKey: 'trainLeaveApply',
      loading: false,
      personInfor: {}, //个人信息
      toApproveIndex,
      trainOptionList: [], // 个人培训列表查询
      formData: {
        trainId: '',
        trainOfflineId: [],
        remark: ''
      },
      columns: [
        {
          itemType: 'select',
          prop: 'trainId',
          label: '培训',
          offset: 0,
          span: 10,
          required: true,
          filterable: true,
          multiple: false,
          props: {
            label: 'trainName',
            value: 'trainId'
          },
          options: []
        },
        {
          itemType: 'select',
          prop: 'trainOfflineId',
          label: '培训日程',
          offset: 4,
          span: 10,
          required: true,
          multiple: true,
          props: {
            label: 'offlineName',
            disabled: 'isApplied',
            value: 'trainOfflineId'
          },
          options: []
        },
        {
          prop: 'remark',
          itemType: 'input',
          required: true,
          label: '请假说明',
          span: 24,
          rows: 6,
          type: 'textarea'
        }
      ],
      pojectTemp: {}
    }
  },
  watch: {
    // trainId(val){
    //   this.formData.trainId=val
    // },
    'formData.trainId'(val) {
      if (val) {
        this.formData.trainOfflineId = []
        let arrs = this.trainOptionList.find((item) => item.trainId === val)
        this.columns.find((item) => item.prop === 'trainOfflineId').options = arrs.options
        this.$nextTick(()=>{
          if(this.$route.query.trainOfflineId){
            this.formData.trainOfflineId.push(this.$route.query.trainOfflineId)
            console.log('this.formData.trainOfflineId',this.formData.trainOfflineId)
          }          
        })
      }
    }
  },
  deactivated() {
    this.clearData() // 清楚缓存数据
  },
  created() {
    this.initPersonInfor()
    this.trainOptionListFn()
  },
  methods: {
    async trainOptionListFn() {
      //培训申请下拉选项框列表查询
      let res = await trainOptionList()
      this.trainOptionList = res
      this.columns.find((item) => item.prop === 'trainId').options = res
      this.$nextTick(() => {
        if (this.$route.query.trainId) {
          this.formData.trainId = this.$route.query.trainId
        }
      })
    },
    clearData() {
      // 清楚缓存数据
      this.$nextTick(() => {
        this.$refs.formRef.resetFields()
        // this.$refs.formRef.clearValidate()
      })
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
          sendData.trainOfflineId = sendData.trainOfflineId.join(',')
          // validate方法返回Promise,校验是否可发起，如果可发起Promise直接resolve
          this.$refs.apprSubmit.validate().then((process) => {
            applyTrainLeave(sendData).then((res) => {
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
          processName: categoryMap['4'],
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

<style scoped>
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
</style>
