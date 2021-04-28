<template>
  <div class="fillQuestionnaire">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/" style="padding: 25px 0 20px">
      <el-breadcrumb-item :to="{ path: '/myTask/myLearn' }">学习</el-breadcrumb-item>
      <el-breadcrumb-item>调查问卷</el-breadcrumb-item>
    </el-breadcrumb>
    <template v-if="!isSuccess">
      <!-- 问卷进度 -->
      <el-card>
        <el-progress
          :percentage="toPercent"
          :format="formatProgress"
          :stroke-width="12"
        ></el-progress>
      </el-card>
      <div v-loading="loading" class="container">
        <h1 class="title">{{ questionnaireTemp.subjectName }}</h1>
        <p class="subtitle">
          {{ questionnaireTemp.remark }}
        </p>
        <!-- 问卷表单 -->
        <div class="quesForm">
          <el-form ref="ruleForm" :model="questionnaireForm" :rules="questionnaireRules">
            <div v-for="(z, k) in questionList" :key="k" class="formWrap">
              <!-- 简答题 -->
              <el-form-item v-if="z.type == 'short_answer'" :prop="z.questionId">
                <div slot="label" class="label-box">
                  <span class="label-box-title">{{ k + 1 + '.' + z.content }}</span>
                  <span class="label-box-type">【简答题】</span>
                </div>
                <el-input v-model="questionnaireForm[z.questionId]"></el-input>
              </el-form-item>
              <!-- 单选题 -->
              <el-form-item v-else-if="z.type == 'single_choice'" :prop="z.questionId">
                <div slot="label" class="label-box">
                  <span class="label-box-title">{{ k + 1 + '.' + z.content }}</span>
                  <span class="label-box-type">【单选题】</span>
                </div>
                <el-radio-group v-model="questionnaireForm[z.questionId]">
                  <el-radio v-for="(v, i) in z.optionCpList" :key="i" :label="v.content">{{
                    v.content
                  }}</el-radio>
                </el-radio-group>
              </el-form-item>
              <!-- 多选题 -->
              <el-form-item v-else-if="z.type == 'multi_choice'" :prop="z.questionId">
                <div slot="label" class="label-box">
                  <span class="label-box-title">{{ k + 1 + '.' + z.content }}</span>
                  <span class="label-box-type">【多选题】</span>
                  <span class="label-box-tip">最少可选{{ z.multiMin }},最多可选{{ z.multiMax }}项</span>
                </div>
                <el-checkbox-group
                  v-model="questionnaireForm[z.questionId]"
                  :min="z.multiMin"
                  :max="z.multiMax"
                >
                  <el-checkbox
                    v-for="(v, i) in z.optionCpList"
                    :key="i"
                    :label="v.content"
                    style="display: block"
                  >{{ v.content }}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <!-- 提交按钮 -->
        <div class="submitBtn">
          <el-button type="primary" size="medium" :disabled="submitDisabled" @click="submitForm">提交问卷</el-button>
        </div>
      </div>
    </template>
    <!-- 提交成功占位图 -->
    <div v-else class="container" style="text-align: center; padding: 125px 0 300px; margin-top: 0">
      <el-image
        :src="require('@/assets/images/success.svg')"
        style="width: 134px; height: 134px"
      ></el-image>
      <p class="tip" style="font-size: 16px; margin: 30px 0">问卷提交成功，感谢您的参与</p>
      <router-link :to="{ path: '/myTask/myLearn' }">
        <el-button type="primary" size="medium">返回列表</el-button>
      </router-link>
    </div>
  </div>
</template>

