<template>
  <div class="outsideTraining">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/" style="padding: 25px 0 20px">
      <el-breadcrumb-item>业务申请</el-breadcrumb-item>
      <el-breadcrumb-item>外训报名</el-breadcrumb-item>
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
          <!-- 项目培训信息 -->
          <div class="project-information">
            <div class="title">项目培训信息</div>
            <el-row v-if="Object.keys(pojectTemp).length">
              <!-- v-if="Object.keys(pojectTemp).length" -->
              <el-col :span="8"><span class="name">培训名称：</span>{{ pojectTemp.trainName }}</el-col>
              <el-col :span="8"><span class="name">分类：</span>{{ pojectTemp.categoryName }}</el-col>
              <el-col :span="8"><span class="name">培训时间：</span>{{ pojectTemp.trainBeginTime }}--{{
                pojectTemp.trainEndTime
              }}</el-col>
              <el-col :span="8"><span class="name">知识体系：</span>{{ pojectTemp.knowledgeSystemName }}</el-col>
              <el-col :span="8"><span class="name">授课对象：</span>{{ teachingObjectBase[pojectTemp.teachingObject] }}</el-col>
              <el-col :span="8"><span class="name">培训类型：</span>{{ trainTypeBase[pojectTemp.trainType] }}</el-col>
              <el-col :span="8"><span class="name">培训形式：</span>{{ trainWayBase[pojectTemp.trainWay] }}</el-col>
              <el-col :span="8"><span class="name">培训机构：</span>{{ pojectTemp.organizer }}</el-col>
              <el-col :span="8"><span class="name">项目经理：</span>{{ pojectTemp.headTeacherName }}</el-col>
              <el-col :span="8"><span class="name">联系电话：</span>{{ pojectTemp.headTeacherPhone }}</el-col>
              <el-col :span="16"><span class="name">培训地点：</span>{{ pojectTemp.address }}</el-col>
            </el-row>
            <div v-else style="text-align: center; padding: 50px 0; font-size: 12px">
              暂未选择培训
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
    <appr-submit ref="apprSubmit" category-id="2" :is-automatic-appr="isAutomaticAppr" :budget="budget" @submit="handleSubmit" />
  </div>
</template>

<script>
import { getuserInfo } from '@/api/my'
import { categoryMap, toApproveIndex } from '@/const/approve'
import ApprSubmit from '@/components/appr-submit/ApprSubmit'
import { applyJoinOuterTrain, outerTrainList, getTrainDetail } from '@/api/apply'
export default {
  name: 'OutsideTraining',
  components: {
    CommonForm: () => import('@/components/common-form/CommonForm'),
    ApprSubmit
  },
  data() {
    return {
      formKey: 'TrainOuterApplyJoin',
      loading: false,      
      personInfor: {}, //个人信息
      budget:0,
      outerTrainList:[],
      isAutomaticAppr:false, // 是否系统自动审批
      toApproveIndex,
      formData: {
        trainId: '',
        applyDesc: ''
      },
      trainTypeBase:{
        POST_CERT:'岗位取证',
        EDU_SELF:'学历教育（自主）',
        EDU_APPOINT:'学历教育（委派）',
        SPECIAL:'专题研修'
      },
      teachingObjectBase:{
        '1':'干部',
        '2':'后备干部',
        '3':'技术人员',
        '4':'技能人员',
        '5':'营销人员',
        '6':'管理人员',
        '7':'新入职/转岗'
      },
      trainWayBase:{
        '1':'在线培训',
        '2':'面授培训',
        '3':'混合培训',
        '11':'在职培训',
        '12':'脱产培训',
        '13':'业余培训'
      },
      columns: [
        {
          itemType: 'select',
          prop: 'trainId',
          label: '培训名称',
          required: true,
          offset: 0,
          span: 10,
          filterable: true,
          multiple: false,
          props: {
            label: 'trainName',
            value: 'id'
          },
          options: []
        },
        {
          prop: 'applyDesc',
          itemType: 'input',
          required: true,
          label: '培训目的',
          span: 24,
          rows: 6,
          type: 'textarea'
        }
      ],
      pojectTemp: {}
    }
  },
  computed:{
    trainId(){
      return this.$route.query.trainId
    }
  },
  watch: {
    'formData.trainId'(val) {
      let item = this.outerTrainList.find(item => item.id==val)
      this.budget = item.perCapitaCost
      this.isAutomaticAppr = item.applyJoinValue=='automatic'?true:false      
      this.getTrainDetailFun()
    },
    // trainId(val){
    //   this.$nextTick(()=>{
    //     this.formData.trainId=val
    //   })      
    // }
  },
  activated() {
    this.clearData() // 清楚缓存数据
  },
  created() {
    this.initPersonInfor()
    this.outerTrainListFun()
  },
  methods: {
    async getTrainDetailFun() {
      // 查询培训详情
      this.pojectTemp = await getTrainDetail({ trainId: this.formData.trainId })
    },
    async outerTrainListFun() {
      // 获取外训列表
      let res = await outerTrainList({ pageNo: 1, pageSize: 500 })
      this.outerTrainList = this.columns.find((item) => item.prop == 'trainId').options = res.data
      if(this.trainId){
        this.$nextTick(()=>{
          this.formData.trainId=this.trainId
        }) 
      }
    },
    clearData() {
      // 清楚缓存数据
      this.formData = {
        trainId: '',
        applyDesc: ''
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
            applyJoinOuterTrain(sendData).then((res) => {
              // 如果没有任何审批流程可选则不需要经过审批
              if (process) {
                // 状态设置为审批中
                this.submitApprApply(res.applyId)
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
          processName: categoryMap['2'],
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

.project-information {
  padding-bottom: 30px;
}

.project-information .name {
  color: #000b15;
  opacity: 0.45;
}
.project-information /deep/ .el-col {
  margin-bottom: 9px;
}
.submit-btn .el-button--primary {
  background-color: #2875d4;
  border-color: #2875d4;
}
</style>
