<template>
  <div class="arrangement">
    <section class="content">
      <div class="evaluate__part">
        <div class="grade__class">
          <div class="garder">
            <span class="label">项目总成绩：</span>
            <span>{{ evaluateData.totalFraction ? `${evaluateData.totalFraction}分` : '--' }}</span>
          </div>

          <el-popover placement="bottom" width="260" trigger="hover">
            <ul class="evalute__main">
              <li class="evalute__li">
                <span class="li__left">
                  <span class="label">集中测试：</span>
                  <span>{{ evaluateData.focusTest1 === 0 ? 0 : evaluateData.focusTest }}分</span>
                </span>
                <span class="li__right">
                  <span class="label">权重：</span>
                  <span>{{ evaluateData.focusTest1 }}%</span>
                </span>
              </li>
              <li class="evalute__li">
                <span class="li__left">
                  <span class="label">课程学习：</span>
                  <span>{{ evaluateData.courseStudy1 === 0 ? 0 : evaluateData.courseStudy }}分</span>
                </span>
                <span class="li__right">
                  <span class="label">权重：</span>
                  <span>{{ evaluateData.courseStudy1 }}%</span>
                </span>
              </li>
              <li class="evalute__li">
                <span class="li__left">
                  <span class="label">出勤情况：</span>
                  <span>{{ evaluateData.attendance1 === 0 ? 0 : evaluateData.attendance }}分</span>
                </span>
                <span class="li__right">
                  <span class="label">权重：</span>
                  <span>{{ evaluateData.attendance1 }}%</span>
                </span>
              </li>
              <li class="evalute__li">
                <span class="li__left">
                  <span class="label">培训总结：</span>
                  <span>{{
                    evaluateData.reportMaterial !== 0
                      ? `${evaluateData.reportMaterial1 === 0 ? 0 : evaluateData.reportMaterial}分`
                      : '--'
                  }}</span>
                </span>
                <span class="li__right">
                  <span class="label">权重：</span>
                  <span>{{ evaluateData.reportMaterial1 }}%</span>
                </span>
              </li>
              <li class="evalute__li">
                <span class="li__left">
                  <span class="label">实操考试：</span>
                  <span>{{
                    evaluateData.practicalTest !== 0
                      ? `${evaluateData.practicalTest1 === 0 ? 0 : evaluateData.practicalTest}分`
                      : '--'
                  }}</span>
                </span>
                <span class="li__right">
                  <span class="label">权重：</span>
                  <span>{{ evaluateData.practicalTest1 }}%</span>
                </span>
              </li>
              <li class="evalute__li">
                <span class="li__left">
                  <span class="label">答辩回报：</span>
                  <span>{{
                    evaluateData.defenseReport !== 0
                      ? `${evaluateData.defenseReport1 === 0 ? 0 : evaluateData.defenseReport}分`
                      : '--'
                  }}</span>
                </span>
                <span class="li__right">
                  <span class="label">权重：</span>
                  <span>{{ evaluateData.defenseReport1 }}%</span>
                </span>
              </li>
              <li class="evalute__li">
                <span class="li__left">
                  <span class="label">课堂表现：</span>
                  <span>{{
                    evaluateData.coursePerformance !== 0
                      ? `${
                        evaluateData.coursePerformance1 === 0 ? 0 : evaluateData.coursePerformance
                      }分`
                      : '--'
                  }}</span>
                </span>
                <span class="li__right">
                  <span class="label">权重：</span>
                  <span>{{ evaluateData.coursePerformance1 }}%</span>
                </span>
              </li>
            </ul>
            <el-button slot="reference" type="text">
              <span style="margin-right: 4px">查看完整评定纬度</span>
              <i class="el-icon-view" />
            </el-button>
          </el-popover>
        </div>
        <div class="pass__part">
          <span class="label">通过状态：</span>
          <span
            class="pass"
            :class="{
              color__error: PASS_MAP[evaluateData.pass] === 0,
              color__warn: PASS_MAP[evaluateData.pass] === 2
            }"
          >{{ PASS_MAP[_.get(evaluateData, 'pass', 1)] }}</span>
        </div>
      </div>
      <div class="train_time">
        <div class="train_time_head">
          <div class="date">
            <el-date-picker
              v-model="courseDate"
              :picker-options="{ firstDayOfWeek: 1 }"
              type="date"
              placeholder="选择日期"
              @change="changeCourseDate"
            >
            </el-date-picker>
          </div>
          <ul class="list_type">
            <li><i></i>考试</li>
            <li><i></i>在线课程</li>
            <li><i></i>面授/线下课程</li>
          </ul>
        </div>
        <table class="train_time_body">
          <tr>
            <td
              v-for="item in courseDateArr"
              :id="item.day"
              :key="item.index"
              :class="[
                present === item.day ? 'present_c' : '',
                yesterday === item.day ? 'present_last' : ''
              ]"
              @click="changeTableDate(item.day)"
            >
              <div class="week">
                <ul :class="{ selectDay: present === item.day }">
                  <li>{{ item.week }}</li>
                  <li>{{ item.day_E }}</li>
                </ul>
              </div>
              <div class="date">
                <ul>
                  <li>
                    <i :class="present === item.day ? 'pitch' : ''">{{ item.day_N }}</i>
                  </li>
                  <li>{{ item.isToday }}</li>
                  <li class="task">
                    <i v-show="item.schedule.offline" class="color_g"></i><i v-show="item.schedule.online" class="color_p"></i><i v-show="item.schedule.exam" class="color_o"></i>
                  </li>
                </ul>
              </div>
            </td>
          </tr>
        </table>
      </div>

      <div class="train_info">
        <div v-show="dataInfo.length" class="tip">
          <p>
            今天共<span>{{ dataInfo.length }}</span>项课需要完成。
          </p>
        </div>
        <div v-if="dataInfo.length">
          <div v-for="(item, i) in dataInfo" :key="item.id" class="task">
            <task
              :train-status="data.status"
              :data-info="item"
              :last-course="i === dataInfo.length - 1"
              :select-date="selectDate"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
