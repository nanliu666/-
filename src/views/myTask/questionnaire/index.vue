<template>
  <div class="questionnaire">
    <el-row v-if="questionData.length" v-loading="loading" :gutter="20">
      <el-col v-for="(z, k) in questionData" :key="k" :span="6">
        <div
          class="content"
          :style="{ opacity: z.finish ? '0.65' : '' }"
          @click="checkQuestionnaire(z)"
        >
          <!-- 后台暂停进行中问卷，前台显示未开始 asqLogicStatus 1-正常 2-暂停 -->
          <div
            class="status"
            :style="{
              background: asqStatusObj[z.asqLogicStatus == 2 ? 2 : z.asqStatus].bgColor,
              color: asqStatusObj[z.asqLogicStatus == 2 ? 2 : z.asqStatus].color
            }"
          >
            {{ asqStatusObj[z.asqLogicStatus == 2 ? 2 : z.asqStatus].name }}
          </div>
          <div v-if="z.finish" class="finish">
            <img :src="require('@/assets/images/my_seal.png')" />
          </div>
          <div class="survey">
            <img :src="require('@/assets/images/questionnaire.png')" />
            <div class="tip">
              <div class="satisfaction">
                {{ z.asqName.length > 10 ? z.asqName.slice(0, 10) + '...' : z.asqName }}
              </div>
              <div class="peopleNum">
                <i class="iconrenshu iconfont iconfontNum"></i><span>{{ z.joinCount }}人参加</span>
              </div>
            </div>
          </div>
          <!-- 时间 -->
          <div class="qus_time">
            <i class="iconimage_icon_time iconfont iconfont_clock"></i>{{ formatTime(z.startTime, '{y}/{m}/{d} {h}:{i}') }}~{{
              formatTime(z.endTime, '{y}/{m}/{d} {h}:{i}')
            }}
          </div>
        </div>
      </el-col>
    </el-row>
    <div v-else class="empty-tips">
      <img :src="require('@/assets/images/nodata.png')" />
      <div class="empty-text">暂无数据</div>
    </div>
    <!-- 分页 -->
    <div class="page">
      <pagination
        :total="total"
        :limit="pageConfig.pageSize"
        :page="pageConfig.pageNo"
        @pagination="pagination"
      >
      </pagination>
    </div>
  </div>
</template>

<script>
import Pagination from 'src/components/common-pagination'
import { questionnaireList } from '@/api/myTask'
import { parseTime } from '@/util/util'
export default {
  name: 'Questionnaire',
  components: { Pagination },
  data() {
    return {
      asqStatusObj: {
        1: {
          name: '进行中',
          bgColor: '#fffce6',
          color: '#fcba00'
        },
        2: {
          name: '未开始',
          bgColor: '#e7ffee',
          color: '#00b061'
        },
        3: {
          name: '已结束',
          bgColor: '#e7fbff',
          color: '#01aafc'
        }
      },
      pageConfig: {
        pageNo: 1,
        pageSize: 10
      },
      total: 0,
      loading: false,
      questionData: []
    }
  },
  mounted() {
    this.getQuestionnaireList()
  },
  methods: {
    formatTime(time, cFormat) {
      return parseTime(time, cFormat)
    },
    pagination({ page, limit }) {
      this.pageConfig.pageNo = page
      this.pageConfig.pageSize = limit
      this.getQuestionnaireList()
    },
    async getQuestionnaireList() {
      this.loading = true
      await questionnaireList(this.pageConfig)
        .then((res) => {
          this.questionData = res.data
          this.total = res.totalNum
        })
        .finally(() => {
          this.loading = false
        })
    },

    // 问卷卡片跳转
    checkQuestionnaire(row) {
      // 问卷状态 1-进行中 2-未开始 3-已结束,asqLogicStatus 1-正常 2-暂停
      // 1、未开始状态 2、后台暂停进行中问卷，前台显示未开始
      if (row.asqStatus == '2' || row.asqLogicStatus == 2) {
        this.$confirm(
          row.asqLogicStatus == 2
            ? '管理员已暂停该问卷回收，暂时无法填写'
            : '该问卷还未开始，暂时无法填写',
          '提醒',
          {
            confirmButtonText: '我知道了',
            showCancelButton: false,
            type: 'warning'
          }
        )
      } else if (row.asqStatus == '1') {
        //   进入【填写问卷】页面
        this.$router.push({
          path: '/myTask/fillQuestionnaire',
          query: { asqPlanId: row.asqPlanId }
        })
      } else if (row.asqStatus == '3') {
        //   进入【查看问卷】页面
      }
    }
  }
}
</script>

<style scoped lang="scss">
.questionnaire {
  background: #ffffff;
  box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
  border-radius: 4px;
  margin-top: 16px;
  padding: 24px;
  .el-col {
    margin-bottom: 20px;
  }
  .content {
    position: relative;
    cursor: pointer;
    background: #ffffff;
    border: 1px solid #ebeced;
    border-radius: 4px;
    transition-duration: 0.3s;
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 9px 12px 0 rgba(0, 63, 161, 0.12);
    }
    .status {
      position: absolute;
      top: 8px;
      right: 8px;
      border-radius: 4px;
      font-size: 10px;
      width: 52px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      font-style: none;
    }
    .finish {
      position: absolute;
      top: 56px;
      right: 10px;
      img {
        width: 62px;
        height: 54px;
      }
    }
  }
  .survey {
    display: flex;
    margin: 33px 0 0 25px;
    img {
      width: 60px;
      height: 64px;
    }
    .tip {
      margin-left: 10px;
      color: #000b15;
      .satisfaction {
        font-size: 14px;
        margin-top: 10px;
      }
      .peopleNum {
        font-size: 12px;
        opacity: 0.65;
        margin-top: 10px;
        .iconfontNum {
          margin-right: 5px;
          vertical-align: middle;
        }
      }
    }
  }
  .qus_time {
    border-top: 1px solid #ebeced;
    margin-top: 16px;
    opacity: 0.65;
    padding: 17px 0;
    font-size: 12px;
    color: #000b15;
    text-align: center;
    .iconfont_clock {
      margin-right: 10px;
      vertical-align: middle;
    }
  }
  .empty-tips {
    text-align: center;
    height: 297px;
    cursor: default;
    img {
      width: 220px;
      height: 220px;
    }
    .empty-text {
      color: #909090;
    }
  }
}
</style>
