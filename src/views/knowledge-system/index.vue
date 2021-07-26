<template>
  <div class="knowledge-system">
    <div class="plane-wrapper">
      <div
        v-if="knowledgeLevel.length"
        class="plane-outer"
        :style="{ 'padding-bottom': knowledgeDataVisible ? 'auto' : '12px' }"
      >
        <div class="plane-inner" style="align-items: center; padding-bottom: 0">
          <div class="plane-title">已选条件：</div>
          <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-top: 4px;">
            <el-breadcrumb-item v-for="(item, index) in knowledgeLevel" :key="item.idStr">
              <el-tag size="mini" type="" closable @close="onLevelDelete(index)">{{
                item.name
              }}</el-tag>
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <div
        v-show="knowledgeDataVisible"
        ref="plane-outer"
        class="plane-outer"
        :style="{ height: planeHeight }"
      >
        <div ref="plane-inner" class="plane-inner">
          <div class="plane-title">知识体系：</div>
          <ul class="plane-content">
            <li
              v-for="item in knowledgeData"
              :key="item.id"
              class="knowledge-name"
              :class="{ active: item.name === '全部' && !item.idStr }"
              @click="knowledgeClick(item)"
            >
              {{ item.name }}
            </li>
          </ul>
          <el-button
            v-if="moreBtnVisible"
            type="default"
            size="mini"
            class="more-btn"
            @click="fold = !fold"
          >{{ fold ? '更多' : '收起'
          }}<i
            :class="{ 'el-icon-arrow-up': !fold, 'el-icon-arrow-down': fold }"
            class="el-icon--right"
          ></i></el-button>
        </div>
      </div>
    </div>

    <div class="tab-list">
      <div class="tab-item" :class="{ active: activeTab === 'all' }" @click="activeTab = 'all'">
        全部
      </div>
      <div
        class="tab-item"
        :class="{ active: activeTab === 'course' }"
        @click="activeTab = 'course'"
      >
        课程
      </div>
      <div class="tab-item" :class="{ active: activeTab === 'train' }" @click="activeTab = 'train'">
        培训
      </div>
      <div
        class="tab-item"
        :class="{ active: activeTab === 'required' }"
        @click="activeTab = 'required'"
      >
        必修课
      </div>
      <div class="tab-item" :class="{ active: activeTab === 'live' }" @click="activeTab = 'live'">
        直播
      </div>
      <div
        class="tab-item"
        :class="{ active: activeTab === 'knowledge' }"
        @click="activeTab = 'knowledge'"
      >
        知识库
      </div>
      <div class="tab-bar" :style="tabBarStyle"></div>
    </div>

    <div
      v-for="(module, index) in moduleList"
      :key="index"
      class="card-list-wrapper"
      :class="{ 'card-wrapper-margin': activeTab === 'all' }"
    >
      <div v-if="activeTab === 'all'" class="card-list-title">{{ module.title }}</div>
      <div
        v-loading="module.loading"
        class="card-container"
        :style="{
          'min-height':
            activeTab === 'all' ? '282px' : module.title === '知识库' ? '492px' : '894px'
        }"
        element-loading-background="transparent"
      >
        <div v-if="module.data.length" class="card-list">
          <div
            v-for="card in activeTab === 'all' ? module.data.slice(0, 4) : module.data"
            :key="card.id"
            class="card"
            :class="{ text: module.title === '知识库' }"
            @click="toDetail(module.title, card)"
          >
            <div v-if="module.title === '知识库'" class="card-inner">
              <div class="card-content">
                <div class="card-title">
                  {{ card.resName }}
                </div>
                <div class="card-desc">
                  <span class="train-type">{{ card.providerName }}</span>
                  <span class="line"></span>
                  <span class="train-date">{{ card.createTime }}</span>
                </div>
              </div>
              <div class="card-rate">
                <el-rate
                  disabled
                  show-score
                  score-template="{value}分"
                  :value="card.scope ? +card.scope : 0"
                ></el-rate>
                <div class="marker" @click.stop="handleTagClick(card)">
                  {{ card.knowledgeSystemName || card.knowledgeSystemFullName }}
                </div>
              </div>
            </div>

            <div v-if="module.title === '培训'" class="card-inner">
              <div class="card-banner">
                <img :src="card.coverPic" :onerror="errorImg.outTrain" />
                <div class="card-cover">
                  <div class="card-cover-btn">开始学习</div>
                </div>
                <div
                  class="card-status"
                  :class="{
                    process: card.status == 1,
                    pending: card.status == 2,
                    done: card.status === 3
                  }"
                >
                  {{ card.status == 1 ? '未开始' : card.status == 2 ? '进行中' : '已结办' }}
                </div>
              </div>

              <div class="card-content">
                <div class="card-title">
                  {{ card.trainName }}
                </div>
                <div class="card-desc">
                  <span class="train-type">{{
                    card.trainWay == 2
                      ? '面授培训'
                      : card.trainWay == 3
                        ? '混合培训'
                        : card.trainWay == 1
                          ? '在线培训'
                          : '外训'
                  }}</span>
                  <span class="line"></span>
                  <span class="train-date">{{ card.startTime.split(' ')[0] }} - {{ card.endTime.split(' ')[0] }}</span>
                </div>
              </div>

              <div class="card-rate">
                <el-rate
                  disabled
                  show-score
                  score-template="{value}分"
                  :value="card.composite ? +card.composite : 0"
                ></el-rate>
                <div class="marker" @click.stop="handleTagClick(card)">
                  {{ card.knowledgeSystemName || card.knowledgeSystemFullName }}
                </div>
              </div>
            </div>

            <div v-if="module.title === '必修课'" class="card-inner">
              <div class="card-banner">
                <img :src="card.coverUrl" :onerror="errorImg.online" />
                <div class="card-cover">
                  <div class="card-cover-btn">开始学习</div>
                </div>
                <div
                  class="card-status process"
                  :class="{ pending: card.status == 2, done: card.status == 3 }"
                >
                  {{
                    card.status == 1
                      ? '未开始'
                      : card.status == 2
                        ? '进行中'
                        : card.status == 3
                          ? '已结束'
                          : '草稿'
                  }}
                </div>
              </div>

              <div class="card-content">
                <div class="card-title">
                  {{ card.name }}
                </div>
                <div class="card-desc">
                  <span class="train-type">{{ card.teacherName }}</span>
                  <span class="line"></span>
                  <span class="train-date">{{
                    card.startTime.split(' ') + '-' + card.endTime.split(' ')
                  }}</span>
                </div>
              </div>

              <div class="card-rate">
                <el-rate
                  disabled
                  show-score
                  score-template="{value}分"
                  :value="card.composite"
                ></el-rate>
                <div class="marker" @click.stop="handleTagClick(card)">
                  {{ card.knowledgeSystemName || card.knowledgeSystemFullName }}
                </div>
              </div>
            </div>

            <div v-if="module.title === '直播'" class="card-inner live">
              <div class="card-banner">
                <img :src="card.coverImageUrl" :onerror="errorImg.mixin" />

                <div class="live-icon">
                  <i class="el-icon-caret-right"></i>
                </div>
                <div
                  class="card-status"
                  :class="{ primary: card.status == 'live', process: card.status == 'end' }"
                >
                  {{ card.status == 'live' ? '直播中' : '未开始' }}
                </div>

                <div class="right-bottom-icon">
                  <i class="el-icon-user-solid"></i>
                  <span>{{ card.viewersNumber || 0 }}</span>
                </div>
              </div>

              <div class="card-content">
                <div class="card-title">
                  {{ card.channelName }}
                </div>
                <div class="card-desc">
                  <span class="train-type">{{ card.categoryName }}</span>
                </div>
              </div>

              <div class="card-rate">
                <div class="card-bottom-text">
                  <span>{{ card.lecturerName }}</span>
                  <el-tooltip placement="bottom" effect="dark" transition="">
                    <div slot="content" v-html="getTooltipPlanTime(card.planTime)"></div>
                    <el-button
                      type="text"
                      size="mini"
                      style="width: 0px;
    flex: 1 1 0%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 0;
    color: #000b15;
    margin: 2px 0 0 5px;"
                    >{{ card.planTime[0] }}</el-button>
                  </el-tooltip>
                </div>
                <div class="marker" @click.stop="handleTagClick(card)">
                  {{ card.knowledgeSystemName || card.knowledgeSystemFullName }}
                </div>
              </div>
            </div>

            <div v-if="module.title === '课程'" class="card-inner">
              <div class="card-banner">
                <img :src="card.coverUrl" :onerror="errorImg.online" />
                <div class="card-cover">
                  <div class="card-cover-btn">开始学习</div>
                </div>
              </div>

              <div class="card-content">
                <div class="card-title">
                  {{ card.courseName }}
                </div>
                <div class="card-desc">
                  <span class="train-type">{{ card.teacherName }}</span>
                  <span class="line"></span>
                  <span class="train-date">学习人数：{{ card.studyNums || 0 }}人</span>
                </div>
              </div>

              <div class="card-rate">
                <el-rate
                  disabled
                  show-score
                  score-template="{value}分"
                  :value="typeof card.scope === 'number' ? card.scope : 0"
                ></el-rate>
                <div class="marker" @click.stop="handleTagClick(card)">
                  {{ card.knowledgeSystemName || card.knowledgeSystemFullName }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="!module.loading && !module.data.length" class="empty-tips">
          <img src="@/assets/images/nodata.png" class="img" />
          <div class="text">
            无数据
          </div>
        </div>
      </div>
    </div>

    <pagination
      v-if="activeTab !== 'all'"
      class="pagination-container"
      :page="currentQuery.pageNo"
      :limit="currentQuery.pageSize"
      :total="currentModule.total"
      @pagination="pagination"
    />
  </div>
</template>

<script>
import pagination from '@/components/common-pagination'
import {
  getKnowledgeCatalogList,
  getPcKsCourseList,
  getKsRequiredList,
  getTrainList
} from '@/api/knowledgeSystem'
import { getLiveList } from '@/api/live'
import { getKnowledgeList } from '@/api/knowledge'

export default {
  name: 'KnowledgeSystem',
  components: {
    pagination
  },
  data() {
    return {
      knowledgeDataVisible: true,
      knowledgeData: [],
      knowledgeLevel: [],
      currentKnowledgeId: '',
      moduleMap: {
        course: {
          title: '课程',
          data: [],
          loading: true,
          query: {
            pageSize: 10,
            pageNo: 1
          },
          total: 0,
          request: getPcKsCourseList
        },
        train: {
          title: '培训',
          data: [],
          loading: true,
          query: {
            pageSize: 10,
            pageNo: 1
          },
          total: 0,
          request: getTrainList
        },
        required: {
          title: '必修课',
          data: [],
          loading: false,
          query: {
            pageSize: 10,
            pageNo: 1
          },
          total: 0,
          request: getKsRequiredList
        },
        live: {
          title: '直播',
          data: [],
          loading: false,
          query: {
            pageSize: 10,
            pageNo: 1,
            listType: 6
          },
          total: 0,
          request: getLiveList
        },
        knowledge: {
          title: '知识库',
          data: [],
          loading: false,
          query: {
            pageSize: 10,
            pageNo: 1,
            sortChoice: 1,
            isSystem: 1
          },
          total: 0,
          request: getKnowledgeList
        }
      },
      errorImg: {
        online: 'this.src="' + require('@/assets/images/online.png') + '"',
        offline: 'this.src="' + require('@/assets/images/Offline.png') + '"',
        mixin: 'this.src="' + require('@/assets/images/mixin.png') + '"',
        outTrain: 'this.src="' + require('@/assets/images/outTrain.png') + '"'
      },
      activeTab: 'all',
      fold: true,
      moreBtnVisible: false,
      tabBarStyle: {},
      query: {
        pageSize: 10,
        pageNo: 1,
        knowledgeSystemId: ''
      },
      total: 0
    }
  },
  computed: {
    planeHeight() {
      return this.fold ? '98px' : 'auto'
    },
    currentModule() {
      return this.moduleMap[this.activeTab]
    },
    currentQuery: {
      set(query) {
        this.moduleMap[this.activeTab].query = query
      },
      get() {
        return this.currentModule.query
      }
    },
    moduleList: {
      get() {
        return this.currentModule ? [this.currentModule] : Object.values(this.moduleMap)
      }
    }
  },
  watch: {
    knowledgeLevel(level) {
      if (level.length) {
        this.currentKnowledgeId = level[level.length - 1].idStr
      } else {
        this.currentKnowledgeId = '0'
      }
    },
    activeTab: {
      handler() {
        this.$nextTick(() => {
          this.tabBarStyle = this.getTabBarStyle()
        })
      },
      immediate: true
    },
    currentKnowledgeId(id) {
      const modules = this.moduleMap

      for (const key in modules) {
        modules[key].query.knowledgeSystemId = id === '0' ? '' : id
      }
      this.resetPageAndGetData()
      this.getKnowledgeCatalogList({ id: this.currentKnowledgeId })
    }
  },
  created() {
    this.getKnowledgeCatalogList()
    this.resetPageAndGetData()
  },
  methods: {
    getTooltipPlanTime(planTime) {
      const time = planTime.join('<br><br>')
      return `直播时间:<br><br>${time}<br><br>`
    },
    handleTagClick({
      knowledgeSystemName: name,
      knowledgeSystemId: idStr,
      knowledgeSystemFullName
    }) {
      const level = (this.knowledgeLevel = [])
      name = name || knowledgeSystemFullName
      level.push({ name, idStr })
      this.knowledgeDataVisible = false
    },
    onLevelDelete(index) {
      this.knowledgeLevel = this.knowledgeLevel.slice(0, index)
      this.knowledgeDataVisible = true
    },
    knowledgeClick(item) {
      if (this.getKnowledgeLoading) return
      if (item.name === '全部' && !item.idStr) {
        this.knowledgeLevel = []
        return
      }
      this.knowledgeLevel.push(item)
    },
    toDetail(title, data) {
      let path,
        query = {}
      switch (title) {
        case '知识库':
          path = '/knowledge/detail'
          query.id = data.id
          break
        case '培训':
          path = '/train/detail'
          query = JSON.parse(JSON.stringify(data))
          query.trainId = query.trainId || query.id
          break
        case '必修课':
          path = '/requiredCourseDetail'
          query.id = data.id
          break
        case '课程':
          path = '/course/detail'
          query.id = data.id
          break
        case '直播':
          path = '/live/Detail'
          query.id = data.liveId
          break
      }
      this.$router.push({
        path,
        query
      })
    },
    getCourseType(type) {
      switch (type) {
        case 1:
          return '在线课程'
        case 2:
          return '面授课程'
        case 3:
          return '直播课程'
      }
    },
    getCourseStatus(status) {
      switch (status) {
        case 0:
          return '审核中'
        case 1:
          return '已发布'
        case 2:
          return '草稿'
        case 3:
          return '已停用'
        case 11:
          return '已拒绝'
        case 12:
          return '已撤回'
      }
    },
    getKnowledgeCatalogList(data = { id: '0' }) {
      this.getKnowledgeLoading = true
      getKnowledgeCatalogList(data)
        .then((res = []) => {
          this.knowledgeData = [{ name: '全部', idStr: '' }].concat(res)
          this.$nextTick(() => {
            if (this.$refs['plane-inner'].offsetHeight > this.$refs['plane-outer'].offsetHeight) {
              this.moreBtnVisible = true
            }
          })
        })
        .finally(() => (this.getKnowledgeLoading = false))
    },
    handleRequest(module) {
      module.loading = true
      module
        .request(module.query)
        .then((res) => {
          const { data, totalNum, records, total } = res
          module.data = data || records
          module.total = typeof totalNum == 'number' ? totalNum : total
        })
        .finally(() => (module.loading = false))
    },
    resetPageAndGetData() {
      const moduleMap = this.moduleMap
      for (const key in moduleMap) {
        Object.assign(moduleMap[key].query, { pageNo: 1, pageSize: 10 })
        this.handleRequest(moduleMap[key])
      }
    },
    getTabBarStyle() {
      const style = {}
      const tabs = this.$parent.$el.querySelectorAll('.tab-item')
      const activeTab = [...tabs].find((el) => el.classList.contains('active'))
      let offset = 0
      for (let i = 0; i < tabs.length; i++) {
        const tab = tabs[i]
        const { width, paddingLeft } = window.getComputedStyle(tab)
        if (tab !== activeTab) {
          offset += parseFloat(width)
        } else {
          offset += parseFloat(paddingLeft)
          break
        }
      }
      let { width, paddingLeft, paddingRight } = window.getComputedStyle(activeTab)
      width = parseFloat(width)
      paddingLeft = parseFloat(paddingLeft)
      paddingRight = parseFloat(paddingRight)
      style.width = width - (paddingLeft + paddingRight) + 'px'
      style.transform = `translateX(${offset}px)`
      return style
    },
    pagination({ page: pageNo, limit: pageSize }) {
      if (pageSize !== this.currentQuery.pageSize) {
        pageNo = 1
      }
      Object.assign(this.currentQuery, { pageNo, pageSize })
      this.handleRequest(this.moduleMap[this.activeTab])
    }
  }
}
</script>
<style lang="scss">
.knowledge-system {
  .el-rate__text {
    display: inline-block;
    margin-top: 2px;
  }
}
</style>
<style lang="scss" scoped>
.knowledge-system {
  margin-bottom: 26px;
  .pagination-container {
    margin-top: 8px;
  }
  .plane-wrapper {
    margin-top: 20px;
    background: #ffffff;
    box-shadow: 0 2px 8px 0 rgba(0, 61, 112, 0.06);
    border-radius: 4px;
  }
  .plane-outer {
    width: 100%;
    overflow: hidden;
    .plane-inner {
      display: flex;
      padding: 20px 24px 8px 24px;
      align-items: flex-start;
      box-sizing: border-box;
      .plane-title {
        font-size: 14px;
        color: rgba(0, 11, 21, 0.45);
        margin-right: 3px;
      }
      .plane-content {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        margin-right: -13px;
        .knowledge-name {
          cursor: pointer;
          margin-right: 24px;
          margin-bottom: 16px;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: rgba(0, 11, 21, 0.85);
          &.active {
            color: #2875d4;
          }
        }
      }
    }
  }

  .tab-list {
    position: relative;
    display: flex;
    margin-top: 20px;
    margin-bottom: 32px;
    height: 56px;
    background-color: #fff;
    padding: 0 9px;
    box-sizing: border-box;
    box-shadow: 0 2px 8px 0 rgba(0, 61, 112, 0.06);
    .tab-bar {
      position: absolute;
      bottom: 0;
      display: inline-block;
      content: ' ';
      height: 3px;
      background-color: #2875d4;
      z-index: 1;
      transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      list-style: none;
    }
    .tab-item {
      cursor: pointer;
      padding: 16px 15px;
      box-sizing: border-box;
      font-size: 16px;
      color: rgba(0, 11, 21, 0.65);
      &:hover {
        color: #2875d4;
      }
      &.active {
        color: #2875d4;
      }
    }
  }

  .card-list-wrapper {
    &.card-wrapper-margin {
      &:not(:last-child) {
        margin-bottom: 40px;
      }
    }
    .card-list-title {
      margin-bottom: 16px;
      font-family: PingFangSC-Regular;
      font-size: 24px;
      color: rgba(0, 11, 21, 0.85);
      line-height: 36px;
    }
    .card-container {
      position: relative;
      height: 100%;
    }
    .card-list {
      margin-top: 18px;
      display: flex;
      flex-wrap: wrap;
      .card {
        width: 285px;
        box-sizing: border-box;
        margin-bottom: 16px;
        transition-duration: 0.3s;
        background-color: #fff;
        margin-right: 20px;
        border-radius: 4px;
        overflow: hidden;
        box-shadow: 0 2px 8px 0 rgba(0, 63, 161, 0.06);
        &.text {
          height: 148px;
          .card-content {
            box-sizing: border-box;
            padding: 24px 16px;
            height: auto;
            border-bottom: 1px solid rgba(0, 11, 21, 0.08);
          }
          .card-rate {
            padding: 17px;
          }
        }
        &:nth-child(4n) {
          margin-right: 0;
        }
        &:hover {
          transform: translateY(-3px);
          box-shadow: 0 9px 12px 0 rgba(0, 63, 161, 0.12);
          .card-cover {
            visibility: visible !important;
          }
        }
        .card-inner {
          position: relative;
          cursor: pointer;
          background-color: #fff;
          width: 285px;
          &.live {
            .card-title {
              margin-bottom: 7px;
            }
            .card-content {
              padding-bottom: 0px;
            }
          }
        }
        .card-status {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 52px;
          height: 20px;
          line-height: 20px;
          text-align: center;
          border-radius: 4px;
          font-size: 12px;
          z-index: 99;
          &.process {
            background: #fffee6;
            color: #f5c200;
          }
          &.pending {
            background-color: #f0f9ff;
            color: #2875d4;
          }
          &.done {
            background-color: #f5f5f6;
            color: rgba(0, 11, 21, 0.45);
          }
          &.primary {
            background-color: #eaf8ff;
            color: #2875d4;
          }
        }
        .card-banner {
          position: relative;
          height: 166px;
          width: 100%;
          img {
            height: 100%;
            width: 100%;
            border-radius: 4px;
          }
          .card-cover {
            position: absolute;
            visibility: hidden;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.45);
            z-index: 111;
            .card-cover-btn {
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              width: 84px;
              height: 32px;
              line-height: 32px;
              text-align: center;
              font-size: 14px;
              background: rgba(255, 255, 255, 0.2);
              border: 1px solid #ffffff;
              color: #fff;
              border-radius: 4px;
            }
          }
          .live-icon {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 11, 21, 0.45);
            width: 50px;
            height: 50px;
            line-height: 36px;
            text-align: center;
            border-radius: 50%;
            i {
              margin-top: 8px;
              color: #fff;
              font-size: 36px;
            }
          }
          .right-bottom-icon {
            position: absolute;
            right: 8px;
            bottom: 8px;
            display: flex;
            align-items: center;
            text-align: center;
            height: 20px;
            line-height: 20px;
            text-align: center;
            color: #fff;
            border-radius: 4px;
            padding: 0 8px;
            font-size: 12px;
            background: rgba(0, 11, 21, 0.45);
            i {
              margin-right: 3px;
              font-size: 10px;
            }
          }
        }
        .card-content {
          position: relative;
          padding: 10px 16px 7px;
          width: 100%;
          box-sizing: border-box;
          .complete-icon {
            position: absolute;
            right: 3px;
            bottom: -12px;
            width: 62px;
            height: 54px;
            img {
              width: 100%;
            }
          }
          .card-title {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            margin-bottom: 8px;
            font-family: PingFangSC-Medium;
            font-size: 14px;
            color: rgba(0, 11, 21, 0.85);
            line-height: 22px;
            font-weight: 600;
          }
          .card-desc {
            display: flex;
            align-items: center;
            opacity: 0.65;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            font-family: PingFangSC-Regular;
            font-size: 0;
            color: #000b15;
            height: 18px;
            line-height: 18px;
            span {
              font-size: 12px;
            }
            .line {
              margin-right: 8px;
              background-color: #ebeced;
              width: 1px;
              height: 10px;
              margin-left: 8px;
            }
            .train-date {
              width: 0;
              flex: 1;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
        .card-rate {
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-sizing: border-box;
          padding: 7px 17px 17px;
          .card-bottom-text {
            display: flex;
            align-items: center;
            font-size: 0;
            color: #000b15;
            opacity: 0.65;
            width: 167px;
            span {
              font-size: 12px;
              padding: 0 8px;
              word-break: break-all;
              &:first-child {
                padding-left: 0;
                border-right: 1px solid #ebeced;
                line-height: 10px;
                margin-top: 2px;
              }
            }
          }
          .marker {
            width: auto;
            background: #f5f5f6;
            border-radius: 4px;
            font-size: 12px;
            color: rgba(0, 11, 21, 0.45);
            text-align: center;
            line-height: 20px;
            height: 20px;
            min-width: 40px;
            max-width: 97px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            padding: 0px 6px;
          }
        }
      }

      .text-card {
        background-color: #fff;
      }
    }
    .empty-tips {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      cursor: default;
      img {
        width: 260px;
      }
      .text {
        color: #909090;
      }
    }
  }
}
</style>
