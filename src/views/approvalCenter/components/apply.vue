<template>
  <div class="apply">
    <div class="content">
      <div class="lists">
        <div class="list">
          <router-link to="/approvalCenter/outsideTraining">
            <span class="applyIcon applyIconS1"></span>
            <span class="title">
              外训报名申请
            </span>
          </router-link>
        </div>
        <div class="list">
          <router-link to="/approvalCenter/trainingNeeds">
            <span class="applyIcon applyIconS2"></span>
            <span class="title">
              培训需求申请
            </span>
          </router-link>
        </div>
        <div class="list">
          <router-link to="/approvalCenter/applyLeave">
            <span class="applyIcon applyIconS3"></span>
            <span class="title">
              培训请假申请
            </span>
          </router-link>
        </div>
      </div>
      <div class="lists">
        <div class="list">
          <router-link to="/approvalCenter/applyOutsideTrainBookbuilding">
            <span class="applyIcon applyIconS4"></span>
            <span class="title">
              外派培训申请
            </span>
          </router-link>
        </div>
        <div class="list">
          <router-link to="/approvalCenter/applyStudyDoctorate">
            <span class="applyIcon applyIconS5"></span>
            <span class="title">
              在职读博申请
            </span>
          </router-link>
        </div>
      </div>
      <div class="lists">
        <div class="list">
          <router-link to="/approvalCenter/applyTeacherIdentification">
            <span class="applyIcon applyIconS6"></span>
            <span class="title">
              讲师认证申请
            </span>
          </router-link>
        </div>
        <div class="list">
          <router-link to="/approvalCenter/applyTutorDenti">
            <span class="applyIcon applyIconS7"></span>
            <span class="title">
              导师认证申请
            </span>
          </router-link>
        </div>
        <div class="list">
          <router-link to="/approvalCenter/applyCourseDev">
            <span class="applyIcon applyIconS8"></span>
            <span class="title">
              课程开发申请
            </span>
          </router-link>
        </div>
      </div>
      <div class="lists" style="border:0">
        <div class="list">
          <router-link to="/approvalCenter/applyBuyTrain">
            <span class="applyIcon applyIconS9"></span>
            <span class="title">
              外购培训申请
            </span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Apply',
  data() {
    return {}
  }
}
</script>
<style scoped>
.apply {
  height: 100%;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
  border-radius: 4px;
}
.content {
  text-align: center;
  padding: 56px 0 0 0;
}
.content .lists {
  display: flex;
  flex-wrap: wrap;
  width: 845px;
  margin: auto;
  border-bottom: #eee dashed 1px;
  padding-bottom: 20px;
  margin: 0 auto 30px auto;
}
.content .list {
  text-align: center;
  width: 281px;
  justify-content: space-around;
  padding: 0 0 20px 0;
}
.content .applyIcon {
  display: block;
  width: 80px;
  height: 80px;
  background: url(/img/applyIcon.png) no-repeat;
  margin: auto;
}
.content .applyIconS2 {
  background-position: -80px 0;
}
.content .applyIconS3 {
  background-position: -160px 0;
}
.content .applyIconS4 {
  background-position: -240px 0;
}
.content .applyIconS5 {
  background-position: 0px -80px;
}
.content .applyIconS6 {
  background-position: -80px -80px;
}
.content .applyIconS7 {
  background-position: -160px -80px;
}
.content .applyIconS8 {
  background-position: -240px -80px;
}
.content .applyIconS9 {
  background-position: 0 -160px;
}
.content .title {
  font-size: 14px;
  padding: 14px 0 0 0;
  display: block;
}
</style>
