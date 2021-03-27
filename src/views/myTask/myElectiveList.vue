<template>
  <div class="elective-course">
    <el-row :gutter="20">
      <el-col v-for="(z, k) in courseData" :key="k" :span="6" :style="{ marginBottom: '14px' }">
        <el-card :body-style="{ padding: '0px' }">
          <!-- 封面图片 -->
          <div
            class="coverImg"
            @mouseenter=";(maskVisiable = true), (n = k)"
            @mouseleave=";(maskVisiable = false), (n = k)"
          >
            <img
              :src="z.coverImg"
              width="100%"
              height="100%"
              :style="{ opacity: z.isFinish ? 0.8 : 1 }"
            />
            <div v-if="z.isFinish" class="ended"><el-tag size="mini">已结束</el-tag></div>
            <div v-show="!z.isFinish && maskVisiable && n == k" class="mask-layer">
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
              >
                {{ z.progress ? '继续学习' : '开始学习' }}
              </button>
            </div>
          </div>
          <!-- 内容区域 -->
          <div class="container">
            <h1 :style="{ opacity: z.isFinish ? 0.45 : 1 }">
              {{ z.title.length > 16 ? z.title.slice(0, 16) + '...' : z.title }}
            </h1>
            <!-- 未完成 -->
            <div v-if="!z.isFinish" class="unfinished">
              <div class="lecturer">
                <span>{{ z.headTeacher }}</span>
                <el-divider direction="vertical"></el-divider>
                <span class="iconimage_icon_user iconfont" style="font-size: 12px"></span>
                <span style="margin-left: 5px">{{ z.people }}人</span>
              </div>
              <div class="progress">
                <el-progress :percentage="z.progress"></el-progress>
              </div>
            </div>
            <!-- 已完成 -->
            <div v-else class="completed">
              <div class="course-time" :style="{ opacity: z.isFinish ? 0.45 : 1 }">
                {{ z.startTime }} - {{ z.endTime }}
              </div>
              <el-divider :style="{ opacity: z.isFinish ? 0.45 : 1 }"></el-divider>
              <div class="rate" :style="{ opacity: z.isFinish ? 0.45 : 1 }">
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
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 分页 -->
    <div class="page">
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
export default {
  name: 'MyElectiveList',
  data() {
    return {
      courseData: [
        {
          coverImg: require('@/assets/images/photo1.png'),
          title: '课程标题课程标题课程标题课程标题课程标题课程标题课程标题课程标题',
          headTeacher: '赵老师',
          people: 60,
          progress: 80,
          startTime: '2021/01/01',
          endTime: '2021/12/31',
          rate: 4.8,
          isFinish: false
        },
        {
          coverImg: require('@/assets/images/photo1.png'),
          title: '课程标题课程标题课程标题课程标题课程标题课程标题课程标题课程标题',
          headTeacher: '赵老师',
          people: 60,
          progress: 80,
          startTime: '2021/01/01',
          endTime: '2021/12/31',
          rate: 4.8,
          isFinish: true
        },
        {
          coverImg: require('@/assets/images/photo1.png'),
          title: '课程标题课程标题课程标题课程标题课程标题课程标题课程标题课程标题',
          headTeacher: '赵老师',
          people: 60,
          progress: 0,
          startTime: '2021/01/01',
          endTime: '2021/12/31',
          rate: 4.8,
          isFinish: false
        },
        {
          coverImg: require('@/assets/images/photo1.png'),
          title: '课程标题课程标题课程标题课程标题课程标题课程标题课程标题课程标题',
          headTeacher: '赵老师',
          people: 60,
          progress: 80,
          startTime: '2021/01/01',
          endTime: '2021/12/31',
          rate: 4.8,
          isFinish: true
        },
        {
          coverImg: require('@/assets/images/photo1.png'),
          title: '课程标题课程标题课程标题课程标题课程标题课程标题课程标题课程标题',
          headTeacher: '赵老师',
          people: 60,
          progress: 80,
          startTime: '2021/01/01',
          endTime: '2021/12/31',
          rate: 4.8,
          isFinish: false
        },
        {
          coverImg: require('@/assets/images/photo1.png'),
          title: '课程标题课程标题课程标题课程标题课程标题课程标题课程标题课程标题',
          headTeacher: '赵老师',
          people: 60,
          progress: 80,
          startTime: '2021/01/01',
          endTime: '2021/12/31',
          rate: 4.8,
          isFinish: true
        },
        {
          coverImg: require('@/assets/images/photo1.png'),
          title: '课程标题课程标题课程标题课程标题课程标题课程标题课程标题课程标题',
          headTeacher: '赵老师',
          people: 60,
          progress: 80,
          startTime: '2021/01/01',
          endTime: '2021/12/31',
          rate: 4.8,
          isFinish: false
        },
        {
          coverImg: require('@/assets/images/photo1.png'),
          title: '课程标题课程标题课程标题课程标题课程标题课程标题课程标题课程标题',
          headTeacher: '赵老师',
          people: 60,
          progress: 80,
          startTime: '2021/01/01',
          endTime: '2021/12/31',
          rate: 4.8,
          isFinish: true
        }
      ],
      maskVisiable: false,
      n: 0,
      pageConfig: {
        sizes: [20, 40, 60, 80, 100],
        pageSize: 20,
        pageNo: 1,
        total: 0
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
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
      padding-bottom: 15px;
      .lecturer {
        font-size: 12px;
        color: #8c9195;
      }
      .progress {
        margin-top: 5px;
        /deep/ .el-progress__text {
          color: #01aafc;
          font-size: 12px;
          margin-left: 20px;
        }
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
    float: right;
    margin-top: 10px;
  }
}
</style>