<script>
import { questionnaireSurvey, submitQuestionnaire } from '@/api/myTask'
export default {
  name: 'FillQuestionnaire',
  data() {
    return {
      loading: false,
      questionnaireTemp: {},
      questionnaireForm: {},
      questionnaireRules: {},
      questionList: [],
      isSuccess: false, // 是否提交成功
      submitDisabled: false
    }
  },
  computed: {
    //   答题总数量
    questionNum: function() {
      let num = 0
      this.questionList.map((v) => {
        if (v.status) num += 1
      })
      return num
    },
    // 已答题目数量
    answeredNum: function() {
      let num = 0
      this.questionList.map((v) => {
        if (v.status && this.questionnaireForm[v.questionId].length) num += 1
      })
      return num
    },
    // 计算百分比
    toPercent: function() {
      return this.questionNum
        ? Math.round((this.answeredNum / this.questionNum) * 10000) / 100
        : 100
    }
  },
  created() {
    this.initQuestionnaireSurvey()
  },
  activated() {
    this.isSuccess = false
  },
  methods: {
    formatProgress() {
      return `${this.answeredNum}/${this.questionNum}`
    },
    // 初始化数据
    async initQuestionnaireSurvey() {
      this.loading = true
      let params = { asqPlanId: this.$route.query.asqPlanId }
      await questionnaireSurvey(params)
        .then((res) => {
          this.questionnaireTemp = res
          this.questionList = this.questionnaireTemp.questionCpList
          let cloneTemp = {}
          this.questionList.map((v) => {
            cloneTemp[v.questionId] = ''
            //   单选取第一个值为默认值
            //   if (v.type == 'single_choice') cloneTemp[v.questionId] = v.optionCpList[0].value
            //   多选返回一个空数组
            if (v.type == 'multi_choice') cloneTemp[v.questionId] = []
            this.questionnaireRules[v.questionId] = [
              {
                required: !!v.status,
                message: '请填写答案',
                trigger: v.type == 'short_answer' ? 'blur' : 'change'
              }
            ]
          })
          this.questionnaireForm = cloneTemp
        })
        .catch(() => {
          this.submitDisabled = true
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 提交表单
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // 处理问卷提交参数
          let params = {
            subjectCpId: this.questionnaireTemp.subjectCpId,
            mySubjectCpId: this.questionnaireTemp.mySubjectCpId,
            questionList: []
          }
          for (let key in this.questionnaireForm) {
            let temp = Array.isArray(this.questionnaireForm[key])
              ? this.questionnaireForm[key].join(',')
              : this.questionnaireForm[key]
            params.questionList.push({
              questionId: key,
              answerUser: temp
            })
          }
          // 非填题未答提示
          let topic = false
          for (let i = 0; i < this.questionList.length; i++) {
            if (
              !this.questionList[i].status &&
              !this.questionnaireForm[this.questionList[i].questionId].length
            ) {
              topic = true
              break
            }
          }
          // topic为true代表非填题未答,为false代表正常提交
          this.$confirm(
            topic
              ? '你还有非必填题目未填写，是否继续提交问卷？'
              : '确认提交吗，提交之后不可再修改。',
            '提示',
            {
              confirmButtonText: '提交问卷',
              cancelButtonText: topic ? '继续填写' : '取消',
              type: 'warning'
            }
          ).then(async () => {
            this.loading = true
            await submitQuestionnaire(params).then(() => {
              this.isSuccess = true
              this.loading = false
            })
          })
        } else {
          // 必填题没有答完提示
          let noAnswer = []
          this.questionList.map((v, i) => {
            if (v.status && !this.questionnaireForm[v.questionId].length)
              noAnswer.push(`第${i + 1}道`)
          })
          this.$confirm(`${noAnswer.join('、')}试题未填写,暂时无法提交`, '提示', {
            confirmButtonText: '继续填写',
            showCancelButton: false,
            type: 'warning'
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.fillQuestionnaire {
  /deep/ .el-progress-bar {
    margin-right: -70px;
    padding-right: 70px;
  }
  .container {
    background: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
    border-radius: 4px;
    margin-top: 20px;
    padding: 24px;
    .title {
      margin: 0;
      text-align: center;
      font-size: 16px;
      color: rgba(0, 11, 21, 0.85);
    }
    .subtitle {
      text-align: center;
      font-size: 12px;
      color: rgba(0, 11, 21, 0.25);
    }
    /deep/ .el-form-item__label {
      float: none;
    }
    /deep/ .el-radio-group {
      width: 100%;
      .el-radio {
        display: block;
        line-height: 40px;
      }
    }
    .submitBtn {
      text-align: center;
    }
    .label-box {
      text-align: left;
      display: inline-block;
      width: 1130px;
      vertical-align: top;
      margin-top: -3px;
      &-title {
        color: #000;
        font-weight: bold;
      }
      &-type {
        font-size: 13px;
        margin-left: 6px;
        color: rgba(0, 11, 21, 0.5);
      }
      &-tip {
        font-size: 12px;
        margin-left: 6px;
        color: rgba(0, 11, 21, 0.5);
      }
    }
  }
}
</style>
