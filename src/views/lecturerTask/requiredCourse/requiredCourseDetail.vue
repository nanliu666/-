<template>
  <div class="myRequiredDetails">
    <section>
      <!-- 入口路径 -->
      <div class="entry_path">
        <p>
          <span class="common" @click="$router.go(-1)"> 必修课 / </span><span class="especially">必修课详情</span>
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
                  分类：<span class="middle_data">{{
                    detailParams.categoryName ? detailParams.categoryName : '--'
                  }}</span>
                </li>
                <li>
                  学习时间：<span class="middle_data">{{ detailParams.startDate }} - {{ detailParams.entDate }}</span>
                </li>
                <li>
                  主办单位：<span class="middle_data">{{
                    detailParams.sponsor ? detailParams.sponsor : '--'
                  }}</span>
                </li>
              </ul>
            </li>
            <li class="info_bottom">
              <span class="info_bottom_details"><i class="iconimage_icon_user iconfont iconInfo"></i>{{ detailParams.peopleNum ? detailParams.peopleNum + '人' : '--' }}</span>
              <span class="info_bottom_details"><i class="iconimage_icon_time1 iconfont iconInfo"></i>{{ detailParams.period ? detailParams.period + '小时' : '--' }}</span>
              <span v-if="false" class="info_bottom_details"><i class="iconjifen iconfont iconInfo"></i>{{ detailParams.credit ? detailParams.credit + '积分' : '--' }}</span>
            </li>
          </ul>
        </div>
      </div>
      <!-- 课程分类 -->
      <div class="classification">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane
            v-for="(item, index) in activeList"
            :key="index"
            :label="item.label"
            :name="item.name"
          ><component :is="item.tab"></component></el-tab-pane>
        </el-tabs>

        <!-- 页码 -->
        <!-- <div class="page">
          <el-pagination
            :page-sizes="[10, 20, 30, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            class="pagination"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </div> -->
      </div>
    </section>
  </div>
</template>

<script>
import situationTab from './situationTab' //学习情况
import courseTab from './courseTab' //学习课程
import examinationTab from './examinationTab' //考试情况
import moment from 'moment'

export default {
  components: { situationTab, courseTab, examinationTab },

  props: {},
  data() {
    return {
      activeName: 'situation', //tabs默认值
      activeList: [
        {
          label: '学习情况',
          name: 'situation',
          tab: 'situationTab'
        },
        {
          label: '学习课程',
          name: 'course',
          tab: 'courseTab'
        },
        {
          label: '考试情况',
          name: 'examination',
          tab: 'examinationTab'
        }
      ],
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
    // tabs点击
    handleClick(tab, event) {
      console.log(tab, event)
    },
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
    getData() {
      // console.log('getData')
      // let params = {
      //   courseType: '0',
      //   id: this.detailParams.id,
      //   status: status || '', //状态（1：未开始；2：进行中；3：已结束），默认为空，表示全部
      //   ...this.page
      // }
      //   getRequireCourse(params).then((res) => {
      //     // console.log('getRequireCourse----res', res)
      //     this.total = res.totalNum
      //     this.resData = res.data
      //     this.processedData = []
      //     this.handleProcessedData()
      //     // this.dataInfo
      //   })
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
  // background: $timeHead;
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
    background: #e7ffee;
    color: #00b061;
  }
  .status_2 {
    background: #fffce6;
    color: #fcba00;
  }
  .status_3 {
    background: #e7fbff;
    color: #01aafc;
  }
  .sort {
    // 必修课种类详情
    height: 214px;
    padding: 24px;
    // width: 100%;
    background: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
    border-radius: 4px;
    display: flex;
    .left {
      // 左边图片
      height: 100%;
      width: 273px;
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
        justify-content: space-between;
        // align-items: stretch;
        .sort_title {
          font-size: 18px;
          font-weight: bold;
          opacity: 0.85;
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
          justify-content: space-between;
          li {
            color: rgba(0, 11, 21, 0.45);
          }
          .middle_data {
            color: rgba(0, 11, 21, 0.85);
          }
        }
        .info_bottom {
          font-size: 14px;
          color: rgba(0, 11, 21, 0.45);
          .info_bottom_details {
            margin-right: 25px;
          }
          .iconInfo {
            // font-size: 14px;
            margin-right: 8px;
          }
        }
      }
    }
  }
  .classification {
    width: 100%;
    margin-top: 24px;
    padding: 24px;
    background: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
    border-radius: 4px;
  }

  .page {
    display: flex;
    flex-direction: row-reverse;
    padding: 0 24px;
  }
}
</style>
