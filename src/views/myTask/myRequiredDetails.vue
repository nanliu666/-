<template>
  <div class="myRequiredDetails">
    <section>
      <!-- 入口路径 -->
      <div class="entry_path">
        <p>
          <span class="common" @click="$router.go(-1)">学习 / </span><span class="especially">必修课详情</span>
        </p>
      </div>
      <!-- 必修课类别 -->
      <div class="sort">
        <div class="left">
          <img :src="detailParams.coverUrl" :onerror="errorImg" alt="" class="course_img" />
        </div>
        <div class="right">
          <ul class="info">
            <li>
              <span class="sort_title">{{ detailParams.menuName }}</span>
              <span v-if="detailParams.status == '1'" class="sort_status status_1">未开始</span>
              <span v-if="detailParams.status == '2'" class="sort_status status_2">进行中</span>
              <span v-if="detailParams.status == '3'" class="sort_status status_3">已结束</span>
            </li>
            <li>
              <ul class="middle">
                <li>
                  <span class="label"> 分类：</span>
                  <span class="middle_data">{{
                    detailParams.categoryName ? detailParams.categoryName : '--'
                  }}</span>
                </li>
                <li>
                  <span class="label"> 学习时间：</span>

                  <span class="middle_data">{{ detailParams.startDate }} - {{ detailParams.entDate }}</span>
                </li>
                <!-- <li>
                  <span class="label"> 主办单位：</span>
                  <span class="middle_data">{{
                    detailParams.sponsor ? detailParams.sponsor : '--'
                  }}</span>
                </li> -->
              </ul>
            </li>
            <li class="info_bottom">
              <span class="info_bottom_details"><i class="iconimage_icon_user iconfont iconInfo"></i>{{ detailParams.peopleNum ? detailParams.peopleNum : '--' }}</span>
              <span class="info_bottom_details"><i class="iconimage_icon_time1 iconfont iconInfo"></i>{{ detailParams.period ? detailParams.period + 'h' : '--' }}</span>
              <span class="info_bottom_details"><i class="iconjifen iconfont iconInfo"></i>{{ detailParams.credit ? detailParams.credit : '--' }}</span>
            </li>
          </ul>
        </div>
      </div>
      <!-- 课程分类 -->
      <div class="classification">
        <el-tabs v-model="activeName" class="content" @tab-click="handleSwitchCategories">
          <el-tab-pane v-for="tab in tabs" :key="tab.name" :label="tab.label" :name="tab.name" lazy>
            <my-required-details-list :data-info="processedData"></my-required-details-list>
          </el-tab-pane>
        </el-tabs>
        <!-- 页码 -->
        <div class="page">
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
      </div>
    </section>
  </div>
</template>

