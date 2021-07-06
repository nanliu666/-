<template>
  <div class="tabs_box">
    <el-tabs v-model="activeName">
      <el-tab-pane :label="`必修课 (${numObj.RequiredListNum || 0})`" name="myRequiredList">
        <myRequiredList @RequiredListNumTotal="RequiredListNumSon"></myRequiredList>
      </el-tab-pane>
      <el-tab-pane :label="`培训 (${numObj.TrainListNum || 0})`" name="myTrainList">
        <myTrainList @TrainListNumTotal="TrainListNumSon"></myTrainList>
      </el-tab-pane>
      <el-tab-pane :label="`选修课`" name="myElectiveList">
        <!-- <el-tab-pane :label="`选修课 (${numObj.courseNumTotal || 0})`" name="myElectiveList"> -->
        <myElectiveList @ElectiveCourseNumTotal="ElectiveCourseNumTotal"></myElectiveList>
      </el-tab-pane>
      <el-tab-pane :label="`直播 (${numObj.LiveListNum || 0})`" name="myLiveList">
        <myLiveList></myLiveList>
        <!-- <myLiveList @LiveListNumTotal="LiveListNumSon"></myLiveList> -->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import myRequiredList from './myRequiredList'
import myTrainList from './myTrainList'
import myElectiveList from './myElectiveList'
import myLiveList from './myLiveList'
import { liveStudentNum } from '@/api/myTask'
export default {
  components: { myRequiredList, myTrainList, myElectiveList, myLiveList },
  data() {
    return {
      activeName: 'myRequiredList',
      numObj: {
        RequiredListNum: '',
        TrainListNum: '',
        LiveListNum: '',
        courseNumTotal: ''
      }
    }
  },
  activated() {
    this.activeName = _.get(this.$route, 'query.clickDataIn', 'myRequiredList')
  },
  created() {
    this.activeName = _.get(this.$route, 'query.clickDataIn', 'myRequiredList')
    this.LiveListNumSon()
  },
  methods: {
    RequiredListNumSon(i) {
      this.numObj.RequiredListNum = i
    },
    TrainListNumSon(i) {
      this.numObj.TrainListNum = i
    },
    async LiveListNumSon() {
      let { live, end } = await liveStudentNum()
      this.numObj.LiveListNum = live + end
    },
    ElectiveCourseNumTotal(i) {
      this.numObj.courseNumTotal = i
    }
  }
}
</script>

<style scoped lang="scss">
.tabs_box {
  box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
  border-radius: 4px;
  margin-top: 16px;
  padding: 24px 0;
}
/deep/.el-tabs__item {
  font-size: 16px;
}
::v-deep .el-tabs__nav-scroll {
  padding: 0 24px;
}
</style>
