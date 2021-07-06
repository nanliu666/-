<template>
  <div v-loading="loading" class="elective-course">
    <el-row v-if="courseData.length">
      <el-col v-for="(z, k) in courseData" :key="k" :span="6" :style="{ marginBottom: '14px' }">
        <el-card :body-style="{ padding: '0px', cursor: 'pointer' }" @click.native="goToCourse(z)">
          <!-- 封面图片 -->
          <div class="coverImg">
            <img
              :src="z.coverUrl"
              width="100%"
              height="100%"
              :style="{ opacity: z.totalPrecent == 100 ? 0.8 : 1 }"
            />
          </div>
          <!-- 内容区域 -->
          <div class="container">
            <h1 :style="{ opacity: z.totalPrecent == 100 ? 0.45 : 1 }">
              {{ z.name.length > 16 ? z.name.slice(0, 16) + '...' : z.name }}
            </h1>
            <!-- 未完成 -->
            <div class="unfinished">
              <div class="card-submitted">
                作业提交次数<span style="margin-left: 15px">{{ z.jobTimes }}/{{ z.jobNum }}</span>
              </div>
              <div v-if="z.jobPercent == 100" class="success-icon">
                <img :src="require('@/assets/images/my_seal.png')" width="100%" height="100%" />
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <div v-else style="text-align: center">
      <img src="@/assets/images/nodata.png" />
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
import { electiveWorkList } from '@/api/myTask'
export default {
  name: 'ElectiveCourse',
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
      await electiveWorkList(params)
        .then((res) => {
          this.courseData = res.data
          this.pageConfig.total = res.totalNum
        })
        .finally(() => {
          this.loading = false
        })
    },
    goToCourse(data) {
      this.$router.push({
        path: '/myTask/electiveDetail',
        query: { id: data.id }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.elective-course {
  .coverImg {
    position: relative;
    width: 100%;
    height: 166px;
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
        top: -25px;
      }
      .card-submitted {
        opacity: 0.65;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #000b15;
        line-height: 18px;
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
  .el-card {
    transition-duration: 0.3s;
  }
  .el-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 9px 12px 0 rgba(0, 63, 161, 0.12);
  }
  .page {
    text-align: right;
    margin-top: 10px;
  }
  ::v-deep .el-col.el-col-6 {
    padding: 0 !important;
    margin: 0 !important;
    width: 285px;
    height: 282px;
    margin-right: 20px !important;
    margin-bottom: 20px !important;
    &:nth-of-type(4n) {
      margin-right: 0 !important;
    }
  }
  ::v-deep .el-card.is-always-shadow {
    height: 282px;
    width: 285px;
  }
}
</style>
