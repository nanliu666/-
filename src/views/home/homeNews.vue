<template>
  <div>
    <h3 class="LMTitle" style="padding-top:46px">
      <span class="span1">新闻中心</span>
      <router-link to="/news/list">
        查看更多
      </router-link>
    </h3>
    <div class="LModule">
      <div class="LModule2">
        <div v-for="(item,index) in newsListData" :key="item.id" class="homenews" @click="tonewsDetails(item,index)">
          <!-- <router-link :to="`/news/Details?id=${item.id}&hits=${item.hits}&isHot=1`"> -->
            <div class="homenewsImg">
              <img
                :src="item.picUrl"
                :onerror="errorImg"
                width="285"
                height="220"
                alt=""
              />
            </div>
            <div class="homenewsText">
              <span class="homenewsTitle">{{ item.title }}</span>
              <span class="hCWatchNumber iconeyeopen-outlined iconfont"><span class="num">{{ item.hits }}</span> <span class="time">{{ item.createTime | formate}}</span></span>
              
              <!-- <div class="livePerInfo">
                <span>{{ item.createTime }}</span>
              </div> -->
            </div>
          <!-- </router-link> -->
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
  filters:{
    formate(val){
      return val.toString().replace(/-/g,'/')
    }
  },
  data() {
    return {
      errorImg: 'this.src="' + require('@/assets/images/newsBg.png') + '"'
    }
  },
  methods:{
    tonewsDetails(row, index) {
      // this.$router.push({ path: '/pressDetails' })
      if (row.outsideLink && row.outsideLink.length > 0) {
        window.open(row.outsideLink)
        return
      }
      this.$router.push({
        path: '/news/Details',
        query: {
          id: row.id,
          hits: row.hits,
          index,
          total: this.total,
          isHot: this.pitch
        }
      })
    },
  }
}
</script>
<style lang="scss" scoped>

</style>
