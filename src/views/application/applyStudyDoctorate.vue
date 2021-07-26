<template>
  <div class="outsideTraining">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/" style="padding: 25px 0 20px">
      <el-breadcrumb-item to="/approvalCenter/approveIndex">业务申请</el-breadcrumb-item>
      <el-breadcrumb-item>在职读博申请</el-breadcrumb-item>
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
            <common-form ref="formRef" :model="formData" :columns="columns"><template slot="budget">
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
    <appr-submit ref="apprSubmit" category-id="6" @submit="handleSubmit" />
  </div>
</template>

<script>
import { getuserInfo } from '@/api/my'
import { categoryMap, toApproveIndex } from '@/const/approve'
import ApprSubmit from '@/components/appr-submit/ApprSubmit'
import { doctorStudyApply } from '@/api/apply'
export default {
  name: 'ApplyStudyDoctorate',
  components: {
    CommonForm: () => import('@/components/common-form/CommonForm'),
    ApprSubmit
  },
  data() {
    return {
      formKey: 'applyDoctorStudy',
      loading: false,
      personInfor: {}, //个人信息
      toApproveIndex,
      formData: {
        studyStartTime: '',
        studyEndTime: '',
        schoolApply: '',
        majorApply: '',
        qualification: '',
        major: '',
        studyType: '',
        graduateSchool: '',
        budget: '',
        certificateTypeFuture: '',
        projectName: '',
        xgWorkYear: '',
        userId: ''
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
          prop: 'xgWorkYear',
          itemType: 'inputNumber',
          label: '徐工工龄',
          min: 0,
          span: 10,
          offset: 4,
          precision: 1,
          maxlength: 32,
          required: true
        },
        {
          prop: 'graduateSchool',
          itemType: 'input',
          label: '毕业学校',
          offset: 0,
          span: 10,
          required: true
        },
        {
          prop: 'major',
          itemType: 'input',
          label: '专业',
          offset: 4,
          span: 10,
          required: true
        },
        {
          prop: 'qualification',
          itemType: 'treeSelect',
          label: '学历/学位',
          span: 10,
          offset: 0,
          required: true,
          props: {
            selectParams: {
              placeholder: '请选择',
              multiple: false
            },
            treeParams: {
              data: [
                { id: '1', name: '初中及以下' },
                { id: '2', name: '中专/中技' },
                { id: '3', name: '高中' },
                { id: '4', name: '大专' },
                { id: '5', name: '本科' },
                { id: '6', name: '硕士' },
                { id: '7', name: '博士' }
              ],
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
          prop: 'schoolApply',
          itemType: 'input',
          label: '申请学校及院系',
          offset: 4,
          span: 10,
          required: true
        },
        {
          prop: 'majorApply',
          itemType: 'input',
          label: '申请专业及研究方向',
          offset: 0,
          span: 10,
          required: true
        },
        {
          prop: 'studyType',
          itemType: 'input',
          label: '读博形式',
          offset: 4,
          span: 10,
          required: true
        },
        {
          prop: 'certificateTypeFuture',
          itemType: 'input',
          label: '拟取得证书类型',
          offset: 0,
          span: 10,
          required: true
        },
        {
          prop: 'budget',
          itemType: 'slot',
          label: '预计读博费用',
          min: 0,
          span: 10,
          offset: 4,
          precision: 2,
          maxlength: 32,
          required: true
        },
        {
          prop: 'studyTime',
          itemType: 'datePicker',
          label: '读博时间',
          span: 10,
          type: 'datetimerange',
          required: true,
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          pickerOptions: {}
        }
      ]
    }
  },
  watch: {
    'formData.studyTime'(val) {
      this.formData.studyStartTime = val[0]
      this.formData.studyEndTime = val[1]
    }
  },
  activated() {
    this.clearData() // 清楚缓存数据
  },
  created() {
    this.initPersonInfor()
  },
  methods: {
    clearData() {
      // 清楚缓存数据
      this.formData = {
        studyStartTime: '',
        studyEndTime: '',
        schoolApply: '',
        majorApply: '',
        qualification: '',
        major: '',
        studyType: '',
        graduateSchool: '',
        budget: '',
        certificateTypeFuture: '',
        projectName: '',
        xgWorkYear: '',
        userId: ''
      }
    },
    async initPersonInfor() {
      // 查询个人信息
      this.personInfor = await getuserInfo()
      let year = new Date()
      year.getFullYear()
      this.formData.xgWorkYear =this.personInfor.entryDate?
        year.getFullYear() - Number(this.personInfor.entryDate.substr(0, 4)):''
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
            doctorStudyApply(sendData).then((res) => {
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
          processName: categoryMap['6'],
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
