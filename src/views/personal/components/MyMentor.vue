<template>
  <div class="MyMentor">
    <div class="info_box">
      <div class="box_l">
        <div class="title">导师信息</div>
        <img v-if="TutorData.userPic" class="img" :src="TutorData.userPic" alt="" />
        <div v-else class="img"></div>
      </div>
      <div class="box_r">
        <div class="info_name">
          {{ TutorData.tutorName || '--' }} <span> ( {{ TutorData.workNo || '--' }} )</span>
        </div>
        <ul>
          <li>
            <span class="name"> 性别： </span>
            <span> {{ TutorData.sex === '' ? '--' : TutorData.sex == 1 ? '男' : '女' }} </span>
          </li>
          <li>
            <span class="name"> 出生日期： </span> <span> {{ TutorData.birthDate || '--' }} </span>
          </li>
          <li>
            <span class="name"> 所在部门： </span>
            <span class="text">
              <text-over-tooltip
                ref-name="testName1"
                class-name="20"
                :content="TutorData.orgName"
              ></text-over-tooltip>
            </span>
          </li>
          <li>
            <span class="name"> 岗位： </span> <span> {{ TutorData.positionName || '--' }} </span>
          </li>
          <li>
            <span class="name"> 职称： </span>

            <span class="text">
              <text-over-tooltip
                ref-name="testName1"
                class-name="20"
                :content="TutorData.professionalName"
              ></text-over-tooltip>
            </span>
          </li>
          <li>
            <span class="name"> 本岗位工作年限: </span>
            <span> {{ TutorData.workYear || '--' }} </span>
          </li>
          <li>
            <span class="name"> 毕业院校： </span>

            <span class="text">
              <text-over-tooltip
                ref-name="testName1"
                class-name="20"
                :content="TutorData.graduateSchool"
              ></text-over-tooltip>
            </span>
          </li>
          <li>
            <span class="name"> 专业： </span>
            <span class="text">
              <text-over-tooltip
                ref-name="testName1"
                class-name="20"
                :content="TutorData.major"
              ></text-over-tooltip>
            </span>
          </li>
          <li>
            <span class="name"> 学历： </span> <span> {{ TutorData.qualification || '--' }} </span>
          </li>
        </ul>
      </div>
    </div>

    <div class="tabs">
      <el-tabs v-model="activeName">
        <el-tab-pane label="导师评语" name="first">
          <ul class="tutorcomments">
            <li>
              <span class="name">得分：</span> <span> {{ TutorData.tutorScore || '--' }} </span>
            </li>
            <li>
              <span class="name">等级：</span>
              <span> {{ showLevel(TutorData.level) || '--' }} </span>
            </li>
            <li>
              <span class="name">评语：</span>
              <span class="text">
                {{ TutorData.tutorComment || '--' }}
              </span>
            </li>
          </ul>
        </el-tab-pane>
        <el-tab-pane label="评价导师" name="second">
          <div class="evaluationtutor">
            注：“5分”表示完全同意，“1分”表示完全不同意
          </div>

          <el-form ref="form" label-position="top" label-width="80px">
            <el-form-item label="1.导师的责任心强、带徒水平高、对我的帮助非常大">
              <el-radio-group v-model="scoreTutorArr[0]" :disabled="scoreTutorStr !== ''">
                <el-radio label="5">5分</el-radio><el-radio label="4">4分</el-radio><el-radio label="3">3分</el-radio><el-radio label="2">2分</el-radio><el-radio label="1">1分</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="2.导师每周都有与我做工作及思想方面的交流">
              <el-radio-group v-model="scoreTutorArr[1]" :disabled="scoreTutorStr !== ''">
                <el-radio label="5">5分</el-radio><el-radio label="4">4分</el-radio><el-radio label="3">3分</el-radio><el-radio label="2">2分</el-radio><el-radio label="1">1分</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="3.导师给我制定的工作计划非常清晰,我清楚的知道每天的工作任务">
              <el-radio-group v-model="scoreTutorArr[2]" :disabled="scoreTutorStr !== ''">
                <el-radio label="5">5分</el-radio><el-radio label="4">4分</el-radio><el-radio label="3">3分</el-radio><el-radio label="2">2分</el-radio><el-radio label="1">1分</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="4.我能感受到导师对本岗位相关知识非常了解">
              <el-radio-group v-model="scoreTutorArr[3]" :disabled="scoreTutorStr !== ''">
                <el-radio label="5">5分</el-radio><el-radio label="4">4分</el-radio><el-radio label="3">3分</el-radio><el-radio label="2">2分</el-radio><el-radio label="1">1分</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="5.导师出色的表达和逻辑组织能力，让我更易理解">
              <el-radio-group v-model="scoreTutorArr[4]" :disabled="scoreTutorStr !== ''">
                <el-radio label="5">5分</el-radio><el-radio label="4">4分</el-radio><el-radio label="3">3分</el-radio><el-radio label="2">2分</el-radio><el-radio label="1">1分</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="6.我觉得导师的指导非常实用,能够帮助我快速掌握岗位应知应会知识">
              <el-radio-group v-model="scoreTutorArr[5]" :disabled="scoreTutorStr !== ''">
                <el-radio label="5">5分</el-radio><el-radio label="4">4分</el-radio><el-radio label="3">3分</el-radio><el-radio label="2">2分</el-radio><el-radio label="1">1分</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>

          <div v-if="!scoreTutorStr" class="btns">
            <el-button :disabled="scoreTutorArrLangth !== 6" type="primary" @click="submitBtn">提交</el-button>
            <el-button @click="scoreTutorArr = []">取消</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { myTutorList, evaluationTutor } from '@/api/personal'
