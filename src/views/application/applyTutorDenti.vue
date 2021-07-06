<template>
  <div class="applyTutorDenti">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/" style="padding: 25px 0 20px">
      <el-breadcrumb-item>业务申请</el-breadcrumb-item>
      <el-breadcrumb-item>导师认证申请</el-breadcrumb-item>
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
          <div class="content3">
            <div class="title">任职资格</div>
            <div
              v-for="(item, index) in editExperData"
              :key="item.id ? item.id : index"
              class="experience"
              @mouseover="activeId = index + 1"
              @mouseout="activeId = 0"
            >
              <h3>
                <span class="experienceTitle">工作经历（{{ index + 1 }}）</span>
                <span v-show="activeId == index + 1">
                  <span class="operation" @click="editExperience(item,index)">编辑</span>
                  <span class="operation" @click="deleteExperience(index)">删除</span>
                </span>
              </h3>
              <div>
                <el-row>
                  <el-col :span="8"><span class="name">单位名称：</span>{{ item.workUnit }}</el-col>
                  <el-col :span="8"><span class="name">在职时间：</span>{{ dateConver(item.workTime[0]) }} 至
                    {{ dateConver(item.workTime[1]) }}</el-col>
                  <el-col :span="8"><span class="name">职位名称：</span>{{ item.jobName }}</el-col>
                  <el-col :span="8"><span class="name">证明人：</span>{{ item.witness }}</el-col>
                  <el-col :span="8"><span class="name">证明人联系电话：</span>{{ item.witnessPhone }}</el-col>
                  <el-col :span="24" class="experienceList"><span class="name">工作内容：</span><span class="wContent">{{ item.workContent }}</span></el-col>
                </el-row>
              </div>
            </div>
            <div class="addMember" @click="addExperienceFn">
              <span class="iconimage_icon_plus-outlined iconfont"></span>
              <span class="addMember2">添加工作经历</span>
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
    <el-dialog
      title="添加工作经历"
      :visible.sync="dialogVisible"
      width="60%"
      :before-close="handleClose"
    >
      <common-form ref="editExperFormRef" :model="editExperformData" :columns="editExperColumns">
      </common-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveExperience">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 审批发起组件 -->
    <appr-submit ref="apprSubmit" category-id="8" @submit="handleSubmit" />
  </div>
</template>

