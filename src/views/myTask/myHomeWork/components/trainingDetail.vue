<template>
  <div class="compulsoryDetail">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/" style="padding: 25px 0 20px">
      <el-breadcrumb-item :to="{ path: '/myTask/myLearn' }">我的任务</el-breadcrumb-item>
      <el-breadcrumb-item>培训作业</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 头部卡片 -->
    <div class="header-card">
      <el-card>
        <el-row type="flex">
          <div class="introduce">
            <div class="title">
              <span class="sort_title">{{ studyworkData.name }}</span>
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
        <el-row style="margin-top: 20px">
          <el-col :span="8">
            <div class="describe">
              分类：<span class="describe_item">{{ studyworkData.categoryName }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="describe">
              培训方式：<span class="describe_item">{{ trainWayBoj[studyworkData.trainWay] }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="describe">
              班主任：<span class="describe_item">{{ studyworkData.headTeacher }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="describe">
              培训时间：<span class="describe_item">{{ studyworkData.startTime }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="describe">
              联系人：<span class="describe_item">{{ studyworkData.contacts }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="describe">
              助教：<span class="describe_item">{{ studyworkData.assistant }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="describe">
              培训对象：<span class="describe_item">{{ studyworkData.trainObject }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="describe">
              联系电话：<span class="describe_item">{{ studyworkData.phoneNum }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="describe">
              承办单位：<span class="describe_item">{{ studyworkData.organizer }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="describe">
              培训地点：<span class="describe_item">{{ studyworkData.trainAddress }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="describe">
              主办单位：<span class="describe_item">{{ studyworkData.sponsor }}</span>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </div>
    <!-- 全部课程 -->
    <training-table></training-table>
  </div>
</template>

<script>
import { trainWorkDetail } from '@/api/myTask'
import trainingTable from './trainingTable'
export default {
  name: 'CompulsoryDetail',
  components: {
    trainingTable
  },
  data() {
    return {
      studyworkData: {},
      trainWayBoj: {
        1: '在线',
        2: '面授',
        3: '混合'
      }
    }
  },
  mounted() {
    this.getWorkDetail()
  },
  methods: {
    async getWorkDetail() {
      await trainWorkDetail({ id: this.$route.query.id }).then((res) => {
        this.studyworkData = res
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.compulsoryDetail {
  .introduce {
    .sort_title {
      font-size: 18px;
      color: #000b15;
      font-weight: bold;
    }
  }
  .rate {
    position: absolute;
    top: 0;
    right: 0;
  }
  .describe {
    font-size: 14px;
    color: rgba(0, 11, 21, 0.45);
    line-height: 30px;
    &_item {
      color: rgba(0, 11, 21, 0.85);
    }
  }
}
</style>
