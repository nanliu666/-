<template>
  <div v-loading="loading" class="annualDetails">
    <!-- 面包屑 -->
    <page-header
      v-if="!applyDetail"
      :title="annualDetails.year + '年度培训计划'"
      show-back
      :back="goBack"
    >
      <div v-if="!development" slot="rightMenu">
        <el-button
          v-if="annualDetails.status == '1'"
          type="primary"
          size="medium"
          @click="changePlan"
        >
          变更
        </el-button>
        <el-button
          v-if="
            annualDetails.status == '4' ||
              annualDetails.status == '5' ||
              annualDetails.status == '1' ||
              annualDetails.status == '3'
          "
          size="medium"
          @click="deletePlan"
        >
          删除
        </el-button>
      </div>
    </page-header>
    <basic-container block>
      <div v-if="applyDetail" class="planTitle">
        <div>计划名称</div>
        <div class="planTitle2">{{ annualDetails.year + '年度培训计划' }}</div>
      </div>
      <div
        v-if="applyDetail&&annualDetails.status==2"
        class="planTitle"
      >
        <div>变更理由</div>
        <div class="planTitle2">
          {{ annualDetails.changeReason }}
        </div>
      </div>
      <div
        v-if="applyDetail&&annualDetails.status==7"
        class="planTitle"
      >        
        <div class="planTitle2 el-icon-warning">
          审批通过后，培训计划的内容将会全部删除
        </div>
      </div>
      <div>计划子项安排</div>
      <!-- 数据表格 -->
      <el-table ref="mutilTable" :data="annualDetails.details" style="margin-top: 20px">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline>
              <el-form-item label="培训目标">
                <span>{{ props.row.target }}</span>
              </el-form-item>
              <el-form-item label="培训内容">
                <span>{{ props.row.content }}</span>
              </el-form-item>
              <el-form-item label="预算说明">
                <span v-for="(item, index) in props.row.budgets" :key="index">{{
                  item.remark + '/' + item.budget + '元;'
                }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="序号" type="index" width="80">
          <template slot-scope="scope">
            {{ scope.$index >= 9 ? scope.$index + 1 : '0' + (scope.$index + 1) }}
          </template>
        </el-table-column>
        <el-table-column label="培训项目" prop="trainProject" show-overflow-tooltip>
          <template slot-scope="scope">            
            {{ scope.row.trainProject }}           
          </template>
        </el-table-column>
        <el-table-column
          v-if="!development"
          label="计划性质"
          prop="planFeature"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ planFeatureTemp[scope.row.planFeature] }}
          </template>
        </el-table-column>
        <el-table-column label="培训对象" prop="trainObject" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="培训人数" prop="traineeNum" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="项目数量" prop="sessions" show-overflow-tooltip> </el-table-column>
        <el-table-column label="费用预算（元）" prop="costBudget" show-overflow-tooltip width="120">
          <template slot-scope="scope">
            {{ totalAmount(scope.row.budgets) }}
          </template>
        </el-table-column>
        <el-table-column label="培训日期" prop="trainingDate" show-overflow-tooltip>
          <template slot-scope="scope">
            {{
              scope.row.trainEnd
                ? scope.row.trainStart + '月-' + scope.row.trainEnd + '月'
                : scope.row.trainStart + '月'
            }}
          </template>
        </el-table-column>
        <el-table-column label="培训类型" prop="trainType" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ trainTypeTemp[scope.row.trainType] }}
          </template>
        </el-table-column>
        <el-table-column label="培训方式" prop="trainMode" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ trainModeTemp[scope.row.trainMode] }}
          </template>
        </el-table-column>
      </el-table>
    </basic-container>
  </div>
</template>

