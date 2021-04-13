<template>
  <div>
    <div class="homePrivateInfo">
      <div class="homePrivateInfoImg">
        <img
          :src="homePInfoData.url ? homePInfoData.url : '/img/userIconBig.png'"
          width="80"
          height="80"
          alt=""
        />
      </div>
      <h3 class="homePrivateInfoName">
        {{ homePInfoData.name }}
      </h3>
      <span class="homePrivateInfoOrg">{{ homePInfoData.orgCode }}</span>
      <div class="privateInfoCredit">
        <div class="CreditItem">
          <span class="credit">{{ homePInfoData.totalScore }}</span>
          <span class="creditType">累计积分</span>
        </div>
        <div class="CreditItem">
          <span class="credit">{{ homePInfoData.totalPeriod }}</span>
          <span class="creditType">累计学时</span>
        </div>
        <div class="CreditItem">
          <span class="credit">{{ homePInfoData.monthlyScore }}</span>
          <span class="creditType">本月积分</span>
        </div>
        <div class="CreditItem">
          <span class="credit">{{ homePInfoData.monthlyPeriod }}</span>
          <span class="creditType">本月学时</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'HomeSideUserInfo',
  props: {
    homePInfoData: {
      type: Object,
      default() {
        return {}
      }
    }
  }
}
</script>
<style lang="scss" scoped></style>
