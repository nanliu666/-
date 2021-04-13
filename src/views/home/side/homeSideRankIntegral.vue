<template>
  <div>
    <div class="ranking">
      <div class="homeRightTitle">
        <span>月度积分排行榜</span>
        <!-- <router-link to="">更多</router-link> -->
      </div>
      <div v-for="(item, i) in monthlyCreditData" :key="item.id" class="rankingItem">
        <div :class="['rankingIndex', 'rankingIndex' + i]">0{{ i + 1 }}</div>
        <div class="rankingImg">
          <img :src="item.url ? item.url : '/img/userIconBig.png'" width="40" height="40" alt="" />
        </div>
        <div class="rankingInfo">
          <span class="rankingInfo1">{{ item.name }}</span>
          <span class="rankingInfo2">{{ item.orgCode }}</span>
        </div>
        <div class="score">{{ item.monthlyScore }}分</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'HomeSideUserInfo',
  props: {
    monthlyCreditData: {
      type: Array,
      default: () => []
    }
  }
}
</script>
<style lang="scss" scoped></style>
