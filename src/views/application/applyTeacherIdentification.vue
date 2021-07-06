<template>
  <div class="outsideTraining">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/" style="padding: 25px 0 20px">
      <el-breadcrumb-item>业务申请</el-breadcrumb-item>
      <el-breadcrumb-item>讲师认证申请</el-breadcrumb-item>
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
            <div class="title">个人信息</div>
            <!-- 表单信息 -->
            <common-form ref="formRef" :model="formData" :columns="columns"> </common-form>
          </div>
          <div class="content3">
            <div class="title">任职资格</div>
            <common-form ref="formRef2" :model="formData2" :columns="columns2"> </common-form>
            <h4>参与课程开发</h4>
            <el-table :data="courseData" style="width: 100%" max-height="400">
              <el-table-column label="序号" type="index" width="100"> </el-table-column>
              <el-table-column label="课程描述">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.courseName" placeholder=""></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="90">
                <template slot-scope="scope">
                  <span
                    style="color:#2875D4;cursor: pointer;"
                    @click="memberDelete(scope.$index, scope.row)"
                  >删除</span>
                </template>
              </el-table-column>
            </el-table>
            <div class="addMember" @click="addMemberFn">
              <span class="iconimage_icon_plus-outlined iconfont"></span>
              <span class="addMember2">添加课程</span>
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
    <appr-submit ref="apprSubmit" category-id="7" @submit="handleSubmit" />
  </div>
</template>

<script>
import { categoryMap, toApproveIndex } from '@/const/approve'
import { getuserInfo } from '@/api/my'
import { teacherAuthApply, teacherAuthApplyRecord } from '@/api/apply'
import ApprSubmit from '@/components/appr-submit/ApprSubmit'
export default {
  name: 'ApplyTeacherIdentification',
  components: {
    CommonForm: () => import('@/components/common-form/CommonForm'),
    ApprSubmit
  },
  data() {
    return {
      formKey: 'applyTeacherAuth',
      toApproveIndex,
      loading: false,
      personInfor: {}, //个人信息
      i: 1,
      courseData: [],
      formData: {
        remark: '',
        qualification: '',
        grade: '',
        workStartTime: '',
        xgWorkStartTime: '',
        applyCourseDevJoins: '',
        courseName: '',
        graduateSchool: ''
      },
      teacherAuthApplyData: {}, // 系统中讲师基本信息
      formData2: {
        teachHours: '',
        teachResult: ''
      },
      columns: [
        {
          prop: 'workStartTime',
          itemType: 'datePicker',
          label: '初始工作日期',
          span: 10,
          type: 'date',
          required: true,
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          pickerOptions: {
            disabledDate(time) {              
              return time.getTime() > Date.now()
            }
          }
        },
        {
          prop: 'xgWorkStartTime',
          itemType: 'datePicker',
          label: '徐工工作日期',
          span: 10,
          offset: 4,
          type: 'date',
          required: true,
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          pickerOptions: {
            disabledDate(time) {              
              return time.getTime() > Date.now()
            }
          }
        },
        {
          prop: 'qualification',
          itemType: 'treeSelect',
          label: '学历',
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
          prop: 'graduateSchool',
          itemType: 'input',
          label: '毕业院校',
          offset: 4,
          span: 10,
          required: true
        },
        {
          prop: 'grade',
          itemType: 'input',
          label: '现等级',
          offset: 0,
          span: 10,
          required: true
        },
        {
          prop: 'remark',
          itemType: 'input',
          required: true,
          label: '申请说明',
          span: 24,
          rows: 6,
          type: 'textarea'
        }
      ],
      columns2: [
        {
          prop: 'teachHours',
          itemType: 'inputNumber',
          label: '授课课时',
          offset: 0,
          span: 10,
          min: 0,
          precision: 1,
          maxlength: 32,
          required: false
        },
        {
          prop: 'teachResult',
          itemType: 'input',
          label: '课程效果',
          offset: 4,
          span: 10,
          required: false
        },
        {
          prop: 'professionalLearning',
          itemType: 'input',
          label: '专业学习',
          offset: 0,
          span: 24,
          required: false
        }
      ],
      pojectTemp: {}
    }
  },
  activated() {
    this.clearData() // 清楚缓存数据
  },
  created() {
    this.initPersonInfor()
    this.teacherAuthApplyRecordFn()
  },
  methods: {
    async teacherAuthApplyRecordFn() {
      // 查看申请者历史讲师基本信息
      this.teacherAuthApplyData = await teacherAuthApplyRecord()
      this.formData2.teachHours = this.teacherAuthApplyData.sumGrade
      this.formData2.teachResult = this.teacherAuthApplyData.sumPeriod
      this.courseData = this.teacherAuthApplyData.list ? this.teacherAuthApplyData.list : []
    },
    addMemberFn() {
      // 添加成员
      this.i++
      this.courseData.push({ courseName: '' })
    },
    clearData() {
      // 清楚缓存数据
      this.formData = {
        remark: '',
        qualification: '',
        grade: '',
        workStartTime: '',
        xgWorkStartTime: '',
        applyCourseDevJoins: '',
        courseName: '',
        graduateSchool: ''
      }      
    },
    async initPersonInfor() {
      // 查询个人信息
      this.personInfor = await getuserInfo()
      if(this.personInfor.entryDate){
        this.formData.xgWorkStartTime=this.personInfor.entryDate
      }      
    },
    // addMemberFn() {
    //   // 添加成员
    //   this.i++
    //   this.courseData.push({
    //     name: '剧建业',
    //     userId: '1333573657812832257',
    //     orgName: '上海易宝有限公司',
    //     positionName: '',
    //     duty: ''
    //   })
    // },
    submitFn() {
      // 提交申请表
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          let sendData = {}
          sendData = { ...this.formData, ...this.formData2 }
          sendData.applyCourseDevJoins = this.courseData
          // sendData.devStartTime = this.formData.devTime[0]
          // sendData.devEndTime = this.formData.devTime[1]

          // validate方法返回Promise,校验是否可发起，如果可发起Promise直接resolve
          this.$refs.apprSubmit.validate().then((process) => {
            teacherAuthApply(sendData).then((res) => {
              // 如果没有任何审批流程可选则不需要经过审批
              if (process) {
                // 状态设置为审批中
                this.submitApprApply(res.id, sendData)
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
    // 审批发起组件的弹窗确认回调
    handleSubmit() {
      this.submitFn()
    },
    // 提交课程审批
    submitApprApply(applyId, sendData) {
      //申请表   给formData 添加id,catalogName字段
      this.formData.id = applyId
      // this.formData.catalogName = this.parentOrgIdLabel
      this.$refs.apprSubmit
        .submit({
          formId: applyId,
          processName: categoryMap['7'],
          formKey: this.formKey,
          formTitle: this.formData.name,
          formData: JSON.stringify(sendData)
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
      this.courseData.splice(index, 1)
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

.content3 {
}
.content3 h4 {
  padding: 0 0 10px 0;
  margin: 0;
  font-weight: normal;
  color: #606266;
}
</style>
