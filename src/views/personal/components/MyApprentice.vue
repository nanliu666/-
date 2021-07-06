<template>
  <div class="MyApprentice">
    <el-tabs v-model="activeName">
      <el-tab-pane label="我的得分" name="first"> <MyScore></MyScore> </el-tab-pane>
      <el-tab-pane label="评价徒弟" name="second"><EvaluationApprentices></EvaluationApprentices></el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import MyScore from './MyScore'
import EvaluationApprentices from './EvaluationApprentices'
import { tutorDetail, studentList } from '@/api/personal'
export default {
  components: {
    MyScore,
    EvaluationApprentices
  },
  data() {
    return {
      activeName: 'first',
      detailData: ''
    }
  },

  created() {
    this.istutorDetail()
  },
  activated() {
    this.istutorDetail()
  },
  methods: {
    async istutorDetail() {
      this.detailData = await tutorDetail({ platFlag: 1 })
      this.isstudentList()
    },

    // 拿数据
    async isstudentList() {
      let dataObj = []
      if (this.detailData.idStr) {
        let params = {
          pageNo: 1,
          pageSize: 10,
          id: this.detailData.idStr,
          queryCondition: ''
        }
        let { data } = await studentList(params)

        dataObj = data
      }
      this.$emit('MyApprenticeSon', dataObj)
    }
  }
}
</script>

<style lang="scss" scoped>
.MyApprentice {
  background-color: #fff;
  box-shadow: 0 2px 8px 0 rgba(0, 63, 161, 0.06);
  padding: 24px;
}
</style>
