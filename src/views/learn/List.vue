<template>
  <div class="learn-list-style">
    <el-card class="nav-container">
      <div class="nav-title">
        <span>全部课程</span>
        <span>（25）</span>
      </div>
      <div class="course-list">
        <div
          class="course-title"
          :class="{ active: currentFirstType === 'required' }"
          @click="toggleShow('required')"
        >
          <span>
            <span>我的必修</span>
            <span>（15）</span>
          </span>
          <i
            :class="[currentFirstType === 'required' ? 'el-icon-arrow-up' : 'el-icon-arrow-down']"
          />
        </div>
        <ul
          v-if="currentFirstType === 'required'"
          class="course-ul"
        >
          <li
            v-for="(item, index) in obligatoryList"
            :key="index"
            :class="{ active: currentRequiredNav === index }"
            class="course-li"
            @click="selectLi(index, 'required')"
          >
            <span>{{ item.name }}</span>
            <span v-if="item.number">({{ item.number }})</span>
          </li>
        </ul>
      </div>
      <div class="course-list">
        <div
          class="course-title "
          :class="{ active: currentFirstType === 'elective' }"
          @click="toggleShow('elective')"
        >
          <span>
            <span>我的选修</span>
            <span>（15）</span>
          </span>
          <i
            :class="[currentFirstType === 'elective' ? 'el-icon-arrow-up' : 'el-icon-arrow-down']"
          />
        </div>
        <ul
          v-if="currentFirstType === 'elective'"
          class="course-ul"
        >
          <li
            v-for="(item, index) in obligatoryList"
            :key="index"
            :class="{ active: currentElectiveNav === index }"
            class="course-li"
            @click="selectLi(index, 'elective')"
          >
            <span>{{ item.name }}</span>
            <span v-if="item.number">({{ item.number }})</span>
          </li>
        </ul>
      </div>
    </el-card>
    <el-card class="li-container">
      <div class="top">
        <el-input
          v-model="queryInfo.search"
          placeholder="请输入课程名字"
          style="width: 380px"
          @input="searchFun"
        >
          <i
            slot="suffix"
            class="el-input__icon el-icon-search"
          ></i>
        </el-input>
        <div class="split"></div>
        <div class="status-box">
          <span class="label">状态</span>
          <el-radio-group
            v-model="queryInfo.radio"
            class="status-radio"
          >
            <el-radio :label="0">
              全部
            </el-radio>
            <el-radio :label="1">
              未选择
            </el-radio>
            <el-radio :label="2">
              未开始
            </el-radio>
            <el-radio :label="3">
              进行中
            </el-radio>
            <el-radio :label="4">
              已结束
            </el-radio>
          </el-radio-group>
        </div>
        <div class="time-box">
          <span class="label">日期范围</span>
          <el-date-picker
            v-model="queryInfo.time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
          <el-button
            type="primary"
            style="margin-left: 10px"
            size="medium"
            @click="search"
          >
            查询
          </el-button>
        </div>
      </div>
      <div class="bottom">
        <ul class="bottom-ul">
          <li
            v-for="(item, index) in courseList"
            :key="index"
            class="bottom-li"
          >
            <div class="li-top">
              <div class="li-left">
                <img
                  src="https://image.zhangxinxu.com/image/blog/202012/css-touch-scroll-cover.png"
                  class="left-image"
                />
                <span class="icon-box">
                  <i class="el-icon-caret-right" />
                </span>
              </div>
              <div class="li-right">
                <div class="content-box">
                  <div class="content-title">
                    <div class="title">
                      {{ item.name }}
                    </div>
                    <el-tag type="success">
                      未开始
                    </el-tag>
                  </div>
                  <div class="time-progress">
                    <div class="content-time">
                      学习期限：{{ item.time[0] }} - {{ item.time[1] }}
                    </div>
                    <div class="content-progress">
                      <span class="progress-title">已完成：</span>
                      <el-progress
                        class="progress"
                        :percentage="50"
                      ></el-progress>
                    </div>
                  </div>
                  <div class="file-button">
                    <el-button size="small">
                      <span style="margin-right: 6px">考试4</span>
                      <i class="el-icon-arrow-down" />
                    </el-button>
                    <el-button size="small">
                      <span style="margin-right: 6px">附件4</span>
                      <i class="el-icon-arrow-up" />
                    </el-button>
                  </div>
                </div>
                <div class="handle-box">
                  <el-button
                    type="primary"
                    style="margin-left: 10px"
                    size="medium"
                    @click="search"
                  >
                    开始学习
                  </el-button>
                </div>
              </div>
            </div>
            <el-card class="file-card">
              <li
                v-for="(fileItem, fileIndex) in item.test"
                :key="fileIndex"
                class="file-card-li"
              >
                <div class="file-left">
                  <div class="file-title">
                    <span style="margin-right: 8px">{{ fileItem.name2 }}</span>
                    <el-tag type="success">
                      未开始
                    </el-tag>
                  </div>
                  <div class="file-time">
                    <span>考试期限：</span>
                    <span>{{ fileItem.time[0] }} - {{ fileItem.time[1] }}</span>
                  </div>
                </div>
                <el-button
                  size="small"
                  type="primary"
                  plain
                >
                  参加
                </el-button>
              </li>
              <div
                v-if="_.size(item.test) > 3"
                class="more-file"
                @click="getMore"
              >
                <span style="margin-right: 10px">展开更多{{ _.size(item.test) - 3 }}个考试</span>
                <i
                  :class="[
                    currentFirstType === 'required' ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
                  ]"
                />
              </div>
            </el-card>
          </li>
        </ul>
        <el-pagination
          class="pagination-box"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="queryInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNum"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'LearnList',
  data() {
    return {
      currentFirstType: 'required',
      currentRequiredNav: 0,
      currentElectiveNav: 0,
      obligatoryList: [
        {
          name: '新员工入职',
          number: 5
        },
        {
          name: '企业文化',
          number: 8
        },
        {
          name: '马克',
          number: 3
        }
      ],
      totalNum: 100,
      queryInfo: {
        pageNo: 1,
        pageSize: 10,
        search: '',
        radio: 0,
        time: ''
      },
      courseList: [
        {
          status: 0,
          image: '',
          hasVideo: true,
          name: '应用数学',
          time: ['2019-10-02 12:14', '2020-01-02 13:12'],
          progress: '60',
          test: [
            {
              name2: '企业文化考试',
              time: ['2019-10-02 12:14', '2020-01-02 13:12'],
              status: 0
            },
            {
              name2: '企业文化考试',
              time: ['2019-10-02 12:14', '2020-01-02 13:12'],
              status: 0
            },
            {
              name2: '企业文化考试',
              time: ['2019-10-02 12:14', '2020-01-02 13:12'],
              status: 0
            },
            {
              name2: '企业文化考试',
              time: ['2019-10-02 12:14', '2020-01-02 13:12'],
              status: 0
            }
          ],
          attachments: [
            {
              name1: '员工行为守则',
              time1: ['2019-10-02 12:14', '2020-01-02 13:12']
            }
          ]
        }
      ]
    }
  },
  created() {},
  methods: {
    toggleShow(type) {
      this.currentFirstType = type
    },
    selectLi(index, type) {
      if (type === 'required') {
        this.currentRequiredNav = index
      } else {
        this.currentElectiveNav = index
      }
    },
    searchFun: _.debounce(function() {
      this.loadTableData()
    }, 500),
    search() {
      this.loadTableData()
    },
    loadTableData() {},
    handleSizeChange(val) {
      this.queryInfo.pageSize = val
      this.loadTableData()
    },
    handleCurrentChange(val) {
      this.queryInfo.pageNo = val
      this.loadTableData()
    },
    getMore() {}
  }
}
</script>

