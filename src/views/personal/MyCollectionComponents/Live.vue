<template>
  <div class="Course">
    <ul> 
      <li v-for="(item, index) in list" :key="index"  :class="{'active':item.liveId===currentLive.liveId}" @mouseenter="showCancelCollection(item)" @mouseleave="closeCancelCollection(item)">
     
       

        <el-card :body-style="{ padding: '0px' }" class="card">
            <div class="item_live_imgBox" style="cursor: pointer" @click="goDetail(item)">
              <div class="watchnum">
                <img src="../../../assets/images/playicon.png" width="48" height="48" alt="">
                <span class="num"><i class="iconfont iconimage_icon_user"></i>{{item.viewersNumber || 0}}</span>
              </div>
              <img :src="item.coverImageUrl" class="image_live"  />
              <span v-if="item.status == 'live'" class="item_live_status">直播中</span>
              <!-- <span v-show="item.status == 'start'" class="item_live_status" style="color:#00B061">未开始</span> -->
              <span v-else class="item_live_status" style="color: #fcba00">未开始</span>
              <div
                v-show="item.status == 'live'"
                class="item_live_playButton"
                @click="goDetail(item)"
              >
                <span @click="goDetail(item)"></span>
              </div>
              <span v-show="item.status == 'live'" class="item_live_userNumber"><i class="el-icon-user"></i> {{ item.viewersNumber }}</span>
            </div>

            <div style="padding: 10px 14px; ">
              <h3 class="showText">{{ item.channelName }}</h3>
              <p class="department">{{ item.categoryName }}</p>
              <live-time-tips :item="item" />
              <div class="tag line-clamp1" v-if="item.knowledgeSystemName">{{item.knowledgeSystemName}}</div>
            </div>
             <div class="cancelcollection" @click="goDetail(item)" v-if="item.liveId===currentLive.liveId">
                <span class="star" @click.stop="Collection(item)">
                  <i class="iconfont iconoperating_ic_favorites"> </i>
                </span>
              </div>
          </el-card>

      </li>
    </ul>
    <div v-if="list.length<=0">
        <div  style="text-align: center">
          <img src="../../../assets/images/nodata.png" />
          <div class="btn" @click="goList">去收藏</div>
        </div>
      </div>
    <div class="page" v-else>
      <el-pagination
        :current-page="page.pageNo"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import{getCollectionLiveList,cancelCollect} from "@/api/live"
import LiveTimeTips from '@/views/live/components/LiveTimeTips'
export default {
  components:{
    LiveTimeTips
  },
  data() {
    return {
      currentLive: '',
      imgUrl: require('@/assets/images/required_bg.png'),
      totalNum: 0,
      list:[],
      page: {
        pageSize: 10,
        pageNo: 1
      }
    }
  },
  filters:{
    time(val){
      return val[0].replace(/-/g,'/')
    }
  },
  mounted(){
    this.loadCourseList()
  },
  methods: {
    goList(){
      this.$router.push({ path: '/live/list'})
    },
    // 跳转直播详情页
    goDetail(row) {
      if(row.invalid){
        this.$message({
          type:'info',
          message:'当前直播已失效'
        })
        return
      }
      this.$router.push({ path: '/live/Detail', query: { id: row.liveId } })
    },
    showCancelCollection(obj){
      this.currentLive = obj
    },
    closeCancelCollection(){
      this.currentLive = ''
    },
    Collection(obj) {
      this.$confirm('确定要取消收藏该课程吗？?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(res => {
          if(res==='confirm'){
            cancelCollect({
            liveId:obj.liveId,
            type:sessionStorage.getItem('role'),
          }).then(res=>{
              this.$message({
                type: 'success',
                message: '取消收藏成功!'
              })
              this.loadCourseList()
          })
          }
          
        })
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.loadCourseList()
    },
    handleCurrentChange(val) {
      this.page.pageNo = val
      this.loadCourseList()
    },
    loadCourseList() {
      getCollectionLiveList({
        ...this.page,
        devType:sessionStorage.getItem('role'),
      }).then(({totalNum,data})=>{
        this.list =  data
        this.totalNum = totalNum
      })
    }
  },
  
}
</script>

<style lang="scss" scoped>
.Course {
  
  ul {
   display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  width: 100%;
    li {
      width: 285px;
      margin-top: 20px;
      margin-right:20px;
      background-color: #fff;
      box-shadow: 0 2px 8px 0 rgba(0, 63, 161, 0.06);
      border-radius: 4px;
      position: relative;
      &:nth-child(3n) {
        margin-right: 0;
      }
      .card{
        border:none;
      .cancelcollection{
           position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,11,21,0.45);
            border-radius: 4px;
            display: flex;
            justify-content: center;
            align-items: center;
            .star{
              cursor: pointer;
              background: #FFFFFF;
              width: 44px;
              height: 44px;
              border-radius: 50%;
              padding-top: 8px;
              display: inline-block;
              text-align: center;
              .iconfont{
                font-size: 30px;
                color: #8C9195;
              }
            }
        }
      .tag {
          font-size: 12px;
          color: #878C90;
          text-align: center;
          padding: 1px 8px;
          background: #F5F5F6;
          border-radius: 4px;
          width: 90px;
          float: right;
          margin-top: 10px;
          margin-bottom: 14px;
        }
      .item_live_imgBox {
      position: relative;
      height: 166px;
      .watchnum{
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        justify-content: center;
        display: flex;
        align-items: center;
        .num{
          position: absolute;
          bottom: 9px;
          right: 9px;
          background: rgba(0,11,21,0.45);
          border-radius: 4px;
          padding: 3px 9px;
          color: #fff;
          .iconfont{
            font-size: 12px;
            margin-right: 5px;
          }
        }
      }
      .image_live{
        height: 166px;
        width: 100%;
      }
      .item_live_status {
        position: absolute;
        top: 10px;
        right: 20px;
        background: #fff;
        font-size: 12px;
        -webkit-transform: scale(0.9);
        padding: 5px 8px;
        border-radius: 3px;
        color: #2875D4;
      }
      .item_live_playButton {
        position: absolute;
        width: 48px;
        height: 48px;
        background: rgba(0, 0, 0, 0.5);
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        border-radius: 50%;
        span {
          position: absolute;
          width: 18px;
          height: 18px;
          top: 0;
          left: -10px;
          right: 0;
          bottom: 0;
          margin: auto;
          background-image: linear-gradient(-45deg, #fff 40%, transparent 40%);
          transform: rotate(-45deg);
        }
      }
      .item_live_userNumber {
        position: absolute;
        right: 10px;
        bottom: 10px;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 3px;
        color: #fff;
        padding: 3px 5px;
        font-size: 12px;
      }
    }
      }

      /* 一行否则出现省略号 */
      .line-clamp1 {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
   
    }
  }
  .btn{
        width: 100px;
        height: 40px;
        line-height: 40px;
        border-radius: 20px;
        color: #2875D4;
        border: 1px solid #2875D4;
        margin: auto;
        cursor: pointer;
    }
  .page {
    margin-top: 24px;
    text-align: right;
  }
}
</style>