const PASS_MAP = {
  1: '通过，已发放证书',
  2: '通过，未发放证书',
  3: '通过',
  0: '未通过'
}
import { Task } from '../assignment'
import { getTrainInfo, getTrainDate, queryAssessment } from 'src/api/train'
import moment from 'moment'
moment.locale('zh-cn', {
  week: {
    dow: 1,
    doy: 4
  }
})
export default {
  name: 'Arrangement',
  components: {
    Task
  },
  provide() {
    return {
      arrangement: this
    }
  },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      evaluateData: {},
      courseDate: '',
      courseDateArr: [], //日期数据
      schedule: [], //日程表
      dataInfo: [],
      present: '',
      yesterday: '',
      selectDate: moment(new Date()).format('yyyy-MM-DD')
    }
  },
  computed: {
    PASS_MAP: () => PASS_MAP
  },
  created() {
    this.initData()
  },

  methods: {
    initData() {
      this.getAssessment()
      this.handleDefault()
    },
    getAssessment() {
      queryAssessment({ trainId: this.$route.query.trainId }).then((res) => {
        this.evaluateData = res
      })
    },
    // 处理默认展示培训安排
    handleDefault() {
      // status 1未开始 2进行中 3已结束
      if (this.data.status == 1) {
        // 未开始展示
        this.courseDate = this.data.bizTime
      } else if (this.data.status == 2) {
        // 进行中展示当天
        this.courseDate = new Date()
      } else {
        // 已结束默认展示最后一天
        this.courseDate = this.data.trainEndTime
      }
      this.courseDate = this.courseDate || new Date()
      this.getData(this.courseDate)
      this.changeCourseDate(this.courseDate)
    },
    // 获取培训安排内容
    getData(date) {
      let dateTime = moment(date).format('yyyy-MM-DD') || moment(new Date()).format('yyyy-MM-DD')
      let params = {
        trainId: this.data.trainId,
        oneDay: `${dateTime} 00:00:00`
      }
      getTrainInfo(params).then((res) => {
        this.dataInfo = res
      })
    },
    // getList() {},
    // 点击页面图表更改日期
    changeTableDate(v) {
      this.present = moment(v).format('yyyy-MM-DD')
      this.yesterday = moment(v)
        .add(-1, 'days')
        .format('yyyy-MM-DD')
      this.courseDate = v
      this.dataInfo = []
      this.selectDate = v
      this.getData(v)
    },
    // 点击日历牌控件更改日期
    async changeCourseDate(v) {
      if (!v) v = new Date()
      this.selectDate = moment(v).format('yyyy-MM-DD')
      await this.getTrainDate(v)
      this.handleCourseDate(v)
      this.getData(v)
      this.dataInfo = []
    },
    // 处理日期信息v
    handleCourseDate(v) {
      let courseDate = v || new Date()
      this.present = moment(courseDate).format('yyyy-MM-DD')
      this.yesterday = moment(v)
        .add(-1, 'days')
        .format('yyyy-MM-DD')
      let courseDateArr = []
      let dateMouth = moment(courseDate).day() === 0 ? 7 : moment(courseDate).day()
      for (let i = 0; i < 7; i++) {
        let tem = {
          isToday: '',
          week: '',
          day_E: '',
          day_N: '',
          day: '',
          index: null,
          schedule: this.schedule[i]
        }
        tem.index = i
        switch (i) {
          case 0:
            tem.week = '一'
            tem.day_E = 'Mon'
            break
          case 1:
            tem.week = '二'
            tem.day_E = 'Tuse'
            break
          case 2:
            tem.week = '三'
            tem.day_E = 'Wed'
            break
          case 3:
            tem.week = '四'
            tem.day_E = 'Thus'
            break
          case 4:
            tem.week = '五'
            tem.day_E = 'Fri'
            break
          case 5:
            tem.week = '六'
            tem.day_E = 'Sta'
            break
          case 6:
            tem.week = '七'
            tem.day_E = 'Sun'
        }
        tem.day_N = moment(courseDate)
          .weekday(i)
          .format('D')
        tem.day = moment(courseDate)
          .add(-dateMouth + i + 1, 'days')
          .format('yyyy-MM-DD')
        if (moment().format('yyyy-MM-DD') === tem.day) {
          tem.isToday = '今天'
        }
        if (tem.day_N < 10) {
          tem.day_N = `0${tem.day_N}`
        }
        courseDateArr.push(tem)
      }
      this.courseDateArr = courseDateArr
    },
    // 查询培训安排日期
    async getTrainDate(v) {
      let dateTime = v || new Date()
      this.schedule = []
      let params = {
        id: this.data.trainId,
        dateTime: `${moment(dateTime).format('YYYY-MM-DD')} 00:00:00`
      }
      await getTrainDate(params).then((res) => {
        this.schedule = res
      })
    }
  }
}
</script>
<style lang="scss">
.evalute__main {
  padding: 10px;
  .evalute__li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    .li__left {
      .label {
        color: #5e5e5e;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
$timeHead: rgba(0, 11, 21, 0.65);
$typeStatusColor_g: rgba(0, 214, 111, 1);
$typeStatusColor_p: rgba(145, 1, 252, 1);
$typeStatusColor_o: rgba(252, 124, 1, 1);
$color_b1: rgba(1, 170, 252, 1);

.arrangement {
  // color:#ccc;
  .content {
    .evaluate__part {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .label {
        color: #5e5e5e;
      }
      .grade__class {
        display: flex;
        align-items: center;

        .garder {
          margin-right: 40px;
        }

        .pass__part {
          .pass {
            color: #4aa51d;
          }
          .color__error {
            color: red;
          }
          .color__warn {
            color: yellow;
          }
        }
      }
    }
    .train_time {
      .train_time_head {
        font-size: 12px;
        height: 34px;
        color: $timeHead;
        .date {
          float: left;
          /deep/.el-input__inner {
            // 删除elementUI日期本来自带边框
            border: 0px;
            color: $timeHead;
          }
        }
        .list_type {
          float: right;
          li {
            float: right;
            margin-left: 20px;
            line-height: 34px;
            i {
              display: inline-block;
              height: 10px;
              width: 10px;
              border-radius: 10px;
              margin-right: 5px;
            }
          }
          li:nth-child(1) i {
            background: $typeStatusColor_o;
          }
          li:nth-child(2) i {
            background: $typeStatusColor_p;
          }
          li:nth-child(3) i {
            background: $typeStatusColor_g;
          }
        }
      }
      .train_time_body {
        width: 100%;
        border-collapse: collapse;
        border-spacing: 0;
        border-radius: 20px;
        background-color: #fafafa;
        td:hover {
          background-color: #fff;
          box-shadow: 0 8px 20px 0 rgba(0, 61, 122, 0.12);
          margin-top: -4px;
        }
        td {
          height: 176px;
          border: 1px solid rgba(235, 236, 237, 1);
          box-shadow: 0 2px 8px 0 rgba(0, 61, 122, 0.08);
          width: 166px;
          div {
            height: 50%;
          }
        }
        .present_c {
          border-color: #2875d4;
          box-shadow: 0 1px 2px 0 rgba(74, 167, 208, 0.25);
        }
        .present_last {
          border-right: 1px solid #2875d4;
          box-shadow: 0 1px 2px 0 rgba(74, 167, 208, 0.25);
        }
        .week {
          position: relative;
          color: rgba(0, 11, 21, 0.45);
          line-height: 20px;
          ul {
            height: 100%;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            &.selectDay {
              background-color: #f0f9ff;
            }
            &.selectDay li:nth-child(1) {
              font-weight: 600;
              color: #232e38;
            }
            li:nth-child(1) {
              font-size: 16px;
            }
            li:nth-child(2) {
              font-size: 12px;
            }
          }
        }
        .date {
          position: relative;
          ul {
            text-align: center;
            li {
              position: absolute;
              i {
                font-style: normal;
              }
            }
            li:nth-child(1) {
              top: 18px;
              left: 0;
              right: 0;
              color: rgba(0, 11, 21, 0.65);
              font-size: 16px;
              font-weight: bold;
            }
            li:nth-child(2) {
              top: 40px;
              left: 0;
              right: 0;
              color: rgba(0, 11, 21, 0.45);
              font-size: 12px;
            }
            li:nth-child(3) {
              top: 58px;
              left: 0;
              right: 0;
            }
            .task {
              i {
                margin: 0 3px;
                display: inline-block;
                height: 6px;
                width: 6px;
                // background: $typeStatusColor_p;
                border-radius: 6px;
              }
              .color_p {
                background: $typeStatusColor_p;
              }
              .color_o {
                background: $typeStatusColor_o;
              }
              .color_g {
                background: $typeStatusColor_g;
              }
            }
            .pitch {
              background: #2875d4;
              padding: 3px;
              border-radius: 50%;
              color: #fff;
              width: 25px;
              height: 25px;
              font-style: normal;
            }
          }
        }
      }
    }
    .train_info {
      margin-top: 20px;
      .tip {
        font-size: 14px;
        color: rgba(0, 11, 21, 0.85);
        span {
          color: $color_b1;
          margin: 0 5px;
          font-size: 16px;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
