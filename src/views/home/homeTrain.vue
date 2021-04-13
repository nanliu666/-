<template>
  <div>
    <h3 class="LMTitle" style="padding-top:46px">
      <span class="span1">培训中心</span>
      <router-link to="/train/index">
        更多
      </router-link>
    </h3>
    <div class="LModule">
      <div class="LModule2">
        <div
          v-for="item in trainListData"
          :key="item.id"
          class="homeTrain"
          @click="toTrainDetaill(item)"
        >
          <h3 class="homeTrainTitle">
            <span>{{ item.trainName }}</span>
          </h3>
          <div class="homeTrainText">
            <div class="homeTrainTextItem">
              <!-- <span class="iconimage_icon_time iconfont traingIcon"></span> -->
              <span class="homeTrainTextItem2">时间：{{ item.startTime }}</span>
            </div>
            <div class="homeTrainTextItem">
              <!-- <span class="iconimage_icon_address iconfont traingIcon"></span> -->
              <span class="homeTrainTextItem2">地址：{{ item.address }}</span>
            </div>
            <div class="homeTrainTextItem">
              <!-- <img
                    :src="item.avatarUrl ? item.avatarUrl : '/img/userIconBig.png'"
                    width="24"
                    height="24"
                    alt=""
                  /> -->
              <span class="homeTrainTextItem2">讲师：{{ item.lecturerName }}</span>
              <!-- <span
                    :class="[item.status ? trainStatus[item.status].class : '', homeTraining]"
                  >{{ trainStatus[item.status].text }}</span> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'HomeTrain',
  props: {
    trainListData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  methods: {
    toTrainDetaill(item) {
      // 调转到培训详情
      const { id: trainId, trainName: title, trainWay, userType } = item
      this.$router.push({
        name: 'trainDetail',
        params: {
          title,
          trainId,
          trainWay,
          userType
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped></style>
