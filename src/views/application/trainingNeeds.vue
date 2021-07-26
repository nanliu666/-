<template>
  <div class="outsideTraining">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/" style="padding: 25px 0 20px">
      <el-breadcrumb-item to="/approvalCenter/approveIndex">业务申请</el-breadcrumb-item>
      <el-breadcrumb-item>培训需求申请</el-breadcrumb-item>
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
    <appr-submit ref="apprSubmit" category-id="3" @submit="handleSubmit" />
  </div>
</template>

<script>
import { getuserInfo } from '@/api/my'
import { categoryMap, toApproveIndex } from '@/const/approve'
import ApprSubmit from '@/components/appr-submit/ApprSubmit'
import { applyAddTrainingNeeds } from '@/api/apply'
export default {
  name: 'TrainingNeeds',
  components: {
    CommonForm: () => import('@/components/common-form/CommonForm'),
    ApprSubmit
  },
  data() {
    return {
      formKey: 'applyTrainingNeeds',
      personInfor: {}, //个人信息
      toApproveIndex,
      formData: {
        trainWay: '',
        trainRes: '',
        trainTarget: ''
      },
      columns: [
        {
          prop: 'trainWay',
          itemType: 'treeSelect',
          label: '培训方式',
          span: 10,
          required: true,
          props: {
            selectParams: {
              placeholder: '请选择',
              multiple: false
            },
            treeParams: {
              data: [
                { name: '在线培训', id: '1' },
                { name: '面授培训', id: '2' },
                { name: '混合培训', id: '3' }
                // {1：在线培训；2：面授培训；3：混合培训}
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
          prop: 'trainRes',
          itemType: 'treeSelect',
          label: '培训资源',
          span: 10,
          offset: 4,
          required: true,
          props: {
            selectParams: {
              placeholder: '请选择',
              multiple: false
            },
            treeParams: {
              data: [
                { name: '内部培训', id: '1' },
                { name: '外购培训', id: '2' },
                { name: '外派培训', id: '3' }
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
          prop: 'trainTarget',
          itemType: 'input',
          placeholder: '明确授课后授课对象需要达到的具体行为表现。',
          required: true,
          label: '培训目的',
          span: 24,
          rows: 6,
          maxlength: 1000,
          showWordLimit:true,
          type: 'textarea'
        }
      ]
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
        trainWay: '',
        trainRes: '',
        trainTarget: ''
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
            applyAddTrainingNeeds(sendData).then((res) => {
              // 如果没有任何审批流程可选则不需要经过审批
              if (process) {
                // 状态设置为审批中
                this.submitApprApply(res.id)
              } else {
                //提交成功，跳转到成功页面
                this.$router.push({
                  path: '/approvalCenter/submitSucceed',
                  query: { id: '', formKey: this.formKey }
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
          processName: categoryMap['3'],
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
