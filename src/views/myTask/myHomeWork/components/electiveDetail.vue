<template>
  <div class="compulsoryDetail">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/" style="padding: 25px 0 20px">
      <el-breadcrumb-item :to="{ path: '/myTask/myLearn' }">我的任务</el-breadcrumb-item>
      <el-breadcrumb-item>选修课作业</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 头部卡片 -->
    <div class="header-card">
      <el-card>
        <el-row type="flex" style="position: relative">
          <div class="thumbnail">
            <el-image
              :src="studyworkData.coverUrl"
              style="width: 320px; height: 180px; border-radius: 4px"
            ></el-image>
          </div>
          <div class="introduce">
            <div class="title">
              <span class="sort_title">{{ studyworkData.name }}</span>
              <span v-if="studyworkData.status == 1" class="sort_status status_1">未开始</span>
              <span v-if="studyworkData.status == 2" class="sort_status status_2">进行中</span>
              <span v-if="studyworkData.status == 3" class="sort_status status_3">已结束</span>
            </div>
            <div class="content">
              <ul>
                <li>
                  分类：<span>{{ studyworkData.categoryName }}</span>
                </li>
                <li>
                  有效时间：<span>{{
                    studyworkData.startTime &&
                      studyworkData.startTime.slice(0, 10).replace(/-/g, '/')
                  }}
                    -
                    {{
                      studyworkData.endTime && studyworkData.endTime.slice(0, 10).replace(/-/g, '/')
                    }}</span>
                </li>
                <li>
                  讲师：<span>{{ studyworkData.lecturerName }}</span>
                </li>
                <li>
                  <span class="info_bottom_details"><i class="iconimage_icon_user iconfont iconInfo"></i>{{ studyworkData.peopleNum }}人</span>
                  <span class="info_bottom_details"><i class="iconimage_icon_time1 iconfont iconInfo"></i>{{ studyworkData.period }}h</span>
                  <span class="info_bottom_details"><i class="iconjifen iconfont iconInfo"></i>{{ studyworkData.credit }}积分</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="rate">
            <el-rate
              disabled
              show-score
              text-color="rgba(0,11,21,0.65)"
              score-template="{value}分"
              :value="studyworkData.composite || 0"
            >
            </el-rate>
          </div>
        </el-row>
      </el-card>
    </div>
    <!-- 全部课程 -->
    <elective-table></elective-table>
  </div>
</template>

<script>
import { electiveWorkDetail } from '@/api/myTask'
import electiveTable from './electiveTable'
export default {
  name: 'ElectiveDetail',
  components: {
    electiveTable
  },
  data() {
    return {
      studyworkData: {}
    }
  },
  mounted() {
    this.getWorkDetail()
  },
  methods: {
    async getWorkDetail() {
      await electiveWorkDetail({ id: this.$route.query.id }).then((res) => {
        this.studyworkData = res
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.compulsoryDetail {
  .introduce {
    margin-left: 40px;
    .sort_title {
      font-size: 18px;
      color: #000b15;
      font-weight: bold;
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
    .content {
      margin-top: 15px;
      ul li {
        font-size: 14px;
        color: rgba(0, 11, 21, 0.45);
        line-height: 32px;
        span {
          color: rgba(0, 11, 21, 0.85);
        }
        span.info_bottom_details {
          color: rgba(0, 11, 21, 0.65);
          margin-right: 25px;
          .iconInfo {
            margin-right: 8px;
            font-size: 14px;
          }
        }
      }
    }
  }
  .rate {
    position: absolute;
    top: 0;
    right: 0;
  }
}
</style>