<script>
// import moment from 'moment'
import myRequiredDetailsList from './components/myRequiredDetailsList'
import { getRequireCourse } from '@/api/myTask'
import moment from 'moment'
const TABS_ARR = [
  {
    name: 'all_courses',
    label: '全部课程'
  },
  {
    name: 'unplayed',
    label: '未开始'
  },
  {
    name: 'underway',
    label: '进行中'
  },
  {
    name: 'finished',
    label: '已结束'
  }
]
export default {
  name: 'MyRequiredDetails',
  components: {
    myRequiredDetailsList
  },
  props: {},
  data() {
    return {
      activeName: 'all_courses',
      tabs: TABS_ARR,
      total: 0, //总条数
      page: {
        pageNo: 1, //请求页码
        pageSize: 10 //每页条数
      },
      detailParams: {}, // 接参数
      resData: [], // 请求接收回来的数据
      processedData: [], //处理后的数据
      errorImg: 'this.src="' + require('@/assets/images/required_bg.png') + '"'
    }
  },
  created() {
    this.detailParams = JSON.parse(this.$route.query.item)
    this.detailParams.startDate = moment(this.detailParams.startTime).format('yyyy-MM-DD')
    this.detailParams.entDate = moment(this.detailParams.endTime).format('yyyy-MM-DD')
    // console.log('params----', this.detailParams)
    this.getData()
  },
  methods: {
    // 处理数据
    handleProcessedData() {
      // console.log('handleProcessedData---')

      if (this.resData.length) {
        let temArr = []
        // debugger
        for (let i = 1; i <= this.resData.length; i++) {
          this.resData[i - 1].startDate = moment(this.resData[i - 1].startTime).format('yyyy-MM-DD')
          this.resData[i - 1].entDate = moment(this.resData[i - 1].endTime).format('yyyy-MM-DD')

          this.resData[i - 1].isShow = false
          temArr.push(this.resData[i - 1])
          // 处理数据4条数据为一组
          if (i % 4 == 0 || i == this.resData.length) {
            let index = parseInt(i / 4) - 1
            if (i == this.resData.length) {
              index = index + 1
            }
            let temObj = {
              index: index, //索引
              list: temArr,
              showExam: false
            }
            this.processedData.push(temObj)
            temArr = []
          }
        }
      }
    },
    // 切换类别
    handleSwitchCategories(tab) {
      let status = ''
      if (tab.name == 'unplayed') {
        status = 1
      } else if (tab.name == 'underway') {
        status = 2
      } else if (tab.name == 'finished') {
        status = 3
      }
      this.getData(status)
    },
    // 处理页码大小条数
    handleSizeChange(val) {
      // console.log('handleSizeChange')
      this.page.pageNo = 1
      this.page.pageSize = val
      this.getData()
    },
    // 当前页变动
    handleCurrentChange(val) {
      // console.log('handleCurrentChange')
      this.page.pageNo = val
      this.getData()
    },
    // 获取数据
    getData(status) {
      // console.log('getData')
      let params = {
        courseType: '0',
        id: this.detailParams.id,
        status: status || '', //状态（1：未开始；2：进行中；3：已结束），默认为空，表示全部
        ...this.page
      }
      getRequireCourse(params).then((res) => {
        console.log(res)
        this.total = res.totalNum
        this.resData = res.data
        this.processedData = []
        this.handleProcessedData()
        this.detailParams.credit = res.data[0].credit
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$timeHead: rgba(139, 155, 168, 0.65);
.myRequiredDetails {
  p {
    margin: 0;
  }
  font-size: 14px;
  .entry_path {
    // 头部路径标识
    height: 62px;
    display: flex;
    align-items: center;
    .common {
      color: rgba(0, 11, 21, 0.45);
      cursor: pointer;
    }
    .especially {
      color: rgba(0, 11, 21, 0.85);
      font-weight: bold;
    }
  }
  .status_1 {
    color: #f5c200;
    background-color: #fffee6;
  }
  .status_2 {
    color: #2875d4;
    background-color: #f0f9ff;
  }
  .status_3 {
    color: rgba(0, 11, 21, 0.45);
    background-color: #f5f5f6;
  }
  .sort {
    // 必修课种类详情
    padding: 24px;
    // width: 100%;
    background: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
    border-radius: 4px;
    display: flex;
    .left {
      // 左边图片
      height: 270px;
      width: 480px;
      margin-right: 24px;
      background: #7498fe;
      border-radius: 4px;
      .course_img {
        height: 100%;
        width: 100%;
        border-radius: 4px;
      }
    }
    .right {
      // 右边详细详细
      flex: 1;
      color: #000b15;
      .info {
        display: flex;
        height: 100%;
        flex-direction: column;
        // align-items: stretch;
        .sort_title {
          font-size: 18px;
          color: #000b15;
          letter-spacing: 0;
          line-height: 28px;
          font-weight: 600;
        }
        .sort_status {
          margin-left: 16px;
          font-size: 12px;
          text-align: center;
          line-height: 20px;
          display: inline-block;
          width: 52px;
          height: 20px;
          border-radius: 4px;
          position: relative;
          top: -3px;
        }
        .middle {
          position: relative;
          top: 2px;
          height: 80px;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          li {
            .label {
              opacity: 0.45;
              font-family: PingFangSC-Regular;
              font-size: 14px;
              color: #000b15;
              letter-spacing: 0;
              line-height: 22px;
              margin-bottom: 8px;
            }
            .middle_data {
              font-family: PingFangSC-Regular;
              font-size: 14px;
              color: #000b15;
              letter-spacing: 0;
              line-height: 22px;
              opacity: 0.85;
              color: #000b15;
            }
          }
        }
        .info_bottom {
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: rgba(0, 11, 21, 0.85);
          letter-spacing: 0.5px;
          line-height: 22px;
          margin-top: 24px;
          .info_bottom_details {
            margin-right: 25px;
          }
          .iconInfo {
            margin-right: 8px;
          }
          i {
            color: #8c9196;
          }
        }
        & > li:first-of-type {
          margin-bottom: 40px;
        }
      }
    }
  }
  .classification {
    width: 100%;
    margin-top: 24px;
    padding: 24px 0;
    background-color: #f7f8f8;
    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
    border-radius: 4px;
    /deep/ .el-tabs__header {
      margin: 0;
      padding: 0 24px;
    }
    /deep/ .el-tabs__content {
      margin: 0 12px;
    }
    /deep/ .el-tabs__item {
      height: 56px;
      line-height: 56px;
      font-size: 16px;
      color: #000b15;
      opacity: 0.85;
    }
    /deep/ .el-tabs__item.is-active {
      color: #01aafc;
      opacity: 1;
    }
  }
  .page {
    display: flex;
    flex-direction: row-reverse;
    padding: 0 24px;
  }
}
</style>