<script>
import { getuserInfo } from '@/api/my'
import { categoryMap, toApproveIndex } from '@/const/approve'
import ApprSubmit from '@/components/appr-submit/ApprSubmit'
import { applyTutor } from '@/api/apply'
import { dateConver } from '@/util/date' 
export default {
  name: 'ApplyTutorDenti',
  components: {
    CommonForm: () => import('@/components/common-form/CommonForm'),
    ApprSubmit
  },
  data() {
    return {
      formKey: 'tutorAuth',
      loading: false,
      editIndex:0,
      personInfor: {}, //个人信息
      toApproveIndex,
      isEdit: false,
      dialogVisible: false,
      activeId: 0,
      formData: {
        qualification: '',
        graduateSchool: '',
        major: '',
        workYear: '',
        lastYearPerformance: '',
        remark: '',
        userExperiences: []
      },
      editExperformData: {
        workUnit: '',
        workStartTime: '',
        workEndTime: '',
        jobName: '',
        witness: '',
        witnessPhone: '',
        workContent: '',
        sort: ''
      },
      editExperData: [],
      columns: [
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
          prop: 'major',
          itemType: 'input',
          label: '专业',
          offset: 0,
          span: 10,
          required: true
        },
        {
          prop: 'workYear',
          itemType: 'inputNumber',
          label: '本岗位工作年限',
          min: 0,
          span: 10,
          offset: 4,
          precision: 1,
          maxlength: 32,
          required: true
        },
        {
          prop: 'lastYearPerformance',
          itemType: 'input',
          label: `上年度绩效评价结果（${new Date().getFullYear() - 1}年）`,
          min: 0,
          span: 10,
          offset: 0,
          precision: 1,
          maxlength: 32,
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
      editExperColumns: [
        {
          prop: 'workUnit',
          itemType: 'input',
          label: '单位名称',
          offset: 0,
          span: 10,
          required: true
        },
        {
          prop: 'workTime',
          itemType: 'datePicker',
          label: '在职时间',
          offset: 2,
          span: 10,
          type: 'daterange',
          required: true,
          valueFormat: 'yyyy-MM-dd',
          pickerOptions: {
            // disabledDate(time) {
            //   return moment(new Date()).isAfter(time, 'day')
            // }
          }
        },
        {
          prop: 'jobName',
          itemType: 'input',
          label: '职位名称',
          offset: 0,
          span: 10,
          required: true
        },
        {
          itemType: 'input',
          label: '证明人',
          span: 10,
          offset: 2,
          maxlength: 32,
          required: true,
          prop: 'witness'
        },
        {
          prop: 'witnessPhone',
          itemType: 'input',
          label: '证明人联系电话',
          span: 10,
          offset: 0,
          precision: 1,
          maxlength: 32,
          required: false,
          rules: [{ pattern: /^[0-9]{11}$/, message: '长度必须为11位数字', trigger: 'blur' }]
        },
        {
          prop: 'workContent',
          itemType: 'input',
          required: true,
          label: '工作内容',
          maxlength: 500,
          span: 24,
          rows: 6,
          type: 'textarea'
        }
      ],
      pojectTemp: {}
    }
  },
  computed: {},
  deactivated() {
    this.clearData() // 清楚缓存数据
  },
  created() {
    this.initPersonInfor()
  },
  methods: {
    dateConver(date){
      return dateConver(date)
    },
    clearData() {
      // 清楚缓存数据      
      this.$refs.formRef.resetFields()          
      this.formData.userExperiences=[]
      // this.formData = {
      //   qualification: '',
      //   graduateSchool: '',
      //   major: '',
      //   workYear: '',
      //   lastYearPerformance: '',
      //   remark: '',
      //   userExperiences: []
      // }
      this.editExperData = []
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
          var userExperiences = this.editExperData
          userExperiences.forEach((val, i) => {
            userExperiences[i].workStartTime = val.workTime[0]
            userExperiences[i].workEndTime = val.workTime[1]
          })
          sendData.userExperiences = userExperiences
          // validate方法返回Promise,校验是否可发起，如果可发起Promise直接resolve
          this.$refs.apprSubmit.validate().then((process) => {
            applyTutor(sendData).then((res) => {
              // 如果没有任何审批流程可选则不需要经过审批
              if (process) {
                // 状态设置为审批中
                this.submitApprApply(res)
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
    submitApprApply(res) {
      //申请表   给formData 添加id,catalogName字段
      // this.formData.id = applyId
      // this.formData.catalogName = this.parentOrgIdLabel
      this.$refs.apprSubmit
        .submit({
          formId: res.id,
          processName: categoryMap['8'],
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
    saveExperience() {
      // 添加工作经验
      this.$refs.editExperFormRef.validate((valid) => {
        console.log(valid)
        if (valid) {
          if (!this.isEdit) {
            this.editExperData.push(JSON.parse(JSON.stringify(this.editExperformData)))
          }else{
            //let kk = this.editExperData.find(item=>item.name==this.editExperformData.name)
            this.editExperData[this.editIndex]={...JSON.parse(JSON.stringify(this.editExperformData))}
          }
          this.handleClose()
        }
      })
    },
    addExperienceFn() {
      // 新增工作经验
      this.isEdit = false
      this.dialogVisible = true
    },
    editExperience(item,index) {
      // 编辑工作经验
      this.isEdit = true
      this.editIndex = index
      this.editExperformData = { ...item }
      this.dialogVisible = true
    },
    deleteExperience(index) {
      // 删除工作经验
      this.editExperData.splice(index, 1)
    },
    handleClose() {
      // 关闭弹框后
      this.dialogVisible = false  
      this.$nextTick(()=>{
        this.$refs.editExperFormRef.resetFields()
      }) 
      // this.editExperformData = {
      //   workUnit: '',
      //   workStartTime: '',
      //   workEndTime: '',
      //   jobName: '',
      //   witness: '',
      //   witnessPhone: '',
      //   workContent: '',
      //   sort: ''
      // }
    }
  }
}
</script>

<style lang="scss" scoped>
.applyTutorDenti .container {
  padding: 30px 65px 0;
}
.applyTutorDenti .applicant-information {
  padding: 0 0 33px 0;
}
.applyTutorDenti .title {
  color: #000b15;
  opacity: 0.85;
  font-size: 16px;
  font-weight: bold;
  padding-bottom: 18px;
}
.applyTutorDenti .name {
  color: #000b15;
  opacity: 0.45;
}

.applyTutorDenti /deep/ .el-col {
  margin-bottom: 9px;
}
.applyTutorDenti .application-information {
  padding: 0 0 33px 0;
}

.applyTutorDenti /deep/ .el-form-item {
  margin-bottom: 7px;
}
.applyTutorDenti .submit-btn .el-button--primary {
  background-color: $primaryColor;
  border-color: $primaryColor;
}
.content3 {
  margin-bottom: 30px;
}
.experience {
  padding: 0 0 20px 0;
  border-bottom: #ebeced dashed 1px;
  margin-bottom: 24px;
}
.experience h3 {
  font-size: 14px;
  padding: 0 0 18px 0;
  margin: 0;
}
.experience .experienceTitle {
  padding-right: 20px;
}
.experience h3 span {
  float: left;
}
.experience h3 .operation {
  padding-right: 15px;
  cursor: pointer;
  color: $primaryColor;
}
.experience h3::before {
  display: block;
  float: left;
  content: '';
  background: $primaryColor;
  width: 4px;
  height: 14px;
  margin: 3px 10px 0 0;
}
.experience h3::after {
  content: '';
  display: block;
  clear: both;
}
.experience .experienceList {
  display: flex;
}
.experience .name {
  width: 70px;
}
.experience .wContent {
  flex: 1;
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
  color: $primaryColor;
}
.addMember .addMember2 {
  padding: 0 0 0 7px;
}
</style>
