<template>
  <div v-loading="loading" class="elective-course">
    <el-row v-if="courseData.length" :gutter="20">
      <el-col v-for="(z, k) in courseData" :key="k" :span="6" :style="{ marginBottom: '14px' }">
        <el-card :body-style="{ padding: '0px' }">
          <!-- 封面图片 -->
          <div
            class="coverImg"
            @mouseenter=";(maskVisiable = true), (n = k)"
            @mouseleave=";(maskVisiable = false), (n = k)"
          >
            <img
              :src="z.coverUrl"
              width="100%"
              height="100%"
              :style="{ opacity: z.totalPrecent == 100 ? 0.8 : 1 }"
            />
            <!-- <div v-if="z.totalPrecent == 100" class="ended">
              <el-tag size="mini">已结束</el-tag>
            </div> -->
            <div v-show="maskVisiable && n == k" class="mask-layer">
              <button
                style="
                  width: 84px;
                  height: 32px;
                  background: rgba(255, 255, 255, 0.2);
                  border: 1px solid #ffffff;
                  border-radius: 4px;
                  font-size: 14px;
                  color: #ffffff;
                  margin-top: 70px;
                "
                @click="goToCourse(z)"
              >
                继续学习
              </button>
            </div>
          </div>
          <!-- 内容区域 -->
          <div class="container">
            <h1 :style="{ opacity: z.totalPrecent == 100 ? 0.45 : 1 }">
              {{ z.name.length > 16 ? z.name.slice(0, 16) + '...' : z.name }}
            </h1>
            <!-- 未完成 -->
            <div class="unfinished">
              <div class="lecturer">
                <span>{{ z.teacherName }}</span>
                <el-divider direction="vertical"></el-divider>
                <span class="iconimage_icon_user iconfont" style="font-size: 12px"></span>
                <span style="margin-left: 5px">{{ z.studyNum }}人</span>
              </div>
              <div class="progress">
                <el-progress :percentage="z.totalPrecent"></el-progress>
              </div>
              <div v-if="z.totalPrecent == 100" class="success-icon">
                <img :src="require('@/assets/images/my_seal.png')" width="100%" height="100%" />
              </div>
            </div>
            <!-- 已完成 -->
            <!-- <div v-else class="completed">
              <div class="course-time" :style="{ opacity: z.totalPrecent == 100 ? 0.45 : 1 }">
                {{ z.startTime }} - {{ z.endTime }}
              </div>
              <el-divider :style="{ opacity: z.totalPrecent == 100 ? 0.45 : 1 }"></el-divider>
              <div class="rate" :style="{ opacity: z.totalPrecent == 100 ? 0.45 : 1 }">
                <el-rate
                  v-model="z.rate"
                  disabled
                  show-score
                  score-template="{value}分"
                  :allow-half="true"
                >
                </el-rate>
              </div>
              <div class="success-icon">
                <img :src="require('@/assets/images/my_seal.png')" width="100%" height="100%" />
              </div>
            </div> -->
          </div>
        </el-card>
      </el-col>
    </el-row>
    <div v-else style="text-align: center">
      <img src="../../assets/images/nodata.png" />
      <div>暂无数据</div>
    </div>
    <!-- 分页 -->
    <div v-if="courseData.length" class="page">
      <el-pagination
        :current-page="pageConfig.pageNo"
        :page-sizes="pageConfig.sizes"
        :page-size="pageConfig.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageConfig.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { myElectiveCourse } from '@/api/myTask'
export default {
  name: 'MyElectiveList',
  data() {
    return {
      courseData: [],
      maskVisiable: false,
      n: 0,
      pageConfig: {
        sizes: [20, 40, 60, 80, 100],
        pageSize: 20,
        pageNo: 1,
        total: 0
      },
      statusFlag: {
        1: '未开始',
        2: '进行中',
        3: '已结束'
      },
      loading: false
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    handleSizeChange(val) {
      this.pageConfig.pageSize = val
      this.initData()
    },
    handleCurrentChange(val) {
      this.pageConfig.pageNo = val
      this.initData()
    },
    async initData() {
      let params = {
        pageNo: this.pageConfig.pageNo,
        pageSize: this.pageConfig.pageSize
      }
      this.loading = true
      await myElectiveCourse(params)
        .then((res) => {
          this.courseData = res.data
          this.pageConfig.total = res.totalNum
        })
        .finally(() => {
          this.loading = false
        })
    },
    goToCourse(data) {
      this.$router.push({ path: '/course/detail', query: { id: data.id } })
    }
  }
}
</script>

<style lang="scss" scoped>
.elective-course {
  .coverImg {
    position: relative;
    width: 100%;
    height: 172px;
    .ended {
      position: absolute;
      top: 8px;
      right: 8px;
    }
    .mask-layer {
      position: absolute;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.45);
      top: 0;
      left: 0;
      text-align: center;
    }
  }
  .container {
    padding: 0 16px;
    h1 {
      font-size: 14px;
      color: #000b15;
    }
    .unfinished {
      position: relative;
      padding-bottom: 15px;
      .lecturer {
        font-size: 12px;
        color: #8c9195;
      }
      .progress {
        margin-top: 5px;
        /deep/ .el-progress__text {
          color: #01aafc;
          font-size: 12px !important;
          margin-left: 20px;
        }
      }
      .success-icon {
        position: absolute;
        width: 62px;
        height: 54px;
        right: 0;
        top: -10px;
      }
    }
    .completed {
      position: relative;
      padding-bottom: 6px;
      /deep/ .el-divider--horizontal {
        margin: 8px 0 5px !important;
      }
      /deep/ .el-rate__text {
        font-size: 12px;
        color: #000b15;
      }
      .course-time {
        font-size: 12px;
      }
      .success-icon {
        position: absolute;
        width: 62px;
        height: 54px;
        right: 0;
        top: -10px;
      }
    }
  }
  .page {
    text-align: right;
    margin-top: 10px;
  }
}
</style>
