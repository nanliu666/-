<template>
  <div>
    <h3 class="LMTitle" style="padding-top:46px">
      <span class="span1">新闻中心</span>
      <router-link to="/news/list">
        更多
      </router-link>
    </h3>
    <div class="LModule">
      <div class="LModule2">
        <div v-for="item in newsListData" :key="item.id" class="homeCourse">
          <router-link :to="`/news/Details?id=${item.id}&hits=${item.hits}&isHot=1`">
            <div class="homeCourseImg">
              <!-- <img
                :src="item.picUrl ? item.picUrl : '/img/autoL.png'"
                width="285"
                height="168"
                alt=""
              /> -->
              <img
                :src="item.picUrl"
                :onerror="errorImg"
                width="285"
                height="168"
                alt=""
              />
            </div>
            <div class="homeCourseText">
              <span class="homeCourseTitle">{{ item.title }}</span>
              <span class="hCWatchNumber iconeyeopen-outlined iconfont">{{ item.hits }}</span>
              <div class="livePerInfo">
                <span>{{ item.createTime }}</span>
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
  name: 'HomeNews',
  props: {
    newsListData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      errorImg: 'this.src="' + require('@/assets/images/newsBg.png') + '"'
    }
  },
}
</script>
<style lang="scss" scoped></style>
