<template>
  <div v-loading="loading">
    <div class="details_header">
      <ul @click="handleBack">
        <li>审批中心</li>
        <li>/</li>
        <li class="text_color">审批详情</li>
      </ul>
    </div>

    <div class="apply-info-wrap">
      <div class="title">
        <div>{{ applyDetail.title }}申请</div>
      </div>
      <div class="info">
        <div class="num-box">
          <div>
            <div>审批编号：</div>
            <div>{{ applyDetail.apprNo }}</div>
          </div>
        </div>
        <div class="apply-user-box">
          <div>
            <div>申请人：</div>
            <div>{{ applyDetail.userName }}</div>
          </div>
        </div>
        <div class="apply-time">
          <div>
            <div>申请时间：</div>
            <div>{{ applyDetail.applyTime }}</div>
          </div>
        </div>
        <div class="apply-status">
          <div>
            <div>状态</div>
            <div>{{ StatusCN[applyDetail.status] }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="apply-detail-title">
      <div class="title-box">
        <div class="title">审批详情</div>
        <div @click="show = !show">
          <div v-if="show" class="btn-box">
            <i class="el-icon-arrow-up" style="margin-right: 12px" /> 收起
          </div>
          <div v-else class="btn-box">
            <i class="el-icon-arrow-down" style="margin-right: 12px" /> 打开
          </div>
        </div>
      </div>
      <transition name="show">
        <div v-show="show" class="apply-detail">
          <!-- 详情 start-->
          <component :is="comType" :apply-detail="applyDetail"></component>
          <!-- 详情 end-->
        </div>
      </transition>
    </div>

    <div class="record-wrap">
      <div class="record-wrap-title">审批流程</div>
      <steps :progress.sync="progress" />

      <el-form
        v-show="isApprover"
        ref="apprForm"
        label-position="top"
        :model="apprForm"
        :rules="formRules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="审批意见" prop="comment">
          <el-input
            v-model="apprForm.comment"
            type="textarea"
            :rows="4"
            :placeholder="tip"
            :maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <div v-if="!isFished && !isPreview" class="cancel-btn-box">
        <el-button
          v-if="!isFished && isApplyUser"
          type="primary"
          size="medium"
          :disabled="!hasCancel ? true : false"
          @click="handleCancelClick"
        >
          撤回
        </el-button>
        <el-tooltip
          v-if="isApprover"
          effect="dark"
          content="拒绝审批后，该审批将终止"
          :enterable="false"
          placement="top"
        >
          <el-button type="primary" size="medium" @click="handelConfirm('Reject')">
            拒绝
          </el-button>
        </el-tooltip>
        <el-tooltip
          v-if="isApprover"
          effect="dark"
          content="同意该审批，审批将继续向下流转"
          :enterable="false"
          placement="top"
        >
          <el-button type="primary" size="medium" @click="handelConfirm('Pass')"> 同意 </el-button>
        </el-tooltip>
        <el-tooltip
          v-if="(isReject && isApplyUser) || (isCancel && isApplyUser)"
          effect="dark"
          content="重新申请"
          placement="top"
        >
          <el-button type="primary" size="medium" @click="handleReapplyClick"> 重新申请 </el-button>
        </el-tooltip>
        <el-button
          v-if="!isCancel && !isFished && !isReject && isApplyUser"
          type="primary"
          size="medium"
          @click="handelUrgeClick"
        >
          催一下
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { baseDictionaries } from '@/const/approve'
import courseDetail from '@/views/approvalDetail/courseDetail'
import applyCourseDevDet from '@/views/approvalDetail/applyCourseDevDet'
import applyTrainingNeedsDet from '@/views/approvalDetail/applyTrainingNeedsDet'
import applyOutsideTrainingDet from '@/views/approvalDetail/applyOutsideTrainingDet'
import applyLeaveDet from '@/views/approvalDetail/applyLeaveDet'
import applyTutorAuthDet from '@/views/approvalDetail/applyTutorAuthDet'
import applyTrainingOuterBuyDet from '@/views/approvalDetail/applyTrainingOuterBuyDet'
import applyStudyDoctorateDet from '@/views/approvalDetail/applyStudyDoctorateDet'
import applyTeacherIdentificationDet from '@/views/approvalDetail/applyTeacherIdentificationDet'
import applyOutsideTrainBookbuildingDet from '@/views/approvalDetail/applyOutsideTrainBookbuildingDet'
import applyKnowledgeShare from '@/views/approvalDetail/applyKnowledgeShare'
import trainPlanDet from '@/views/approvalDetail/annualDetails'
import { mapGetters } from 'vuex'
import steps from './components/steps'
import {
  getApprDetail,
  getApprRecord,
  createApprCancel,
  createApprPass,
  createApprReject,
  createApprUrge,
  getProcessDetail
} from '@/api/approvalCenter'
import { dateConver } from '@/util/date'
import moment from 'moment'
import 'moment/locale/zh-cn'

moment.locale('zh-cn')

// 审批状态
const APPROVE_STATUS_TYPE = {
  CANCEL: 'Cancel',
  EMPTY: '',
  PASS: 'Pass',
  REJECT: 'Reject'
}
const { CANCEL, EMPTY, PASS, REJECT } = APPROVE_STATUS_TYPE

export default {
  name: 'Apprv2Detail',
  components: {
    steps,
    courseDetail,
    applyCourseDevDet,
    applyTrainingNeedsDet,
    applyOutsideTrainingDet,
    applyLeaveDet,
    applyTutorAuthDet,
    applyTrainingOuterBuyDet,
    applyStudyDoctorateDet,
    applyTeacherIdentificationDet,
    applyOutsideTrainBookbuildingDet,
    applyKnowledgeShare,
    trainPlanDet
  },
  data() {
    return {
      textarea: '',
      // 审批进行返回
      applyRecord: {},
      applyDetail: {},
      progress: [],
      nodeList: [],
      processData: {}, // 给表单修改的时候暂存流程数据
      currentApproveNode: [],
      // 审批记录列表（接口返回
      recordList: [],
      nodeData: [],
      loading: false,
      // 流程ID
      processId: '',
      // 当前审批人id,可能有多个
      apprUserIdList: [],
      // 审批详情
      StatusCN: {
        Approve: '审批中',
        Pass: '已通过',
        Reject: '已拒绝',
        Cancel: '已撤回'
      },
      show: false,
      // 审批进度
      activeStep: 0,
      // 是否已撤销
      isCancel: false,
      // 流程是否结束
      isFished: false,
      // 是否已拒绝
      isReject: false,
      // 控制显示模态框
      dialogVisible: false,
      btnloading: false,
      // 审批意见表单
      apprForm: {
        processInstanceId: '',
        taskId: '',
        userId: '',
        comment: ''
      },

      // 校验是否审批意见是否必填
      // 判断是同意审批还是拒绝审批
      apprType: '',
      // 头像配置
      circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      // 审批提示
      tip: '',
      // 审批意见是否必填
      isOpinion: 0
    }
  },

  computed: {
    // 获取审批详情类型
    comType() {
      let key = this.$route.query.key
      return key ? baseDictionaries[key] : 'courseDetail'
    },
    // 当前审批详情的审批id
    apprNo() {
      return _.get(this.applyDetail, 'apprNo', null)
    },
    // 当前审批详情的表单id,例如课程ID
    formId() {
      return _.get(this.applyDetail, 'formId', null)
    },
    // 发起用户的id
    applyUserId() {
      return _.get(this.applyRecord, 'data[0].userId', null)
    },
    // 审批实例ID
    processInstanceId() {
      return _.get(this.applyRecord, 'processInstanceId', null)
    },
    // 撤回按钮是否显示
    hasCancel() {
      // 如果流程已经有人进行了审批则不可以撤回
      return [CANCEL, PASS, REJECT].every(
        (status) => !_.map(this.recordList, 'result').includes(status)
      )
    },
    // 当前用户是否审批人
    isApprover() {
      // 当前用户是否审批人
      const { userId } = this
      // todo: 取消使用apprUserIdList变量（简化）
      return this.apprUserIdList.includes(userId)
    },

    // 提交人跟当前用户是否同一个人
    isApplyUser: function() {
      return this.userId === this.applyUserId
    },
    // 是否是预览状态,预览状态不允许操作
    isPreview() {
      // return true
      return _.get(this.$route.query, 'preview', false)
    },
    formRules() {
      return {
        comment: [{ required: !!this.isOpinion, message: '请输入审批意见', trigger: 'blur' }]
      }
    },
    ...mapGetters(['userId'])
  },
  activated() {
    this.loadData()
  },
  methods: {
    // 查看课程内容
    jumpToLearn() {
      // this.$router.push({
      //   path: '/approvalCenter/chapter',
      //   query: { courseId: item.courseId, chapterId: item.id }
      // })
    },

    //递归实现
    //@leafId  查找的id，
    //@nodes   原始Json数据
    //@path    供递归使用
    findPathByLeafId(leafId, nodes, path) {
      if (path === undefined) {
        path = []
      }
      for (let i = 0; i < nodes.length; i++) {
        let tmpPath = path.concat()
        tmpPath.push(nodes[i].name)
        if (leafId == nodes[i].id) {
          return tmpPath
        }
        if (nodes[i].children) {
          let findResult = this.findPathByLeafId(leafId, nodes[i].children, tmpPath)
          if (findResult) {
            return findResult
          }
        }
      }
    },

    handleBack() {
      this.$router.back()
    },
    // 流程数据通过当前审批节点是否存在当前用户获取流程内的节点
    // 当前审批节点可以有多个
    findCurrentNode(processData) {
      let currentNode = Object.create(null)
      const loop = (node) => {
        if (this.currentApproveNode.includes(node.nodeId)) {
          currentNode = node
        } else {
          node.childNode && loop(node.childNode)
        }
      }
      loop(processData)
      return currentNode
    },
    // 获取当前节点id，用来获取当前审批人是否有当前账号，从而进一步判断权限
    getCurrentNode(data) {
      // result字段为空时，为待审批节点
      let currentApproveNodeList = _.filter(data, (item) => {
        return item.result === EMPTY
      })
      currentApproveNodeList.forEach((item) => {
        // nodeId约定为3位数字，但连续审批内拼接了index，故截取前三位作为当前审批节点的nodeId
        this.currentApproveNode.push(item.nodeId)
      })
    },
    async loadData() {
      try {
        this.loading = true
        const applyDetail = await getApprDetail({
          apprNo: this.$route.query.apprNo
        })
        applyDetail.applyTime = dateConver(applyDetail.applyTime)
        // 缓存当前审批详情
        const { apprNo, nodeData } = applyDetail
        this.applyDetail = {
          ...applyDetail,
          nodeData: JSON.parse(nodeData || '[]')
        }
        const applyRecord = await getApprRecord({ apprNo })
        const { data, processInstanceId, processId } = applyRecord
        this.getCurrentNode(data)
        // 缓存审批记录
        this.applyRecord = applyRecord
        this.apprForm.processInstanceId = processInstanceId
        this.processId = processId
        this.recordList = data
        // 记录所有审批中节点的用户id
        this.apprUserIdList = []
        this.recordList.forEach((item, index) => {
          if (index && item.result === EMPTY) {
            this.apprUserIdList.push(item.userId)
          }
        })

        // 获取审批流程详情
        this.getProcessDetail()
        // 处理流程数据
        this.handleNodeData()
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    // 给record添加标识,并添加部分node数据
    copyNode(target, origin, pos) {
      target.type = origin.type
      target.prevId = origin.prevId
      target.properties = origin.properties
      // 或签不copy userlist
      // 或签显示userList(2021.2.25  与测试确认)
      // if (target.nodeType !== 'or') {
      target.userList = origin.userList
      // }
      target.pos = pos
    },
    tagNode(record, nodeList) {
      if (record.nodeId === 'start') {
        this.copyNode(record, nodeList[0], '0')
        return
      }
      nodeList.forEach((node, index) => {
        if (node.nodeId && node.nodeId.slice(0, 3) === record.nodeId) {
          this.copyNode(record, node, `${index}`)
          return
        }
      })
    },
    // 标记所有节点的属性
    tagAllNode(recordList, nodeList) {
      recordList.forEach((record) => {
        // TODO: 消除 backParams
        record.createTimeStamp = Date.parse(record.createTime)
        record.approveTimeStamp = Date.parse(record.approveTime || new Date())
        this.tagNode(record, nodeList)
      })
    },
    // 获取整个流程的状态
    handleStatus() {
      // 开始节点的状态即代表整个流程的状态
      const firstNode = _.head(this.recordList)
      switch (firstNode.result) {
        case 'Reject':
          this.isReject = true
          this.isFished = true
          break
        case 'Cancel':
          this.isCancel = true
          this.isFished = true
          break
        case 'Pass':
          this.isFished = true
          break
      }
    },
    resolveRecordList(recordList, cc) {
      recordList = _.sortBy(recordList, 'pos')
      let recordListWithCC = []
      let ccCopy = cc.slice()
      // 插入抄送人
      // recordList里没有抄送人节点，所以要按流程设计数据把抄送人节点添加进去
      if (ccCopy.length > 0) {
        let ccCurrent = ccCopy.shift()
        // 插入抄送人
        for (const index in recordList) {
          const record = recordList[index]
          if (
            recordList[index - 1] &&
            ccCurrent &&
            recordList[index - 1].pos < ccCurrent.pos &&
            record.pos > ccCurrent.pos
          ) {
            recordListWithCC.push(ccCurrent, record)
            ccCurrent = ccCopy.shift()
          } else {
            recordListWithCC.push(record)
          }
        }
      }
      const posList = _.compact(_.uniq(_.map(recordList, 'pos')))
      let group = {}
      // 合并会签或签节点
      const hqHandler = (users) => {
        const firstUser = _.head(users)
        if (_.size(users) > 1) {
          // 处理会签或签合并节点的状态
          let result = null
          const results = _.map(users, 'result')
          if (firstUser.properties.counterSign) {
            if (_.includes(results, EMPTY)) result = EMPTY
            else if (_.includes(results, REJECT)) result = REJECT
            else if (_.every(results, (item) => item === PASS)) result = PASS
          } else {
            if (_.includes(results, EMPTY)) result = EMPTY
            else if (_.includes(results, REJECT)) result = REJECT
            else if (_.includes(results, PASS)) result = PASS
          }
          return {
            ...firstUser,
            remark: '',
            result,
            userList: users
          }
        } else {
          return firstUser
        }
      }
      _.values(posList).forEach((pos) => {
        group[pos] = hqHandler(_.filter(recordList, { pos }))
      })

      let result = []
      _.each(group, (value, key) => {
        const nodeLabel = _.get(value, 'properties.title', '')
        const nodeValue = value.nodeId

        result[key] = {
          ...value,
          label: nodeLabel,
          value: nodeValue
        }
      })
      return _.compact(_.map(result))
    },
    handleNodeData() {
      let { nodeData } = this.applyDetail
      this.nodeData = _.cloneDeep(nodeData)
      // 给所有节点打上标记
      this.tagAllNode(this.recordList, this.nodeData)
      const firstNode = _.find(this.recordList, { type: 'start' })
      this.recordList = [
        firstNode,
        ..._.sortBy(_.reject(this.recordList, { type: 'start' }), [
          // 'createTimeStamp',
          'approveTimeStamp'
        ])
      ]
      this.handleStatus()
      const cc = []
      // 记录流程设计里所有的抄送人节点
      this.nodeData.forEach((node, index) => {
        if (node.type === 'copy') {
          node.pos = `${index}`
          cc.push(node)
        }
      })

      // （添加抄送节点，合并会签节点，合并并行审批节点）
      this.progress = _.flatten(this.resolveRecordList(this.recordList, cc))
      this.progress.map((j) => {
        j.approveTime = dateConver(j.approveTime)
      })
      if (this.isReject) {
        return
      }
      const lastIndex = +_.last(this.progress).pos + 1
      // 追加审批记录里没有的流程节点
      let addNodes = this.nodeData.slice(lastIndex)
      addNodes = addNodes.map((node, index) => {
        return {
          ...node,
          pos: `${lastIndex + index}`,
          label: node.properties.title
        }
      })
      this.progress = _.concat(this.progress, addNodes)
      this.progress.map((j) => {
        j.approveTime = dateConver(j.approveTime)
      })
      //过滤自动审批通过的节点（一般是被冻结或被删除的账号）
      // this.progress.forEach((item,index,arr)=>{
      //   if(item.type==='approver'){
      //     item.userList = item.userList.filter(x=>x.userName.)
      //   }
      //   if(item.userList.length===0&&!item.userName){
      //     arr.splice(index,1)
      //   }
      // })
      // console.log(this.progress,1)
    },
    // 处理重新发起申请
    handleReapplyClick() {
      window.open(`${process.env.VUE_APP_MANAGE_URL}/#/course/establishCourse?id=${this.formId}`)
    },
    // 点击撤回
    handleCancelClick() {
      this.$confirm('确定撤销申请吗?', '撤销申请', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        createApprCancel({ processInstanceId: this.processInstanceId })
          .then(() => {
            this.$message.success('撤回成功')
            this.$router.go(-1)
          })
          .finally(() => {
            this.loading = false
          })
      })
    },
    // 获取审批流程详情
    getProcessDetail() {
      // 获取审批流程，获取审批意见是否必填，和审批提示语
      getProcessDetail({ processId: this.processId })
        .then((res) => {
          let { isOpinion, tip } = res
          this.tip = tip
          this.isOpinion = isOpinion
          this.apprForm.comment = ''
          this.$nextTick(() => {
            this.$refs.apprForm.clearValidate()
          })
        })
        .finally(() => {})
    },
    // 点击同意或拒绝
    handelConfirm(type) {
      this.$refs.apprForm.validate().then((result) => {
        if (!result) return
        this.btnloading = true
        let userId = this.userId
        let taskId = ''
        this.recordList.forEach((it) => {
          userId === it.userId && it.result === '' && (taskId = it.taskId)
        })
        let TYPE = {
          Reject: {
            api: createApprReject,
            text: '拒绝'
          },
          Pass: {
            api: createApprPass,
            text: '同意'
          }
        }
        let submitFun = TYPE[type].api
        submitFun({
          userId,
          taskId,
          processInstanceId: this.processInstanceId,
          comment: this.apprForm.comment
        })
          .then(() => {
            this.$message.success(`你已${TYPE[type].text}这个申请`)
          })
          .finally(() => {
            this.btnloading = false
            this.handleBack()
          })
      })
    },
    // 点击催一下
    handelUrgeClick() {
      createApprUrge({
        apprNo: this.apprNo,
        processInstanceId: this.processInstanceId
      }).then(() => {
        this.$message({
          type: 'success',
          message: '催办成功'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-col {
  margin-bottom: 0;
}

// 用户提交的申请
.apply-info-wrap {
  background: #ffffff;
  box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
  border-radius: 4px;
  height: 156px;
  padding: 24px;
  .title {
    display: flex;
    justify-content: space-between;
    font-size: 18px;
    color: #333333;
    font-weight: bold;
  }

  .info {
    display: flex;
    justify-content: space-between;

    & > div {
      margin-top: 16px;
      height: 43px;
    }

    & > div :first-child {
      margin-bottom: 7px;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #545b66;
    }

    & > div :last-child {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #a1a7ae;
    }

    .num-box {
      flex: 1;
    }

    .apply-user-box {
      padding-left: 24px;

      flex: 1;
      display: flex;

      > div {
        text-align: start;
      }

      border-left: 1px solid #e3e7e9;
    }

    .apply-time {
      padding-left: 24px;
      flex: 1;
      border-left: 1px solid #e3e7e9;
      display: flex;

      > div {
        text-align: start;
      }
    }

    .apply-status {
      padding-left: 24px;
      border-left: 1px solid #e3e7e9;
      flex: 1;

      :nth-child(2) {
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #368afa;
        font-weight: bold;
      }
    }
  }
}

// 申请详情标题
.apply-detail-title {
  margin-top: 20px;
  background: #ffffff;
  box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
  border-radius: 4px;
  padding: 24px;
  .title-box {
    display: flex;
    justify-content: space-between;

    // border-bottom: #c6cbce solid 1px;
    .title {
      font-family: PingFangSC-Medium;
      font-size: 18px;
      color: #333333;
      font-weight: bold;
    }

    .btn-box {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #757c85;
      text-align: right;
      cursor: pointer;
      vertical-align: middle;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}

// 审批详情
.apply-detail {
  margin-top: 10px;
  border-bottom: 2px transparent solid;
}

.cancel-btn-box {
  display: flex;
  justify-content: center;
}

// 审批框
/deep/ .el-form--label-top .el-form-item__label {
  padding: 0;
}

/deep/ .el-dialog__body {
  padding: 0 20px;
}

.record_start {
  line-height: 30px;
  margin-left: 15px;
  font-size: 14px;
  color: #333;

  .text {
    color: #999;
    margin: 0 12px;
  }

  .time {
    color: #999;
    font-size: 14px;
  }
}

.counterSign_text {
  margin-left: 8px;
  color: #999;
}

.textName {
  color: #333;
  font-size: 14px;

  span {
    display: inline-block;
    line-height: 30px;
  }
}

.record-wrap {
  // margin-top: 43px;
  background: #ffffff;
  box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
  border-radius: 4px;
  margin-top: 20px;
  padding: 24px;
  .record-wrap-title {
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: #202940;
    line-height: 25px;
    font-weight: bold;
    margin-bottom: 24px;
  }
}

.details {
  &_header {
    height: 57px;
    line-height: 57px;
    ul {
      display: flex;
      cursor: pointer;
      li {
        margin-right: 5px;
        font-size: 14px;
        color: rgba(0, 11, 21, 0.45);
      }
      .text_color {
        color: rgba(0, 11, 21, 0.85);
      }
    }
  }
  &_comment {
    &_title {
      // font-size: 14px;
      // color: rgba(0, 11, 21, 0.85);
      margin-top: 24px;
      font-family: PingFangSC-Medium;
      font-size: 18px;
      color: #202940;
      line-height: 25px;
      font-weight: bold;
      margin-bottom: 24px;
    }
    &_textarea {
      margin-top: 16px;
      margin-bottom: 150px;
    }
  }
  &_btn {
    margin: 0 -24px -24px;
    background: #ffffff;
    box-shadow: 0 -2px 12px 0 rgba(0, 61, 112, 0.08);
    border-radius: 4px;
    padding: 16px;
    display: flex;
    justify-content: center;
  }
}
.tooltip_ {
  width: 100%;
  display: flex;
  span {
    width: 95%;
    text-align: left;
  }
  i {
    width: 10px;
  }
}
</style>
