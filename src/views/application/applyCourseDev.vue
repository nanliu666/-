<template>
  <div v-loading="loading" class="applyCourseDev">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/" style="padding: 25px 0 20px">
      <el-breadcrumb-item>业务申请</el-breadcrumb-item>
      <el-breadcrumb-item>课程开发申请</el-breadcrumb-item>
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
          <div>
            <div class="title">课程开发责任人</div>
            <el-table :data="memberdata" style="width: 100%" row-key="id" max-height="400">
              <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
              <el-table-column prop="department" label="所属部门"> </el-table-column>
              <el-table-column prop="positionName" label="岗位名称"> </el-table-column>
              <el-table-column label="职责分工">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.duty" placeholder=""></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="70">
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
    <appr-submit ref="apprSubmit" category-id="9" @submit="handleSubmit" />
    <!-- 选人 -->  
    <CommonPicker
      v-model="memberdata"
      :visible.sync="userPickerVisible"
      :options="personPickerOptions.options"
      :props="personPickerOptions.props"
      :selected-style="personPickerOptions.selectedStyle"
    ></CommonPicker> 
  </div>
</template>

<script>
import {personPickerOptions} from './commonPickerConfig'
import CommonPicker from '@/components/common-picker'
import { categoryMap, toApproveIndex } from '@/const/approve'
import { getuserInfo } from '@/api/my'
import { applyAddCourse } from '@/api/apply'
import ApprSubmit from '@/components/appr-submit/ApprSubmit'
export default {
  name: 'ApplyCourseDev',
  components: {
    CommonForm: () => import('@/components/common-form/CommonForm'),
    ApprSubmit,
    // UserPicker,
    CommonPicker
  },
  data() {
    return {
      formKey: 'ApplyCourseDev',
      loading: false,
      personInfor: {}, //个人信息
      toApproveIndex,
      userPickerVisible: false,
      memberdata: [],
      personPickerOptions,     
      formData: {
        courseName: '',
        devType: '',
        trainObject: '',
        conent: '',
        devStartTime: '',
        devEndTime: '',
        devTime: '',
        leaders: []
      },
      columns: [
        {
          prop: 'courseName',
          itemType: 'input',
          label: '课程名称',
          offset: 0,
          span: 10,
          required: true
        },
        {
          prop: 'devType',
          itemType: 'treeSelect',
          label: '开发方式',
          span: 10,
          offset: 4,
          required: true,
          props: {
            selectParams: {
              placeholder: '请选择',
              multiple: false
            },
            treeParams: {
              data: [{ name: '自主开发' }, { name: '引进内化' }, { name: '外包开发' }],
              'check-strictly': true,
              'default-expand-all': false,
              'expand-on-click-node': false,
              clickParent: true,
              filterable: false,
              props: {
                children: 'children',
                label: 'name',
                disabled: 'disabled',
                value: 'name'
              }
            }
          }
        },
        {
          prop: 'devTime',
          itemType: 'datePicker',
          label: '开发周期',
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
          prop: 'trainObject',
          itemType: 'treeSelect',
          label: '培训对象',
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
                { name: '干部' },
                { name: '后背干部' },
                { name: '技术人员' },
                { name: '技能人员' },
                { name: '营销人员' },
                { name: '管理人员' },
                { name: '新入职/转岗' }
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
                value: 'name'
              }
            }
          }
        },
        {
          prop: 'conent',
          itemType: 'input',
          required: true,
          label: '主要内容',
          span: 24,
          rows: 6,
          type: 'textarea'
        }
      ],
      pojectTemp: {}
    }
  },
  // watch:{
  //   memberdata(val){
  //     console.log('memberdata222',val)
  //   }
  // },
  activated() {
    this.clearData() // 清楚缓存数据
  },
  created() {
    this.initPersonInfor()
  },
  methods: {
    clearData() {
      // 清楚缓存数据
      this.$refs.formRef.resetFields()      
      this.memberdata=[]
    },
    async initPersonInfor() {
      // 查询个人信息
      this.personInfor = await getuserInfo()
    },    
    addMemberFn() {
      // 添加成员
      this.userPickerVisible = true
    },
    submitFn() {
      // 提交申请表
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          let sendData = {}
          sendData = { ...this.formData }
          sendData.leaders = this.memberdata
          sendData.devStartTime = this.formData.devTime[0]
          sendData.devEndTime = this.formData.devTime[1]

          // validate方法返回Promise,校验是否可发起，如果可发起Promise直接resolve
          this.$refs.apprSubmit.validate().then((process) => {
            applyAddCourse(sendData).then((res) => {
              // 如果没有任何审批流程可选则不需要经过审批
              if (process) {
                // 状态设置为审批中
                this.submitApprApply(res, sendData)
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
    // 审批发起组件的弹窗确认回调
    handleSubmit() {
      this.submitFn()
    },
    // 提交课程审批
    submitApprApply(res) {
      //申请表   给formData 添加id,catalogName字段
      // this.formData.id = applyId
      // this.formData.catalogName = this.parentOrgIdLabel
      this.$refs.apprSubmit
        .submit({
          formId: res.id,
          processName: categoryMap['9'],
          formKey: res.applyType ? res.applyType : this.formKey
          // formTitle: this.formData.name,
          // formData: JSON.stringify(sendData)
        })
        .then((res) => {
          this.disabledBtn = false
          //提交成功，跳转到成功页面
          this.$router.push({
            path: '/approvalCenter/submitSucceed',
            query: { id: res.apprNo, key: res.applyType ? res.applyType : this.formKey }
          })
          //发布成功清除数据
          //this.isdeleteData()
        })
    },
    memberDelete(index) {
      // 删除成员
      this.memberdata.splice(index, 1)
    }
  }
}
</script>

<style scoped>
.applyCourseDev .container {
  padding: 30px 65px 0;
}
.applyCourseDev .applicant-information {
  padding: 0 0 33px 0;
}
.applyCourseDev .title {
  color: #000b15;
  opacity: 0.85;
  font-size: 16px;
  font-weight: bold;
  padding-bottom: 18px;
}
.applyCourseDev .applicant-information .name {
  color: #000b15;
  opacity: 0.45;
}

.applyCourseDev .applicant-information /deep/ .el-col {
  margin-bottom: 9px;
}
.applyCourseDev .application-information {
  padding: 0 0 33px 0;
}

.applyCourseDev .application-information /deep/ .el-form-item {
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
</style>
