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
              <span class="sort_title">{{ detailParams.name }}</span>
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
                  有效时间：<span class="middle_data">{{ detailParams.startTime }} - {{ detailParams.endTime }}</span>
                </li>
                <!-- <li>
                  主办单位：<span class="middle_data">{{
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
          <div class="composite">
            <el-rate
              :v-model="detailParams.composite"
              disabled
              show-score
              text-color="#rgba(0,11,21,0.45)"
              score-template="{value}"
            >
            </el-rate>
            <span>分</span>
          </div>
        </div>
      </div>
      <!-- 课程分类 -->
      <div class="classification">
        <el-tabs v-model="activeName">
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
import { getRequiredDetail } from '@/api/lecturerTask'
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
    // this.detailParams = JSON.parse(this.$route.query.item)
    this.isgetRequiredDetail()
    this.detailParams.startDate = moment(this.detailParams.startTime).format('yyyy-MM-DD')
    this.detailParams.entDate = moment(this.detailParams.endTime).format('yyyy-MM-DD')
    // console.log('params----', this.detailParams)
    this.getData()
  },
  methods: {
    async isgetRequiredDetail() {
      this.detailParams = await getRequiredDetail({ id: this.$route.query.id })
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
    getData() {}
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
    background: #fffee6;
    color: #f5c200;
  }
  .status_2 {
    color: #2875d4;
    background: #eaf8ff;
  }
  .status_3 {
    background: #f5f5f6;
    color: rgba(0, 11, 21, 0.45);
  }
  .sort {
    // 必修课种类详情
    height: 318px;
    padding: 24px;
    // width: 100%;
    background: #ffffff;
    border-radius: 4px;
    display: flex;
    box-shadow: 0 2px 8px 0 rgba(0, 61, 112, 0.06);
    .left {
      // 左边图片
      width: 480px;
      height: 270px;
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
      position: relative;
      .composite {
        position: absolute;
        top: 0;
        right: 0;
        display: flex;
        color: rgba(0, 11, 21, 0.45);
        font-size: 12px;
      }
      .info {
        display: flex;
        height: 100%;
        flex-direction: column;
        & > li:nth-of-type(2) {
          margin-top: 40px;
          margin-bottom: 24px;
        }
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
            color: rgba(0, 11, 21, 0.45);
          }
          .middle_data {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #000b15;
            letter-spacing: 0;
          }
        }
        .info_bottom {
          font-size: 14px;
          color: rgba(0, 11, 21, 0.85);
          letter-spacing: 0.5px;
          .info_bottom_details {
            margin-right: 25px;
          }
          .iconInfo {
            color: #8c9196;
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
