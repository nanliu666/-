<template>
  <div class="learn-list-style">
    <el-card class="nav-container">
      <div class="nav-title">
        <span>全部课程</span>
        <span v-if="!_.isEmpty(menuList)">（{{ menuList[0].num + menuList[1].num }}）</span>
      </div>
      <div v-for="(menuItem, menuIndex) in menuList" :key="menuIndex" class="course-list">
        <div
          class="course-title"
          :class="{ active: menuActive(menuItem) }"
          @click="toggleShow(menuItem.type)"
        >
          <span>
            <span>我的{{ menuIndex === 0 ? '必修' : '选修' }}</span>
            <span>（{{ menuItem.num }}）</span>
          </span>
          <i
            :class="[
              currentFirstType === menuItem.type ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
            ]"
          />
        </div>
        <ul
          v-if="currentFirstType === menuItem.type && !_.isEmpty(menuItem.courseList)"
          class="course-ul"
        >
          <li
            v-for="(item, index) in menuItem.courseList"
            :key="item.id"
            :class="{ active: menuLiActive(index) }"
            class="course-li"
            @click="selectLi(index, item)"
          >
            <span>{{ item.menuName }}</span>
            <span v-if="item.num">({{ item.num }})</span>
          </li>
        </ul>
      </div>
    </el-card>
    <el-card v-loading="containerLoad" class="li-container">
      <div class="top">
        <el-input
          v-model="queryInfo.name"
          placeholder="请输入课程名字"
          style="width: 380px"
          prefix-icon="el-icon-search"
          clearable
          @input="searchFun"
        />
        <div class="split"></div>
        <div v-if="currentFirstType === 'required'">
          <div class="status-box">
            <span class="label">状态</span>
            <el-radio-group v-model="queryInfo.status" class="status-radio" @change="statusChange">
              <el-radio :label="0">
                全部
              </el-radio>
              <el-radio :label="1">
                未开始
              </el-radio>
              <el-radio :label="2">
                进行中
              </el-radio>
              <el-radio :label="3">
                已结束
              </el-radio>
            </el-radio-group>
          </div>
          <div class="time-box">
            <span class="label">日期范围</span>
            <el-date-picker
              v-model="queryInfo.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
            <el-button type="primary" style="margin-left: 10px" size="medium" @click="submitSearch">
              查询
            </el-button>
          </div>
        </div>
      </div>
      <div class="bottom">
        <ul v-if="!_.isEmpty(courseList)" class="bottom-ul">
          <li v-for="(item, index) in courseList" :key="index" class="bottom-li">
            <div class="li-top">
              <div class="li-left" @click="startStudy(item)">
                <img
                  :src="item.coverUrl"
                  class="left-image"
                  onerror="this.classList.add('error');"
                  :alt="item.name || '暂无数据'"
                />
                <span class="icon-box">
                  <i class="el-icon-caret-right" />
                </span>
              </div>
              <div class="li-right">
                <div class="content-box">
                  <div class="content-title">
                    <div class="title" @click="startStudy(item)">
                      {{ item.name }}
                    </div>
                    <el-tag v-if="item.status" :type="statusFilter(item.status).type">
                      {{ statusFilter(item.status).text }}
                    </el-tag>
                  </div>
                  <div class="time-progress">
                    <div class="content-time">
                      学习期限：{{ item.startTime }} - {{ item.endTime }}
                    </div>
                    <div class="content-progress">
                      <span class="progress-title">已完成：</span>
                      <el-progress class="progress" :percentage="item.progress"></el-progress>
                    </div>
                  </div>
                  <div class="file-button">
                    <el-button
                      v-if="_.size(item.examList)"
                      size="small"
                      @click="expandMore('examList', index)"
                    >
                      <span style="margin-right: 6px">
                        <span>考试</span>
                        <span>{{ _.size(item.examList) }}</span>
                      </span>
                      <i
                        :class="[
                          currentTestExpand === index && currentExpandType === 'examList'
                            ? 'el-icon-arrow-up'
                            : 'el-icon-arrow-down'
                        ]"
                      />
                    </el-button>
                    <el-button
                      v-if="_.size(item.attachList)"
                      size="small"
                      @click="expandMore('attachList', index)"
                    >
                      <span style="margin-right: 6px">
                        <span>附件</span>
                        <span>{{ _.size(item.attachList) }}</span>
                      </span>
                      <i
                        :class="[
                          currentFileExpand === index && currentExpandType === 'attachList'
                            ? 'el-icon-arrow-up'
                            : 'el-icon-arrow-down'
                        ]"
                      />
                    </el-button>
                  </div>
                </div>
                <div class="handle-box">
                  <el-button
                    v-if="item.status !== 3"
                    type="primary"
                    style="margin-left: 10px"
                    size="medium"
                    :disabled="item.status === 1"
                    @click="startStudy(item)"
                  >
                    {{ item.progress === 0 ? '开始学习' : '继续学习' }}
                  </el-button>
                </div>
              </div>
            </div>
            <el-card
              v-if="currentTestExpand === index || currentFileExpand === index"
              class="file-card"
            >
              <li v-for="(fileItem, fileIndex) in expandList" :key="fileIndex" class="file-card-li">
                <div class="file-left">
                  <div class="file-title">
                    <span v-if="_.size(fileItem.fileName) <= 10" class="title">{{
                      currentExpandType === 'examList' ? fileItem.examName : fileItem.fileName
                    }}</span>
                    <el-tooltip
                      v-else
                      class="item"
                      effect="dark"
                      :content="
                        currentExpandType === 'examList' ? fileItem.examName : fileItem.fileName
                      "
                      placement="top-start"
                    >
                      <span class="title ellipsis">{{
                        currentExpandType === 'examList' ? fileItem.examName : fileItem.fileName
                      }}</span>
                    </el-tooltip>
                    <el-tag
                      v-if="currentExpandType === 'examList'"
                      :type="statusFilter(item.status).type"
                    >
                      {{ statusFilter(item.status).text }}
                    </el-tag>
                  </div>
                  <div class="file-time">
                    <span>{{ currentExpandType === 'examList' ? '考试' : '下载' }}期限：</span>
                    <span>{{
                      currentExpandType === 'examList'
                        ? `${fileItem.examBeginTime} - ${fileItem.examEndTime}`
                        : `${fileItem.downloadDeadline ? fileItem.downloadDeadline : '永久有效'}`
                    }}
                    </span>
                  </div>
                </div>
                <el-button
                  v-if="currentExpandType === 'examList'"
                  size="small"
                  type="primary"
                  plain
                  :disabled="disabledJoinButton(fileItem)"
                  @click="joinExam(fileItem)"
                >
                  参加
                </el-button>
                <el-button
                  v-else
                  size="small"
                  type="primary"
                  plain
                  :disabled="moment(new Date()).isSameOrAfter(moment(fileItem.downloadDeadline))"
                  @click="downloadFileFun(fileItem)"
                >
                  下载
                </el-button>
              </li>
              <div
                v-if="
                  (currentExpandType === 'examList' &&
                    _.size(item.examList) - _.size(expandList) > 0) ||
                    (currentExpandType === 'attachList' &&
                      _.size(item.attachList) - _.size(expandList) > 0)
                "
                class="more-file"
                @click="getMore(index)"
              >
                <span style="margin-right: 10px; cursor: pointer">展开更多{{
                  _.size(currentExpandType === 'examList' ? item.examList : item.attachList) - 3
                }}个{{ currentExpandType === 'examList' ? '考试' : '附件' }}</span>
                <i
                  :class="[
                    currentFirstType === 'required' ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
                  ]"
                />
              </div>
            </el-card>
          </li>
        </ul>
        <common-empty v-else />
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
import { getRequireCourse, getElectiveCourseList, getStudyCenterMenu } from '@/api/learn'
import moment from 'moment'
import CommonEmpty from '@/components/common-empty/Empty'
import examUtils from '@/views/exam/examUtils'
import { downLoadFile } from '@/util/util'
const STATUS = {
  0: {
    text: '全部',
    type: 'success'
  },
  1: {
    text: '未开始',
    type: 'success'
  },
  2: {
    text: '进行中',
    type: 'danger'
  },
  3: {
    text: '已结束',
    type: 'info'
  }
}
export default {
  name: 'LearnList',
  components: {
    CommonEmpty
  },
  data() {
    return {
      containerLoad: false,
      expandList: [],
      currentExpandType: '',
      currentTestExpand: -1,
      currentFileExpand: -1,
      currentFirstType: 'required',
      currentRequiredNav: -1,
      currentElectiveNav: -1,
      menuList: [],
      totalNum: 0,
      queryInfo: {
        pageNo: 1,
        pageSize: 10,
        status: 0,
        name: '',
        id: '',
        courseType: '', //菜单栏类型（值为studyPlan或者train）
        dateRange: []
      },
      courseList: []
    }
  },
  async created() {
    await this.loadMenu()
    this.loadTableData()
  },
  methods: {
    moment,
    statusChange() {
      this.loadTableData()
    },
    disabledJoinButton(fileItem) {
      return examUtils.JoinDisabled(fileItem)
    },
    //下载文件
    downloadFileFun(fileItem) {
      downLoadFile(fileItem)
    },
    // 参加考试
    joinExam(row) {
      const { tips, isReNew, isShowConfirm } = examUtils.getJoinExamTips(row)
      this.$confirm(tips, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showConfirmButton: isShowConfirm,
        type: 'warning'
      }).then(() => {
        this.$router.push({
          name: 'ExamPaper',
          query: { examId: row.examId, batchId: row.batchId, isReNew: isReNew }
        })
      })
    },
    statusFilter(status) {
      return STATUS[status]
    },
    // 必修/选修切换
    menuActive(menuItem) {
      this.queryInfo.pageNo = 1
      const type = this.currentFirstType === menuItem.type
      const isShow =
        menuItem.type === 'required' ? this.currentRequiredNav : this.currentElectiveNav
      return type && isShow === -1
    },
    // 子课程切换
    menuLiActive(index) {
      this.queryInfo.pageNo = 1
      const isShow =
        this.currentFirstType === 'required' ? this.currentRequiredNav : this.currentElectiveNav
      return isShow === index
    },
    // 加载左侧菜单栏
    async loadMenu() {
      const soruce = await getStudyCenterMenu()
      _.each(soruce, (item, index) => {
        item.type = index === 0 ? 'required' : 'elective'
      })
      this.menuList = soruce
    },
    // 展开课程
    getMore(index) {
      this.expandList = this.courseList[index][this.currentExpandType]
    },
    expandMore(type, index) {
      this.expandList = this.courseList[index][type].slice(0, 3)
      this.currentExpandType = type
      if (type === 'examList') {
        this.currentTestExpand = this.currentTestExpand === index ? -1 : index
        this.currentFileExpand = -1
      } else {
        this.currentTestExpand = -1
        this.currentFileExpand = this.currentFileExpand === index ? -1 : index
      }
    },
    startStudy(data) {
      this.$router.push({ path: '/course/learn', query: { courseId: data.id } })
    },
    // 切换必修/选修
    toggleShow(type) {
      this.currentFirstType = type
      // 去除必修选修内部id，重新加载
      this.queryInfo.id = ''
      this.queryInfo.courseType = ''
      this.loadTableData()
    },
    selectLi(index, item) {
      if (this.currentFirstType === 'required') {
        this.currentRequiredNav = index
      } else {
        this.currentElectiveNav = index
      }
      this.queryInfo.courseType = item.courseType
      this.queryInfo.id = item.id
      this.loadTableData()
    },
    searchFun: _.debounce(function() {
      this.loadTableData()
    }, 500),
    submitSearch() {
      const dateRange = _.cloneDeep(this.queryInfo.dateRange)
      this.queryInfo.dateRange = _.map(dateRange, (item) => {
        item = moment(item).format('YYYY-MM-DD HH:mm:ss')
        return item
      })
      this.loadTableData()
    },
    // 加载右侧课程列表
    loadTableData() {
      this.courseList = []
      this.containerLoad = true
      const loadFun =
        this.currentFirstType === 'required' ? getRequireCourse : getElectiveCourseList
      loadFun(this.queryInfo)
        .then(({ data, totalNum }) => {
          _.each(data, (item) => {
            item.userPeriod = item.userPeriod === '' ? 0 : item.userPeriod
            item.progress = item.period === 0 ? 0 : Math.round(item.userPeriod / (item.period * 60))
          })
          this.courseList = data
          this.totalNum = totalNum
        })
        .catch(() => {
          window.console.error('参数：', JSON.stringify(this.queryInfo))
        })
        .finally(() => {
          this.containerLoad = false
        })
    },
    handleSizeChange(val) {
      this.queryInfo.pageSize = val
      this.loadTableData()
    },
    handleCurrentChange(val) {
      this.queryInfo.pageNo = val
      this.loadTableData()
    }
  }
}
</script>

<style scoped lang="scss">
/deep/ .el-tag {
  height: 20px;
  line-height: 20px;
}
/deep/ .el-range-separator {
  padding: 0;
}
.learn-list-style {
  /deep/ .el-range__icon {
    margin-top: -5px;
  }
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
            cursor: pointer;
            margin-right: 24px;
            width: 220px;
            height: 100%;
            position: relative;
            border-radius: 4px;
            overflow: hidden;
            .left-image {
              width: 100%;
              height: 100%;
              object-fit: contain;
              border: 1px solid #ebeced;
              border-radius: 4px;
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
                  cursor: pointer;
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
                  display: flex;
                  align-items: center;
                  font-family: PingFangSC-Regular;
                  font-size: 14px;
                  color: rgba(0, 11, 21, 0.85);
                  margin-right: 8px;
                  width: 150px;
                  .title {
                    margin-right: 8px;
                    max-width: 100px;
                    display: inline-block;
                    flex: 1;
                  }
                }

                .file-time {
                  font-family: PingFangSC-Regular;
                  font-size: 14px;
                  color: rgba(0, 11, 21, 0.65);
                  margin-left: 40px;
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
