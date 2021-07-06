<template>
  <div class="fillQuestionnaire">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/" style="padding: 25px 0 20px">
      <el-breadcrumb-item :to="{ path: '/myTask/myLearn' }">学习</el-breadcrumb-item>
      <el-breadcrumb-item>调查问卷</el-breadcrumb-item>
    </el-breadcrumb>
    <template>
      <!-- 问卷进度 -->
      <el-card>
        <el-progress :percentage="100" :format="formatProgress" :stroke-width="12"></el-progress>
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
                <el-input v-model="questionnaireForm[z.questionId]" disabled></el-input>
              </el-form-item>
              <!-- 单选题 -->
              <el-form-item v-else-if="z.type == 'single_choice'" :prop="z.questionId">
                <div slot="label" class="label-box">
                  <span class="label-box-title">{{ k + 1 + '.' + z.content }}</span>
                  <span class="label-box-type">【单选题】</span>
                </div>
                <el-radio-group v-model="questionnaireForm[z.questionId]" disabled>
                  <el-radio v-for="(v, i) in z.optionCpList" :key="i" :label="v.questionOptionId">{{
                    v.content
                  }}</el-radio>
                </el-radio-group>
              </el-form-item>
              <!-- 多选题 -->
              <el-form-item v-else-if="z.type == 'multi_choice'" :prop="z.questionId">
                <div slot="label" class="label-box">
                  <span class="label-box-title">{{ k + 1 + '.' + z.content }}</span>
                  <span class="label-box-type">【多选题】</span>
                  <span class="label-box-tip"
                    >最少可选{{ z.multiMin }},最多可选{{ z.multiMax }}项</span
                  >
                </div>
                <el-checkbox-group v-model="questionnaireForm[z.questionId]" disabled>
                  <el-checkbox
                    v-for="(v, i) in z.optionCpList"
                    :key="i"
                    :label="v.questionOptionId"
                    style="display: block"
                    >{{ v.content }}</el-checkbox
                  >
                </el-checkbox-group>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <!-- 提交按钮 -->
        <!-- <div class="submitBtn">
          <el-button type="primary" size="medium" :disabled="true">提交问卷</el-button>
        </div> -->
      </div>
    </template>
  </div>
</template>

<script>
import { viewAnswer } from '@/api/myTask'
export default {
  name: 'CheckQuestionnaire',
  data() {
    return {
      loading: false,
      questionnaireTemp: {},
      questionnaireForm: {},
      questionnaireRules: {},
      questionList: []
    }
  },
  computed: {
    //   答题总数量
    questionNum: function () {
      let num = 0
      this.questionList.map((v) => {
        if (v.status) num += 1
      })
      return num
    }
  },
  activated() {
    this.initQuestionnaireSurvey()
  },
  methods: {
    formatProgress() {
      return `${this.questionNum}/${this.questionNum}`
    },
    // 初始化数据
    async initQuestionnaireSurvey() {
      this.loading = true
      let params = { subjectCpId: this.$route.query.subjectCpId }
      await viewAnswer(params)
        .then((res) => {
          this.questionnaireTemp = res
          this.questionList = this.questionnaireTemp.questionCpList
          let cloneTemp = {}
          this.questionList.map((v) => {
            if (v.type == 'multi_choice') {
              cloneTemp[v.questionId] = v.answerUser.split(',')
            } else cloneTemp[v.questionId] = v.answerUser
            this.questionnaireRules[v.questionId] = [
              {
                required: !!v.status,
                message: '请填写答案',
                trigger: v.type == 'short_answer' ? 'blur' : 'change'
              }
            ]
          })
          this.questionnaireForm = cloneTemp
          console.log(this.questionList)
          console.log(this.questionnaireForm)
        })
        .finally(() => {
          this.loading = false
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
