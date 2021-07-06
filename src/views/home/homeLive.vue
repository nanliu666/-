<template>
  <div>
    <h3 class="LMTitle" style="padding-top:52px">
      <span class="span1">最新直播</span>
      <router-link :to="{ path: '/live/list' }">
        查看更多
      </router-link>
    </h3>
    <div class="LModule">
      <div class="LModule2">
        <div v-for="item in myLiveData" :key="item.liveId" class="homeCourse">
          <router-link :to="{ path: '/live/Detail', query: { id: item.liveId } }">
            <div class="adiv">
              <span class="liveicon "><i class="play"></i><span :class="['state', item.type == 1 ? 'live' : 'end']">{{
                item.status | getLiveStatus
              }}</span><span class="livenum"><i class="iconfont iconimage_icon_user"></i>{{ item.viewersNumber || 0 }}</span></span>
              <img
                class="img"
                width="285"
                height="166"
                :src="item.coverImageUrl ? item.coverImageUrl : '/img/autoL.png'"
                alt=""
              />
              <div class="homeTrainTitle">
                <div class="title">
                  {{ item.channelName }}
                </div>
                <div class="homeTrainText">
                  <span>{{ item.lecturerName }}</span>
                </div>
                <div class=" homeTrainTextItem">
                  <!-- <span>{{ item.lecturerName}}</span>
              <span class="line"></span> -->
                  <span>{{ item.planTime[0] }}</span>
                  <!-- <span class="tag" v-if="item.knowledgeSystemName">{{ item.knowledgeSystemName }}</span> -->
                </div>
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
  filters: {
    getLiveStatus(val) {
      return val === 'end' ? '未开始' : '直播中'
    }
  },
  props: {
    myLiveData: {
      type: Array,
      default: () => []
    }
  }
}
</script>
<style lang="scss" scoped>
.liveicon {
  position: absolute;
  top: 0;
  width: 285px;
  height: 166px;
  display: flex;
  justify-content: center;
  align-items: center;
  .play {
    width: 48px;
    height: 48px;
    display: inline-block;
    background: url('../../assets/images/playicon.png');
  }
  .state {
    position: absolute;
    top: 9px;
    right: 9px;
    font-size: 12px;
    color: #2875d4;
    text-align: center;
    padding: 2px 7px;
    background: #eaf8ff;
    border-radius: 4px;
  }
  .live {
    color: #2875d4;
    background: #eaf8ff;
  }
  .end {
    color: rgba(0, 11, 21, 0.45);
    background: #f5f5f6;
  }
  .livenum {
    background: rgba(0, 11, 21, 0.45);
    border-radius: 4px;
    padding: 3px 9px;
    color: #fff;
    font-size: 12px;
    position: absolute;
    bottom: 9px;
    right: 9px;
    .iconfont {
      font-size: 12px;
      margin-right: 7px;
    }
  }
}
</style>
