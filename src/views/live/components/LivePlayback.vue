<template>
  <div class="PlayBackListSingleC">
    <div>
      <div v-for="item in playBackListData" :key="item.id" class="PBLS" @click="toPlay">
        <div class="img">
          <img
            :src="item.coverImageUrl ? item.coverImageUrl : '/img/autol.png'"
            alt=""
            width="210"
            height="118"
          />
          <div class="header__play"><span class="play-icon"></span></div>
          <div class="playback">直播回放</div>
          <div class="amount-play">
            <i class="el-icon-video-camera-solid"></i>{{ formatNumber(item.people || 0) }}
          </div>
        </div>
        <div class="text">
          <h3>直播回放：{{ item.channelName }}</h3>
          <span><span class="live-label">直播分类：</span>{{ item.fullName }}</span>
          <span><span class="live-label">讲师：</span>{{ item.lecturerName }}</span>
          <span><span class="live-label">直播时间：</span>{{ item.startTime }}</span>
        </div>
        <div class="operation">
          <span v-if="item.shelfStatus == '1' && identityType == '1'" @click.stop="repRelease(item)">发布</span>
          <span
            v-if="item.shelfStatus == '0' && identityType == '1'"
            @click.stop="repOffShelf(item)"
          >下架</span>
          <!-- <span @click.stop="repDownload(item)">下载</span> -->
          <span
            v-if="item.lecturerDeleted == '0' && identityType == '1'"
            @click.stop="repDelete(item)"
          >删除</span>
        </div>
      </div>
    </div>
    <div v-if="PBLPageObj.totalNum" class="pagePbls">
      <el-pagination
        background
        :page-sizes="PBLPageObj.pageSizes"
        :page-size="5"
        :current-page="PBLPageObj.currentPage"
        layout="total, sizes, prev, pager, next, jumper"
        :total="PBLPageObj.totalNum"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 无数据 -->
    <common-empty v-else />
  </div>
</template>
<script>
import CommonEmpty from '@/components/common-empty/Empty'
import { liveReplayList, setReplayStatus } from '@/api/live'
export default {
  name: 'PlayBackListSingle',
  // computed: {
  //   liveId() {
  //     return _.get(this.$route, 'query.id', '555')
  //   }
  // },
  components: { CommonEmpty },
  props: ['detailData'],
  data() {
    return {
      playBackListData: [],
      rePlayData: {},
      PBLParmas: {
        sourceType: '2',
        livePlanId: _.get(this.$route, 'query.id', '11358435434386543'), //this.$route.query.id,
        pageNo: 1,
        pageSize: 5
      },
      PBLPageObj: {
        pageSizes: [5, 10],
        currentPage: 0,
        totalNum: 0
      },
      identityType: ''
    }
  },
  activated() {
    this.initPlayBackData()
  },
  methods: {
    toPlay() {
      // 调整到视频播放
      this.$router.push({
        path: 'replay',
        query: {
          id: this.PBLParmas.livePlanId
        }
      })
    },
    repRecover(item) {
      // 恢复
      let sendPar = { videoId: item.id.toString(), lecturerDeleted: '0' }
      setReplayStatus(sendPar).then(() => {
        this.initPlayBackData()
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      })
    },
    repRelease(item) {
      // 发布
      let sendPar = { videoId: item.id.toString(), shelfStatus: '0' }
      setReplayStatus(sendPar).then(() => {
        this.initPlayBackData()
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      })
    },
    repDownload(item) {
      // 下载
      if (item.localUrl) {
        window.open(item.localUrl)
      } else {
        this.$message({
          message: '没有视频文件',
          type: 'error'
        })
      }
    },
    repDelete(item) {
      // 删除,上下架状态：0-上架，1-下架
      let sendPar = { videoId: item.id.toString(), lecturerDeleted: '1' }
      let tip = ''
      if (item.shelfStatus) tip = '您确定要删除该直播回放吗？'
      else tip = '该直播回放已发布，删除后学员将不可见，您确定要删除该直播回放吗'
      this.$confirm(tip, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        setReplayStatus(sendPar).then(() => {
          this.initPlayBackData()
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        })
      })
    },
    repOffShelf(item) {
      // 下架
      let sendPar = { videoId: item.id.toString(), shelfStatus: '1' }
      setReplayStatus(sendPar).then(() => {
        this.initPlayBackData()
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      })
    },
    initPlayBackData() {
      // 初始化直播回放列表
      liveReplayList(this.PBLParmas).then((res) => {
        let { data, totalNum, totalPage } = (this.rePlayData = res.result)
        this.identityType = res.identityType
        this.playBackListData = data
        this.PBLPageObj.totalNum = totalNum
        this.PBLPageObj.totalPage = totalPage
        console.log(this.rePlayData)
      })
    },
    handleSizeChange(val) {
      // 改变分页回调
      this.PBLParmas.pageSize = val
      this.initPlayBackData()
    },
    handleCurrentChange(val) {
      // 改变每页显示条数回调
      this.PBLParmas.pageNo = val
      this.initPlayBackData()
    },
    formatNumber(num) {
      num = Number(num)
      if (num == 0) {
        return 0
      } else if (num >= 1 && num < 10000) {
        return num
      } else {
        return (num / 10000).toFixed(2) + '万'
      }
    }
  }
}
</script>
<style scoped lang="scss">
.PlayBackListSingleC {
  background: #fff;
  padding-top: 23px;
}
.PBLS {
  display: flex;
  height: 124px;
  margin: 0 0 40px 0;
  .header__play {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 48px;
    height: 48px;
    background: rgba(0, 11, 21, 0.45);
    border-radius: 100%;
    margin-left: -24px;
    margin-top: -24px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    cursor: pointer;
    .play-icon {
      width: 0;
      height: 0;
      margin-left: 8px;
      border-top: 10px solid transparent;
      border-left: 20px solid #ffffff;
      border-bottom: 10px solid transparent;
    }
  }
  .playback {
    background: #fffee6;
    position: absolute;
    color: #f6ca21;
    right: 8px;
    top: 8px;
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 5px;
  }
  .amount-play {
    font-size: 12px;
    position: absolute;
    right: 10px;
    bottom: 10px;
  }
}
.PBLS .img {
  position: relative;
  width: 210px;
  cursor: pointer;
  border-radius: 4px;
}
.PBLS .text {
  flex: 1;
  padding: 0 20px 0 27px;
  .live-label {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: rgba(0, 11, 21, 0.45);
    letter-spacing: 0;
    line-height: 18px;
    display: inline-block;
    width: 60px;
  }
}
.PBLS .text h3 {
  cursor: pointer;
  margin: 0;
  padding: 5px 0 15px 0;
  font-size: 14px;
  color: rgba(0, 11, 21, 0.85);
  letter-spacing: 0;
  line-height: 24px;
  font-weight: 600;
}
.PBLS .text span {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: rgba(0, 11, 21, 0.85);
  letter-spacing: 0;
  line-height: 23px;
  display: block;
}
.PBLS .operation {
  width: 300px;
  text-align: right;
}
.PBLS .operation span {
  color: #2875d4;
  font-size: 12px;
  padding: 2px 15px;
  border-right: solid 1px #ebeced;
  cursor: pointer;
}
.PBLS .operation span:last-child {
  border: 0;
}
.PlayBackListSingleC .pagePbls {
  float: right;
}
</style>
