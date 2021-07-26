<template>
  <div class="outsideTraining">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/" style="padding: 25px 0 20px">
      <el-breadcrumb-item to="/approvalCenter/approveIndex">业务申请</el-breadcrumb-item>
      <el-breadcrumb-item>外派培训申请</el-breadcrumb-item>
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
              <template slot="trainResult">
                <el-radio-group v-model="formData.trainResult">
                <el-radio :label="1">课程开发</el-radio>
                <el-radio :label="2">经验交流</el-radio>
                <el-radio :label="3">课程攻关</el-radio>
                <el-radio :label="4">其他形式</el-radio>
              </el-radio-group>
              <el-input v-if="formData.trainResult===4" max="100" v-model="formData.trainResultContent" placeholder="请输入内容"></el-input>
              </template>
            </common-form>
          </div>
          <div class="members">
            <el-form ref="formTableRef" :model="formTableData">
              <el-table
                :data="formTableData.memberdata"
                style="width: 100%"
                row-key="id"
                max-height="400"
              >
                <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
                <el-table-column prop="name" label="年龄" width="180">
                  <template slot-scope="scope">
                    {{ getAges(scope.row.birthDate) }}
                  </template>
                </el-table-column>
                <el-table-column prop="orgName" label="所属部门"> </el-table-column>
                <el-table-column prop="positionName" label="岗位名称"> </el-table-column>
                <el-table-column label="工作时间（年）" width="180">
                  <template slot-scope="scope">
                    <el-input-number
                      v-model="scope.row.workYear"
                      size="small"
                      :precision="0"
                      :min="1"
                      :max="1000000000000000000000000000"
                    ></el-input-number>
                    <!-- <el-input v-model="scope.row.workYear" placeholder=""></el-input> -->
                  </template>
                </el-table-column>
                <el-table-column label="外派理由">
                  <template slot="header">
                    <span class="newRquied"><span style="color:#f00">*</span>外派理由</span>
                  </template>
                  <template slot-scope="scope">
                    <el-form-item
                      :prop="'memberdata.' + scope.$index + '.remark'"
                      :rules="rules.remark"
                    >
                      <el-input v-model="scope.row.remark" size="small" placeholder=""></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <span
                      style="color: #2875d4; cursor: pointer"
                      @click="memberDelete(scope.$index, scope.row)"
                    >删除</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-form>
            <div class="addMember" @click="addMemberFn">
              <span class="iconimage_icon_plus-outlined iconfont"></span>
              <span class="addMember2">添加成员</span>
            </div>
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
    <appr-submit ref="apprSubmit" category-id="5" @submit="handleSubmit" />
    <!-- 选人 -->
    <CommonPicker
      v-model="formTableData.memberdata"
      :visible.sync="userPickerVisible"
      :options="personPickerOptions.options"
      :props="personPickerOptions.props"
      :selected-style="personPickerOptions.selectedStyle"
    ></CommonPicker>
  </div>
</template>

