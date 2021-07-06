<template>
  <div class="exam-style">
    <el-card v-if="from === 'exam'" class="search-card">
      <el-input
        v-model="queryInfo.examName"
        class="input-box"
        maxlength="32"
        placeholder="输入考试名称搜索"
        prefix-icon="el-icon-search"
        clearable
        @input="searchFun"
      />
      <el-popover
        placement="bottom"
        width="412"
        trigger="click"
        popper-class="course-list-filter-pop"
      >
        <ul class="course-list-filter-pop__wrap">
          <li class="course-list-filter-pop__li">
            <div class="course-list-filter-pop__label">考试时间</div>
            <el-date-picker
              v-model="queryInfo.examTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </li>
          <li class="course-list-filter-pop__li">
            <div class="course-list-filter-pop__label">是否通过</div>
            <el-select
              v-model="queryInfo.isPass"
              class="course-list-filter-pop__value"
              placeholder="请选择"
            >
              <el-option
                v-for="item in passTypeOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </li>
          <li class="course-list-filter-pop__li">
            <div class="course-list-filter-pop__label">状态</div>
            <el-select
              v-model="queryInfo.status"
              class="course-list-filter-pop__value"
              placeholder="请选择"
            >
              <el-option
                v-for="item in statusOption"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </li>
          <div class="course-list-filter-pop__footer">
            <el-button type="primary" size="medium" @click="filterFun"> 确定 </el-button>
            <el-button size="medium" @click="restSearch"> 重置 </el-button>
          </div>
        </ul>
        <el-button slot="reference" size="medium"> 高级检索 </el-button>
      </el-popover>
    </el-card>
    <div v-if="!_.isEmpty(tableData)" class="exam__main">
      <ul v-loading="tableLoading" class="exam__ul">
        <el-card>
          <li
            v-for="(item, index) in tableData"
            :key="index"
            class="exam__li"
            @click="toDetail(item)"
          >
            <div class="li__container">
              <div class="li__left">
                <div class="li__title">
                  <span v-if="item.examPattern === 'general'" class="title__flag online">在线</span>
                  <span v-else class="title__flag offline">线下</span>
                  <span class="title">
                    {{ item.examName }}
                  </span>
                  <!-- 只有通用考试才会显示批次信息 -->
                  <span v-if="item.examType === 'CurrencyExam'">
                    <span>（第</span>
                    <span>{{ (Number(_.get(item, 'batchNumber', 0)) + 1) | number2zhcn }}</span>
                    <span>批）</span>
                  </span>
                </div>
                <div class="li__time">
                  <div v-if="from === 'task'" class="source">
                    <span class="label">来源：</span>
                    <span class="value">{{ item.examSourceName }} </span>
                  </div>
                  <div class="time">
                    <span class="label">考试时间：</span>
                    <span class="value">
                      <span>{{ item.examBeginTime }}</span>
                      <span> ~ </span>
                      <span>{{ item.examEndTime }}</span>
                    </span>
                  </div>
                  <div v-if="item.examPattern !== 'general'" class="li__classromm">
                    <span class="label">考试地点：</span>
                    <span class="value">
                      <span>{{ item.roomAddr }}</span>
                      <span> - </span>
                      <span>{{ item.roomName }}</span>
                    </span>
                  </div>
                </div>
              </div>
              <!-- 非考试中心列表且后端可显示才显示分数 -->
              <div v-if="from !== 'exam' && item.scoreVisible" class="li__right">
                <div class="score__content">
                  <span class="content" :class="[item.isPass === 3 ? 'green' : 'red']">{{
                    item.score
                  }}</span>
                  <span class="text">分</span>
                </div>
                <svg class="icon icon__box" aria-hidden="true">
                  <use v-if="item.isPass === 3" xlink:href="#iconic_biaoqian_yitongguo" />
                  <use v-if="item.isPass === 1" xlink:href="#iconic_biaoqian_weitongguo" />
                </svg>
              </div>
            </div>
          </li>
        </el-card>
      </ul>
      <div class="pagination__container">
        <el-pagination
          :page-sizes="[10, 20, 30, 40]"
          :page-size="10"
          :current-page="queryInfo.pageNo"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNum"
          @size-change="handlePageSizeChange"
          @current-change="handleCurrentPageChange"
        />
      </div>
    </div>
    <CommonEmpty v-else style="margin-top: 20px" />
  </div>
</template>

