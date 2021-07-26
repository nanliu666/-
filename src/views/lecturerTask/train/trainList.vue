<template>
  <div class="myRequiredList">
    <ul class="items">
      <li
        v-for="(item, index) in listData"
        :key="index"
        class="item"
        :class="{ complete: item.totalPrecent == 100 }"
        @click="goDetail(item)"
      >
        <div class="item_img">
          <img :src="returnimgFn(item.coverUrl)" :onerror="errorImg" />
          <span v-if="item.status == 1" class="span1">未开始</span>
          <span v-if="item.status == 2" class="span2">进行中</span>
          <span v-if="item.status == 3" class="span3">已结束</span>
        </div>

        <div class="item_title">
          {{ item.menuName }}
        </div>

        <div class="item_time">
          {{ showTrainWay(item.trainWay) }} &nbsp; | &nbsp;
          {{ `${showTime(item.startTime)} - ${showTime(item.endTime)}` }}
        </div>

        <div class="item_Rate">
          <el-rate
            v-model="item.composite"
            disabled
            show-score
            text-color="#ff9900"
            score-template="{value}分"
          >
          </el-rate>
          <span v-if="item.knowledgeSystemName" class="know"> {{ item.knowledgeSystemName }} </span>
        </div>

        <div v-if="item.totalPrecent == 100" class="item_complete">
          <img src="@/assets/images/my_seal.png" alt="" />
        </div>
      </li>
    </ul>

    <div v-if="total" class="page">
      <el-pagination
        :page-sizes="[10, 20, 30, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>

    <div v-else style="text-align: center">
      <img src="../../../assets/images/nodata.png" />
      <div>暂无数据</div>
    </div>
  </div>
</template>
<script>
import { queryTrainList } from '@/api/lecturerTask'
;('requiredCourseList')
export default {
  data() {
    return {
      valueRate: 4.5,
      total: 0,
      page: {
        pageNo: 1, //请求页码
        pageSize: 10 //每页条数
      },
      listData: [],
      errorImg: 'this.src="' + require('@/assets/images/required_bg.png') + '"'
    }
  },
  created() {
    this.getmyCourseCatalog()
  },
  activated() {
    // this.getmyCourseCatalog()
  },
  methods: {
    showTime(tade) {
      let time = tade.split(' ')
      return time[0]
    },
    showTrainWay(i) {
      let WAY = {
        1: '在线',
        2: '面授',
        3: '混合'
      }
      return WAY[i]
    },
    returnimgFn(img) {
      return img || require('@/assets/images/required_bg.png')
    },
    // 跳转详情页
    goDetail(item) {
      // item.trainScope 内训inside,外训outer
      if (item.trainScope == 'inside') {
        this.$router.push({ path: '/InternalTraining', query: { id: item.id } })
        // this.$router.push({ path: '/ExternalTraining', query: { id: item.id } }) // 内训
      } else if (item.trainScope == 'outer') {
        this.$router.push({ path: '/ExternalTraining', query: { id: item.id } }) //外训
      }
    },
    async getmyCourseCatalog() {
      let params = {
        ...this.page
      }

      let res = await queryTrainList(params)
      this.listData = res.data
      this.total = res.totalNum
    },

    handleSizeChange(val) {
      this.page.pageNo = 1
      this.page.pageSize = val
      this.getmyCourseCatalog()
    },
    handleCurrentChange(val) {
      this.page.pageNo = val
      this.getmyCourseCatalog()
    }
  }
}
</script>

<style scoped lang="scss">
.myRequiredList {
  margin: 25px 0;
  padding-bottom: 25px;
  background-color: #f9fafa;
  .items {
    display: flex;
    flex-wrap: wrap;
    .item {
      flex-direction: 0;
      width: 285px;
      height: 282px;
      border-radius: 4px;
      overflow: hidden;
      box-shadow: 0 2px 8px 0 rgba(0, 63, 161, 0.06);
      transition-duration: 0.3s;
      margin-bottom: 20px;
      margin-right: 20px;
      position: relative;
      cursor: pointer;
      &:nth-of-type(4n) {
        margin-right: 0;
      }
      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 20px 0 rgba(0, 63, 112, 0.12);
        .card-cover {
          visibility: visible !important;
        }
      }
      &_img {
        width: 100%;
        height: 172px;
        position: relative;
        img {
          width: 100%;
          height: 100%;
        }
        .span1 {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 52px;
          height: 20px;
          font-size: 12px;
          text-align: center;
          line-height: 22px;
          font-weight: 400;
          border-radius: 4px;
          font-style: none;
          color: #f5c200;
          background-color: #fffee6;
        }
        .span2 {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 52px;
          height: 20px;
          font-size: 12px;
          text-align: center;
          line-height: 22px;
          font-weight: 400;
          border-radius: 4px;
          font-style: none;
          color: #2875d4;
          background-color: #f0f9ff;
        }
        .span3 {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 52px;
          height: 20px;
          font-size: 12px;
          text-align: center;
          line-height: 22px;
          font-weight: 400;
          border-radius: 4px;
          font-style: none;
          color: rgba(0, 11, 21, 0.45);
          background-color: #f5f5f6;
        }
      }
      &_title {
        width: 100%;
        padding: 16px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #000b15;
        font-weight: bold;
        overflow: hidden;
        text-overflow: ellipsis;
        -o-text-overflow: ellipsis;
        white-space: nowrap;
      }
      &_time {
        padding: 3px 16px;
        opacity: 0.65;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #000b15;
        // border-bottom: 1px solid #ebeced;
        margin-top: -10px;
        line-height: 28px;
      }
      &_Rate {
        display: flex;
        justify-content: space-between;
        padding: 4px 16px;
        .know {
          font-size: 12px;
          background-color: #f2f2f2;
          padding: 3px 10px;
          border-radius: 4px;
          color: #999999;
        }
      }
      &_complete {
        position: absolute;
        bottom: 5px;
        right: 9px;
        overflow: hidden;
        width: 62px;
        height: 62px;
        border-radius: 50%;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .page {
    height: 50px;
    position: relative;
    .pagination {
      position: absolute;
      right: 24px;
      bottom: 0px;
    }
  }
  .complete {
    opacity: 0.6;
  }
}
</style>
