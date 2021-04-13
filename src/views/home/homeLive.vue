<template>
  <div>
    <h3 class="LMTitle" style="padding-top:52px">
      <span class="span1">最新直播</span>
      <router-link :to="{ path: '/live/list' }">
        更多
      </router-link>
    </h3>
    <div class="LModule">
      <div class="LModule2">
        <div v-for="item in myLiveData" :key="item.liveId" class="homeCourse">
          <router-link :to="{ path: '/live/Detail', query: { id: item.liveId } }">
            <div class="homeCourseImg">
              <img
                :src="item.coverImageUrl ? item.coverImageUrl : '/img/autoL.png'"
                width="285"
                height="168"
                alt=""
              />
            </div>
            <div class="homeCourseText">
              <span class="homeCourseTitle">{{ item.channelName }}</span>
              <span class="homeCourseTime" :title="item.planTime[0]">{{ item.planTime[0] }}</span>
              <div class="livePerInfo">
                <img
                  :src="item.avatarUrl ? item.avatarUrl : '/img/userIconBig.png'"
                  width="24"
                  height="24"
                  alt=""
                />
                <span>{{ item.lecturerName }}</span>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'HomeLive',
  props: {
    myLiveData: {
      type: Array,
      default: () => []
    }
  }
}
</script>
<style lang="scss" scoped></style>