import TextOverTooltip from '../../course/components/TextOverTooltip'

export default {
  components: { TextOverTooltip },
  data() {
    return {
      activeName: 'first',
      TutorData: {},
      scoreTutorArr: [],
      scoreTutorArrLangth: 0,
      scoreTutorStr: ''
    }
  },
  watch: {
    scoreTutorArr: function(nvl) {
      let i = 0
      nvl.forEach(() => {
        i = i + 1
      })
      this.scoreTutorArrLangth = i
    }
  },
  created() {
    this.getMyTutorList()
  },
  methods: {
    async getMyTutorList() {
      let res = await myTutorList({})
      this.$emit('MyMentorSon', res)
      if (res.length === 0) return
      this.TutorData = res[0]
      this.scoreTutorStr = this.TutorData.scoreTutorStr
      let Arr = this.TutorData.scoreTutorStr
      this.scoreTutorArr = Arr.split(',')
    },
    submitBtn() {
      let keyUp
      this.scoreTutorArr.forEach((item) => {
        if (item) keyUp += 1
      })
      if (keyUp < 5) {
        this.$message({
          message: '要全部选完哦',
          type: 'warning'
        })
        return
      }

      let params = {
        id: this.TutorData.idStr,
        scoreTutorStr: this.scoreTutorArr.join(',')
      }

      this.$confirm('确定要提交吗？提交之后不可在修改', '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        evaluationTutor(params).then(() => {
          this.$message({
            message: '评价成功',
            type: 'success'
          })
          this.getMyTutorList()
        })
      })
    },
    showLevel(i) {
      // 等级（1-优秀 2-良好 3-合格 4-不合格）
      let LevelArr = {
        1: '优秀',
        2: '良好',
        3: '合格',
        4: '不合格'
      }
      return LevelArr[i]
    }
  }
}
</script>

<style lang="scss" scoped>
.MyMentor {
  .info_box {
    background-color: #fff;
    box-shadow: 0 2px 8px 0 rgba(0, 63, 161, 0.06);
    padding: 24px 0 24px 24px;
    display: flex;
    .box_l {
      width: 120px;
      .title {
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: rgba(0, 11, 21, 0.85);
        letter-spacing: 0;
        font-weight: 500;
      }
      .img {
        width: 53px;
        height: 53px;
        border-radius: 50%;
        margin-top: 28px;
        background-color: rgba(105, 105, 105, 0.219);
      }
    }
    .box_r {
      margin: 44px 0 0 32px;
      .info_name {
        font-family: PingFangSC-Medium;
        font-size: 18px;
        color: rgba(0, 11, 21, 0.85);
        letter-spacing: 0;
        line-height: 28px;
        font-weight: 500;
        span {
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: rgba(0, 11, 21, 0.85);
          letter-spacing: 0;
          line-height: 28px;
          font-weight: 400;
          padding-left: 5px;
        }
      }
      ul {
        display: flex;
        flex-wrap: wrap;
        li {
          margin-top: 8px;
          width: 33.33%;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: rgba(0, 11, 21, 0.85);
          letter-spacing: 0;
          line-height: 22px;
          font-weight: 400;
          display: flex;
          .name {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: rgba(0, 11, 21, 0.45);
            letter-spacing: 0;
            line-height: 22px;
            font-weight: 400;
            display: inline-block;
            width: 70px;
          }
          .text {
            width: 140px;
          }
          &:nth-child(3n) .name {
            width: 105px;
          }
        }
      }
    }
  }
  .tabs {
    background-color: #fff;
    box-shadow: 0 2px 8px 0 rgba(0, 63, 161, 0.06);
    padding: 24px;
    margin-top: 20px;
    .tutorcomments {
      margin-top: 16px;

      li {
        margin-top: 8px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: rgba(0, 11, 21, 0.85);
        line-height: 22px;
        font-weight: 400;

        .name {
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: rgba(0, 11, 21, 0.45);
          line-height: 22px;
          font-weight: 400;
          width: 45px;
        }
        .text {
        }
      }
    }
    .evaluationtutor {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: rgba(0, 11, 21, 0.45);
      letter-spacing: 0;
      line-height: 22px;
      font-weight: 400;
      padding: 14px 0;
    }
    /deep/ .el-form-item__label {
      padding: 0;
    }

    .btns {
      text-align: center;
    }
  }
}
</style>