<script>
import { getTrainPlanAppr, getTrainPlanPre, deleteTrainPlan } from '@/api/trainingPlan/trainingPlan'
export default {
  name: 'AnnualDetails',
  props: {
    applyDetail: {
      type: Object,
      default:()=>{}
    }
  },
  data() {
    return {
      loading: false,
      annualDetails: {}, // 培训计划详情
      trainTypeTemp: {
        // 培训类型
        1: '内部培训',
        2: '外购培训',
        3: '外派培训'
      },
      trainModeTemp: {
        // 培训方式
        1: '线上培训',
        2: '线下培训',
        3: '混合培训'
      },
      planFeatureTemp: {
        //   计划性质
        0: '新增',
        1: '计划中',
        2: '已取消'
      },
      development: false // 判断是培训上报还是培训制定
    }
  },
  watch: {
    applyDetail() {
      this.initData()
    },
    $route: {
      handler() {
        this.initData()
        // if (newVal.query.planId) {
        //   this.planId = this.applyDetail&&this.applyDetail.formId?this.applyDetail.formId:this.$route.query.planId
        //   if (newVal.query.development) {
        //     this.development = true
        //     this.getTrainPlanPre()
        //   } else {
        //     this.development = false
        //     this.getTrainPlan()
        //   }
        // }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    initData() {
      var route = this.$route
      this.planId =
        this.applyDetail && this.applyDetail.formId ? this.applyDetail.formId : route.query.planId
      this.apprNo = this.applyDetail.apprNo 
      if (this.planId) {
        if (route.query.development) {
          this.development = true
          this.getTrainPlanPre()
        } else {
          this.development = false
          this.getTrainPlan()
        }
      }
    },
    goBack() {
      this.$router.back(-1)
    },
    // 计算总金额
    totalAmount(budgets) {
      let total = 0
      if (budgets.length) {
        budgets.map((v) => {
          total += parseInt(v.budget)
        })
      }
      return total
    },
    // 获取培训计划查看详情
    async getTrainPlan() {
      this.loading = true
      await getTrainPlanAppr({ planId: this.applyDetail.formData, apprNo: this.apprNo})
        .then((res) => {
          this.annualDetails = res
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 获取培训计划制定详情
    async getTrainPlanPre() {
      this.loading = true
      await getTrainPlanPre({ planId: this.planId })
        .then((res) => {
          this.annualDetails = res
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 跳转到子计划项
    goChildScheme(row) {
      this.$router.push({
        path: '/trainingPlan/components/viewPlanSubitems',
        query: { id: row.id, year: this.annualDetails.year, development: this.development || '' }
      })
    },
    // 变更计划
    changePlan() {
      this.$router.push({
        path: '/trainingPlan/components/createPlan',
        query: { planId: this.annualDetails.id, isTranslate: true }
      })
    },
    // 删除计划
    deletePlan() {
      // 计划状态,0-审核中 1-执行中 2-变更中 3-已完成 4-未提交 5-已拒绝 6-待审核
      let tip = ''
      switch (this.annualDetails.status) {
        case 3:
        case 4:
        case 5:
          tip = '确认删除培训计划。'
          break
        case 1:
          tip = '删除后，将会进行审批流程，通过后所有计划内容将会消失，是否继续删除?'
          break
      }
      this.$confirm(tip, '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await deleteTrainPlan({ planId: this.annualDetails.id })
          .then(() => {
            this.$message.success('删除成功!')
            this.$router.push({
              path: '/trainingPlan/submission'
            })
          })
          .catch((err) => {
            this.$message.error('删除失败，请联系管理员，失败原因：' + err)
          })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.annualDetails .planTitle {
  padding-bottom: 20px;
}
.annualDetails .planTitle2 {
  padding-top: 10px;
  font-size: 16px;
}
.annualDetails {
  height: 100%;
  .basic-container--block {
    height: calc(100% - 170px);
    min-height: calc(100% - 170px);
  }
  .el-form {
    font-size: 0;
    /deep/ label {
      width: 90px;
      color: #99a9bf;
    }
    /deep/ .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 100%;
      .el-form-item__content {
        width: calc(100% - 90px);
      }
    }
  }
}
</style>
