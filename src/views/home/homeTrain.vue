<template>
  <div>
    <h3 class="LMTitle" style="padding-top:46px">
      <span class="span1">培训中心</span>
      <router-link to="/train/index">
        查看更多
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
          <div>
            <img class="img" :src="imgSrc(item)" alt="" />
            <div class="homeTrainTitle">
              <div class="title">
                {{ item.trainName }}
            </div>
            <div class="homeTrainText">
              <span>{{
                item.trainWay === 2
                  ? '面授培训'
                  : item.trainWay === 3
                    ? '混合培训'
                    : item.trainWay === 1
                      ? '在线培训'
                      : '外训'
              }}</span>
              <span class="line"></span>
              <span>{{ item.startTime | formate }}</span>
            </div>
            <div  class="homeTrainTextItem">

               <el-rate
               v-if="item.trainScope === 'inside'"
                    v-model="item.composite"
                    disabled
                    show-score
                    text-color="#72787E"
                    disabled-void-color="#ccc"
                    score-template="{value}"
                  ></el-rate>
                  <el-tooltip
                  v-else
                  class="item"
                  effect="dark"
                  :content="item.categoryName"
                  placement="top-start"
                  :disabled="item.categoryName.length < 10"
                >
                  <span>{{ item.categoryName }}</span>
                </el-tooltip>
              <!-- <span class="tag" v-if="item.knowledgeSystemName">{{ item.knowledgeSystemName }}</span> -->
            </div>
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
  filters:{
    getTrainWay(val){
      let type = {
        '1':'在线',
        '2':'面授',
        '3':'混合',
        '11':'在职',
        '12':'脱产',
        '13':'业余',
      }
      return  type[val]
    },
    formate(val){
      return val.toString().replace(/-/g,'/')
    }
  },
  methods: {
    imgSrc(data) {
        if (data.coverPic) return data.coverPic
        else if (data.trainWay === 1 && data.trainScope === 'inside')
          return require('@/assets/images/online.png')
        else if (data.trainWay === 2 && data.trainScope === 'inside')
          return require('@/assets/images/Offline.png')
        else if (data.trainWay === 3 && data.trainScope === 'inside')
          return require('@/assets/images/mixin.png')
        else if (data.trainWay === 4 && data.trainScope === 'outer')
          return require('@/assets/images/outTrain.png')
    },
    toTrainDetaill(item) {
      const { id: trainId, trainName: title, trainWay, userType } = item
      this.$router.push({
        path: '/train/detail',
        query: {
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
<style lang="scss" scoped>
  
</style>