<script>
import { validateForms } from '@/util/validate'
import { personPickerOptions } from './commonPickerConfig'
import CommonPicker from '@/components/common-picker'
import moment from 'moment'
import { getuserInfo } from '@/api/my'
import { categoryMap, toApproveIndex } from '@/const/approve'
import ApprSubmit from '@/components/appr-submit/ApprSubmit'
import { trainingOuter } from '@/api/apply'
export default {
  name: 'ApplyOutsideTrainBookbuilding',
  components: {
    CommonForm: () => import('@/components/common-form/CommonForm'),
    ApprSubmit,
    CommonPicker
  },
  data() {
    return {
      formKey: 'applyTrainingOuters',
      loading: false,
      personInfor: {}, //个人信息
      toApproveIndex,
      userPickerVisible: false,
      i: 1,
      formTableData: {
        memberdata: []
      },
      rules: {
        remark: [{ required: true, message: '*必填', trigger: 'blur' }]
      },
      personPickerOptions,
      formData: {
        address: '',
        trainTarget: '',
        trainResultContent:'',
        introduce: '',
        trainTime: [],
        trainStartTime: '',
        budget: '',
        trainContent: '',
        applyUnit: '',
        projectName: '',
        trainResult: '',
        trainOuterSendJoins: [],
        trainEndTime: ''
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
          prop: 'trainTime',
          itemType: 'datePicker',
          span: 10,
          type: 'datetimerange',
          required: true,
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          pickerOptions: {},
          label: '培训时间'
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
          prop: 'budget',
          itemType: 'slot',
          label: '费用预算',
          min: 0,
          span: 10,
          precision: 2,
          maxlength: 32,
          required: true
        },
        {
          prop: 'trainResult',
          itemType: 'slot',
          label: '研修成果',
          offset: 0,
          required: true,
          span: 24,
        },
        // {
        //   prop: 'trainResult',
        //   hide: true,
        //   itemType: 'radio',
        //   label: '研修成果',
        //   offset: 0,
        //   required: true,
        //   span: 24,
        //   type: 'radio',
        //   options: [
        //     {
        //       label: '课程开发',
        //       value: 1
        //     },
        //     {
        //       label: '经验交流',
        //       value: 2
        //     },
        //     {
        //       label: '课程攻关',
        //       value: 3
        //     },
        //     {
        //       label: '其他形式',
        //       value: 4
        //     }
        //   ]
        // },
        {
          prop: 'trainTarget',
          itemType: 'input',
          required: true,
          label: '研修目的',
          span: 24,
          rows: 6,
          maxlength: 1000,
          showWordLimit:true,
          type: 'textarea'
        },
        {
          prop: 'trainContent',
          itemType: 'input',
          required: true,
          label: '研修内容',
          span: 24,
          rows: 6,
          maxlength: 1000,
          showWordLimit:true,
          type: 'textarea'
        },
        {
          prop: 'introduce',
          itemType: 'input',
          required: true,
          label: '讲师/机构介绍',
          span: 24,
          rows: 6,
          maxlength: 1000,
          showWordLimit:true,
          type: 'textarea'
        }
      ],
      pojectTemp: {}
    }
  },
  watch: {
    'formData.trainTime'(val) {
      this.formData.trainStartTime = val[0]
      this.formData.trainEndTime = val[1]
    }
  },
  activated() {
    this.clearData() // 清楚缓存数据
  },
  created() {
    this.initPersonInfor()
  },
  methods: {
    getAges(birth) {
      var age = birth ? moment().get('year') - Number(birth.substr(0, 4)) : ''
      return age
    },
    addMemberFn() {
      // 添加成员
      this.userPickerVisible = true
    },
    clearData() {
      // 清楚缓存数据
      this.formData = {
        address: '',
        trainTarget: '',
        introduce: '',
        trainTime: [],
        trainStartTime: '',
        budget: '',
        trainContent: '',
        applyUnit: '',
        projectName: '',
        trainResult: '',
        trainOuterSendJoins: [],
        trainEndTime: ''
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
      let formRefs = ['formRef', 'formTableRef'].map((key) => this.$refs[key])
      validateForms(formRefs)
        .then(() => {
          if (this.formTableData.memberdata.length == 0) {
            this.$message({
              message: '必须添加至少一个外派人员',
              type: 'warning'
            })
            return
          }
          let sendData = {}
          sendData = { ...this.formData }
          sendData.trainOuterSendJoins = this.formTableData.memberdata
          // validate方法返回Promise,校验是否可发起，如果可发起Promise直接resolve
          this.$refs.apprSubmit.validate().then((process) => {
            trainingOuter(sendData).then((res) => {
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
        })
        .catch((err) => {
          console.log(err)
        })
      // this.$refs.formRef.validate((valid) => {
      //   if (valid) {
      //     if(this.formTableData.memberdata.length == 0){
      //       this.$message({
      //         message: '必须添加至少一个外派人员',
      //         type: 'warning'
      //       })
      //       return
      //     }
      //     let sendData = {}
      //     sendData = { ...this.formData }
      //     sendData.trainOuterSendJoins = this.formTableData.memberdata
      //     // validate方法返回Promise,校验是否可发起，如果可发起Promise直接resolve
      //     this.$refs.apprSubmit.validate().then((process) => {
      //       trainingOuter(sendData).then((res) => {
      //         // 如果没有任何审批流程可选则不需要经过审批
      //         if (process) {
      //           // 状态设置为审批中
      //           this.submitApprApply(res.id)
      //         } else {
      //           //提交成功，跳转到成功页面
      //           this.$router.push({
      //             path: '/approvalCenter/submitSucceed',
      //             query: { id: '', key: this.formKey }
      //           })
      //         }
      //       })
      //     })

      //   }
      // })
    },
    // 提交课程审批
    submitApprApply(applyId) {
      //申请表   给formData 添加id,catalogName字段
      this.formData.id = applyId
      // this.formData.catalogName = this.parentOrgIdLabel
      this.$refs.apprSubmit
        .submit({
          formId: applyId,
          processName: categoryMap['5'],
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
    },
    memberDelete(index) {
      // 删除成员
      this.formTableData.memberdata.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.members /deep/ .el-form-item {
  margin-bottom: 0;
}
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
.addMember {
  border: 1px dashed #d9dbdc;
  text-align: center;
  padding: 7px 0;
  border-radius: 4px;
  margin: 15px 0 40px 0;
  cursor: pointer;
}
.addMember span {
  color: #2875d4;
}
.addMember .addMember2 {
  padding: 0 0 0 7px;
}
.members /deep/.el-form-item__error {
  top: 2px;
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