<script>
const PASS_TYPE = [
  {
    label: '全部',
    value: 0
  },
  {
    value: 1,
    label: '未通过'
  },
  {
    value: 2,
    label: '待发布'
  },
  {
    value: 3,
    label: '已通过'
  }
]
const STATUS_TYPE = [
  {
    value: 0,
    label: '全部'
  },
  {
    value: 1,
    label: '未开考'
  },
  {
    value: 2,
    label: '未考试'
  },
  {
    value: 3,
    label: '已考试'
  },
  {
    value: 4,
    label: '缺考'
  }
]
import { getExamList } from '@/api/exam'
import moment from 'moment'
const nzhcn = require('nzh/cn')
export default {
  name: 'ExamList',
  filters: {
    number2zhcn(index) {
      return nzhcn.encodeS(index)
    }
  },
  components: {
    CommonEmpty: () => import('@/components/common-empty/Empty')
  },
  props: {
    liveId: {
      type: String,
      default: ''
    },
    from: {
      type: String,
      default: 'exam'
    }
  },

  data() {
    return {
      passTypeOption: PASS_TYPE,
      statusOption: STATUS_TYPE,
      totalNum: 0,
      queryInfo: {
        pageNo: 1,
        pageSize: 10,
        examTime: [],
        examName: '',
        isPass: 0,
        status: 0,
        liveId: '', // 如果是直播详情内的考试列表，入参liveId
        type: 1 // 0我的任务内的考试列表， 1考试中心的列表，
      },
      tableData: [],
      tableLoading: false
    }
  },
  activated() {
    this.loadTableData()
  },
  methods: {
    // 去中间页面
    toDetail(row) {
      this.$router.push({ path: '/exam/middle', query: { id: row.batchId } })
    },
    restSearch() {
      const queryParams = { examTime: [], isPass: '', status: '', pageNo: 1, pageSize: 10 }
      this.queryInfo = _.assign(this.queryInfo, queryParams)
    },
    filterFun() {
      this.queryInfo.pageNo = 1
      this.loadTableData()
    },
    searchFun: _.debounce(function() {
      this.queryInfo.pageNo = 1
      this.loadTableData()
    }, 1000),
    handleCategoryChange(category) {
      this.queryInfo.catalogId = category.id
      this.loadTableData()
    },
    /**
     * 处理页码改变
     */
    handleCurrentPageChange(param) {
      this.queryInfo.pageNo = param
      this.loadTableData()
    },
    /**
     * 处理页码大小更改
     */
    handlePageSizeChange(param) {
      this.queryInfo.pageSize = param
      this.queryInfo.pageNo = 1
      this.loadTableData()
    },
    // 加载函数
    async loadTableData() {
      if (this.tableLoading) return
      try {
        this.tableData = []
        this.tableLoading = true
        const examTimeTemp = _.cloneDeep(this.queryInfo.examTime)
        const examTime = _.map(examTimeTemp, (item) => {
          return moment(item).format('YYYY-MM-DD HH:mm:ss')
        })
        // 直播需要入参liveId
        if (this.from === 'live') {
          this.queryInfo.liveId = this.liveId
        }
        // 直播考试。我的任务-考试type0，考试中心type1
        if (this.from === 'live' || this.from === 'task') {
          this.queryInfo.type = 0
        }
        const params = _.assign(_.cloneDeep(this.queryInfo), { examTime })
        let { totalNum, data } = await getExamList(params)
        this.tableLoading = false
        this.tableData = data
        this.totalNum = totalNum
      } catch (error) {
        this.tableLoading = false
        this.$message.error(error.message)
        window.console.error(JSON.stringify(this.queryInfo))
      }
    }
  }
}
</script>

<style scoped lang="scss">
.is__hidden {
  visibility: hidden;
}
/deep/ .el-date-editor .el-range-separator {
  padding: 0;
  width: 50px;
}
/deep/ .el-range-editor {
  width: 100%;
}
/deep/ .el-range__icon {
  line-height: 28px;
}
.exam-style {
  .search-card {
    margin-top: 16px;
    .input-box {
      width: 240px;
      margin-right: 16px;
    }
  }
  .exam__main {
    margin-top: 20px;
    .exam__ul {
      min-height: 70vh;
      /deep/ .el-card__body {
        padding: 0;
      }
      .exam__li {
        cursor: pointer;
        padding: 24px 0;
        margin: 0 24px;
        border-bottom: 1px solid #ebeced;
        .li__container {
          display: flex;
          justify-content: space-between;
          .li__left {
          }
          .li__right {
            display: flex;
            .icon__box {
              margin-left: 20px;
              font-size: 50px;
            }
            .score__content {
              display: flex;
              align-items: flex-end;
              justify-content: center;
              margin-bottom: 4px;
              .content {
                font-size: 40px;
                font-weight: 550;
                display: flex;
              }
              .green {
                color: #339900;
              }
              .red {
                color: #d9001b;
              }
              .text {
                margin-bottom: 6px;
              }
            }
          }
        }
        .li__title {
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          .title {
            font-family: PingFangSC-Medium;
            font-size: 14px;
            color: rgba(0, 11, 21, 0.85);
            font-weight: 550;
          }
          .title__flag {
            border-radius: 2px;
            padding: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 8px;
          }
          .online {
            border: 1px solid #2875d4;
            background: #f0f9ff;
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #2875d4;
            letter-spacing: 0;
            text-align: center;
            font-weight: 400;
          }
          .offline {
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #13a1ad;
            letter-spacing: 0;
            text-align: center;
            font-weight: 400;
            background: #f0fffd;
            border: 1px solid #13a1ad;
            border-radius: 2px 2px 0 2px 2px;
          }
        }
        .li__time {
          display: flex;
          .source {
            position: relative;
            padding-right: 10px;
            margin-right: 10px;
            &::after {
              position: absolute;
              content: '';
              right: 0;
              bottom: 1px;
              width: 1px;
              height: 13px;
              background-color: #6f7583;
            }
          }
          .li__classromm {
            color: #a7a7a7;
            position: relative;
            padding-left: 10px;
            margin-left: 10px;
            &::after {
              position: absolute;
              content: '';
              left: 0;
              bottom: 1px;
              width: 1px;
              height: 13px;
              background-color: #6f7583;
            }
          }
          .label {
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: rgba(0, 11, 21, 0.45);
          }
          .value {
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: rgba(0, 11, 21, 0.85);
            letter-spacing: 0;
            font-weight: 400;
          }
        }
      }
    }
    .pagination__container {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
    }
  }
}
</style>
<style lang="scss">
.course-list-filter-pop {
  &__wrap {
    padding: 24px 16px;
  }
  &__li {
    margin-bottom: 16px;
  }
  &__label {
    margin-bottom: 8px;
  }
  &__value {
    width: 100%;
  }
  &__footer {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
    .el-button {
      padding: 9px 13px;
    }
  }
}
</style>