<style scoped lang="scss">
/deep/ .el-tag {
  height: 20px;
  line-height: 20px;
}
.learn-list-style {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .nav-container {
    margin-right: 20px;
    width: 285px;
    /deep/ .el-card__body {
      padding: 14px 0px;
    }
    .nav-title {
      font-family: PingFangSC-Medium;
      font-size: 18px;
      color: rgba(0, 11, 21, 0.85);
      font-weight: 550;
      margin-bottom: 14px;
      padding: 0 24px;
    }
    .course-list {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: rgba(0, 11, 21, 0.85);
      .active {
        color: $primaryColor;
        background-color: rgba($primaryColor, 0.1);
      }
      .course-title {
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 24px;
        cursor: pointer;
      }
      .course-ul {
        .course-li {
          padding-left: 48px;
          cursor: pointer;
          height: 48px;
          display: flex;
          align-items: center;
        }
      }
    }
  }
  .li-container {
    flex: 1;
    .top {
      margin-bottom: 40px;
      .split {
        border-bottom: 1px solid #ebeced;
        margin: 16px 0;
      }
      .label {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: rgba(0, 11, 21, 0.65);
        width: 56px;
        margin-right: 10px;
      }
      .status-box {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 16px;
        .status-radio {
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }
      }
      .time-box {
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }
    }
    .bottom {
      .bottom-ul {
        margin-top: 40px;
        .bottom-li {
          margin-bottom: 40px;
          .li-top {
            height: 124px;
            display: flex;
            justify-content: space-between;
          }
          .li-left {
            margin-right: 24px;
            width: 220px;
            height: 100%;
            position: relative;
            border-radius: 4px;
            overflow: hidden;
            .left-image {
              width: 100%;
              height: 100%;
            }
            .icon-box {
              position: absolute;
              background-color: rgba(0, 11, 21, 0.45);
              width: 32px;
              height: 32px;
              border-radius: 100%;
              bottom: 8px;
              right: 8px;
              display: flex;
              justify-content: center;
              align-items: center;
              .el-icon-caret-right {
                color: #fff;
              }
            }
          }
          .li-right {
            flex: 1;
            height: 100%;
            display: flex;
            justify-content: space-between;
            .content-box {
              display: flex;
              align-items: stretch;
              flex-direction: column;
              justify-content: space-between;
              min-width: 70%;
              .content-title {
                display: flex;
                align-items: center;
                .title {
                  font-family: PingFangSC-Medium;
                  font-size: 16px;
                  color: rgba(0, 11, 21, 0.85);
                  font-weight: 500;
                  margin-right: 16px;
                }
              }
              .time-progress {
                font-family: PingFangSC-Regular;
                font-size: 12px;
                color: rgba(0, 11, 21, 0.45);
                .content-time {
                  margin-bottom: 8px;
                }
                .content-progress {
                  position: relative;
                  .progress-title {
                    position: absolute;
                    bottom: 1px;
                  }
                  .progress {
                    margin-left: 45px;
                  }
                }
              }
              .file-button {
                display: flex;
                align-items: center;
              }
            }
            .handle-box {
              padding-top: 30px;
            }
          }
          .file-card {
            width: 100%;
            margin-top: 16px;
            /deep/ .el-card__body {
              padding-top: 0;
              padding-bottom: 0;
            }
            .file-card-li {
              display: flex;
              justify-content: space-between;
              align-items: center;
              height: 48px;
              border-bottom: 1px solid #ebeced;
              .file-left {
                display: flex;
                align-items: center;
                .file-title {
                  font-family: PingFangSC-Regular;
                  font-size: 14px;
                  color: rgba(0, 11, 21, 0.85);
                  margin-right: 8px;
                }

                .file-time {
                  font-family: PingFangSC-Regular;
                  font-size: 14px;
                  color: rgba(0, 11, 21, 0.65);
                  margin-left: 48px;
                }
              }
              /deep/ .el-button--primary.is-plain {
                width: 56px;
              }
            }
            .more-file {
              height: 48px;
              display: flex;
              justify-content: center;
              align-items: center;
              color: $primaryColor;
            }
          }
        }
      }
      .pagination-box {
        float: right;
        padding-bottom: 24px;
      }
    }
  }
}
</style>
