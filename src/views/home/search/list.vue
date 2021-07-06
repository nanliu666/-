<template>
  <div class="search__container">
    <the-header class="search__header" />
    <div class="search__main">
      <div class="main__content">
        <div class="search__top">
          <div class="top__container">
            <div class="input__box">
              <el-input
                v-model="queryInfo.key"
                maxlength="100"
                class="input__class"
                placeholder="请输入内容"
                clearable
              />
              <span class="input__right" @click="loadData">搜索</span>
            </div>
            <ul class="nav__box">
              <li
                v-for="(item, index) in NAV_lIST"
                :key="index"
                class="nav__li"
                :class="{ active__li: item.value === queryInfo.type }"
                @click="handleClick(item)"
              >
                {{ item.key }}
              </li>
            </ul>
          </div>
        </div>
        <div class="search__bottom">
          <div v-if="existSomeone" class="bottom__box">
            <el-card class="tips__card">
              <div class="tips__box">
                <span>共找到</span>
                <span class="active__class">{{ totalNum }}</span>
                <span>个包含“</span>
                <span class="active__class">{{ queryInfo.key }}</span>
                <span>”的结果</span>
              </div>
            </el-card>
            <div class="main__container">
              <ul class="main__ul">
                <li v-if="!_.isEmpty(courseData)" class="main__li">
                  <div class="parter__title">课程</div>
                  <ul class="content__ul">
                    <li
                      v-for="item in courseData"
                      :key="item.courseId"
                      class="content__li"
                      @click="toCourseDetail(item)"
                    >
                      <el-image class="logo__img" :src="item.coverUrl" fit="cover">
                        <div slot="error" class="image__slot" style="width: 100%">
                          <img style="width: 100%" :src="requireImg" alt="" />
                        </div>
                      </el-image>
                      <div class="bottom__content">
                        <div class="li__title">
                          {{ _.get(item, 'courseName', '') }}
                        </div>
                        <div class="li__name">
                          <span class="lectuere__class">
                            <span>讲师：</span>
                            <span class="name">{{ _.get(item, 'teacherName', '') }}</span>
                          </span>
                          <span>
                            <span>学习人数：</span>
                            <span>{{ _.get(item, 'people', '') }}</span>
                          </span>
                        </div>
                        <div class="li__bottom">
                          <span class="rate__box">
                            <el-rate v-model="item.scope" disabled />
                            <span class="rate__text">{{ item.scope.toFixed(1) }}分</span>
                          </span>
                          <!-- <el-tag v-if="!_.isEmpty(_.get(item, 'tags'))">{{
                            _.get(item, 'tags[0]')
                          }}</el-tag> -->
                        </div>
                      </div>
                    </li>
                  </ul>
                </li>
                <li v-if="!_.isEmpty(trainData)" class="main__li">
                  <div class="parter__title">培训</div>
                  <ul class="content__ul">
                    <li
                      v-for="item in trainData"
                      :key="item.id"
                      class="content__li"
                      @click="toTrainDetail(item)"
                    >
                      <el-image class="logo__img" :src="item.coverUrl" fit="cover">
                        <div slot="error" class="image-slot">
                          <img
                            v-if="item.trainWay === 1"
                            :src="require('../../../../public/img/offlineTrain.png')"
                            alt=""
                          />
                          <img
                            v-if="item.trainWay === 2"
                            :src="require('../../../../public/img/onlineTrain.png')"
                            alt=""
                          />
                          <img
                            v-else
                            :src="require('../../../../public/img/minTrain.png')"
                            alt=""
                          />
                        </div>
                      </el-image>
                      <div
                        class="status__class"
                        :class="{
                          nostart__class: item.status == 1,
                          underway__class: item.status == 2,
                          end__class: item.status == 3
                        }"
                      >
                        <span class="status__text">
                          {{ TRAIN_STATUS[item.status] }}
                        </span>
                      </div>
                      <div class="bottom__content">
                        <div class="li__title">
                          {{ _.get(item, 'menuName', '') }}
                        </div>
                        <div class="li__name">
                          <span style="margin-right: 17px">{{ TRAIN_WAY[item.trainWay] }}</span>
                          <span>
                            <span>{{ item.startTime | formatter }}</span>
                            <span>-</span>
                            <span>{{ item.endTime | formatter }}</span>
                          </span>
                        </div>
                        <div
                          v-if="item.trainWay === 1 || item.trainWay === 2 || item.trainWay === 3"
                          class="li__bottom"
                        >
                          <span class="rate__box">
                            <el-rate v-model="item.composite" disabled />
                            <span class="rate__text">{{ Number(item.composite ? item.composite : 0).toFixed(1) }}分</span>
                          </span>
                          <!-- <el-tag v-if="!_.isEmpty(_.get(item, 'tags'))">{{
                            _.get(item, 'tags[0]')
                          }}</el-tag> -->
                        </div>
                        <div v-else class="li__bottom">
                          <span class="rate__box">
                            {{ item.categoryNameNew }}
                          </span>
                        </div>
                      </div>
                    </li>
                  </ul>
                </li>
                <li v-if="!_.isEmpty(studyPlanData)" class="main__li">
                  <div class="parter__title">必修课</div>
                  <ul class="content__ul">
                    <li
                      v-for="item in studyPlanData"
                      :key="item.id"
                      class="content__li"
                      @click="toStudyDetail(item)"
                    >
                      <el-image class="logo__img" :src="item.coverUrl" fit="cover">
                        <div slot="error" style="width: 100%" class="image__slot">
                          <img style="width: 100%" :src="requireImg" alt="" />
                        </div>
                      </el-image>
                      <div
                        class="status__class"
                        :class="{
                          nostart__class: item.status == 1,
                          underway__class: item.status == 2,
                          end__class: item.status == 3
                        }"
                      >
                        <span class="status__text">
                          {{ TRAIN_STATUS[item.status] }}
                        </span>
                      </div>
                      <div class="bottom__content">
                        <div class="li__title">
                          {{ _.get(item, 'menuName', '') }}
                        </div>
                        <div class="li__name">
                          <span v-if="item.lecturerName" style="margin-right: 17px">{{
                            item.lecturerName
                          }}</span>
                          <span>
                            <span>{{ item.startTime | formatter }}</span>
                            <span>-</span>
                            <span>{{ item.endTime | formatter }}</span>
                          </span>
                        </div>
                        <div class="li__bottom">
                          <span class="rate__box">
                            <el-rate v-model="item.trainScope" disabled />
                            <span class="rate__text">{{
                              Number(item.trainScope ? item.trainScope : 0).toFixed(1)
                            }}分</span>
                          </span>
                          <!-- <el-tag v-if="!_.isEmpty(_.get(item, 'tags'))">{{
                            _.get(item, 'tags[0]')
                          }}</el-tag> -->
                        </div>
                      </div>
                    </li>
                  </ul>
                </li>
                <li v-if="!_.isEmpty(liveData)" class="main__li">
                  <div class="parter__title">直播</div>
                  <ul class="content__ul">
                    <li
                      v-for="item in liveData"
                      :key="item.liveId"
                      class="content__li"
                      @click="toLiveDetail(item)"
                    >
                      <div class="image__content">
                        <el-image class="logo__img" :src="item.coverImageUrl" fit="cover">
                          <div slot="error" class="image__slot">
                            <i class="el-icon-picture-outline"></i>
                          </div>
                        </el-image>
                        <div v-if="item.status == 'live'" class="header__play">
                          <div class="play__icon"></div>
                        </div>
                      </div>
                      <div
                        class="status__class"
                        :class="{
                          underway__class: item.status == 'live',
                          nostart__class: item.status === 'end'
                        }"
                      >
                        <!-- <i  class="iconshezhi iconfont"></i> -->
                        <ul v-if="item.status === 'live'" class="live__svg__ul">
                          <li
                            v-for="(liveSvgItem, liveSvgIndex) in [1, 2, 3]"
                            :key="liveSvgIndex"
                            class="live__svg__li"
                          />
                        </ul>
                        <span class="status__text">
                          {{ STATUS_MAP[item.status] }}
                        </span>
                      </div>
                      <div class="bottom__content">
                        <div class="li__title">
                          {{ _.get(item, 'channelName', '') }}
                        </div>
                        <div class="li__name live__name">
                          <span>{{ item.categoryName }}</span>
                        </div>
                        <div class="li__bottom live__bottom">
                          <live-time-tips :item="item" />
                        </div>
                      </div>
                    </li>
                  </ul>
                </li>
                <li v-if="!_.isEmpty(knowledgeData)" class="main__li">
                  <div class="parter__title">知识库</div>
                  <ul class="content__ul">
                    <li
                      v-for="item in knowledgeData"
                      :key="item.id"
                      class="knowledge__li"
                      @click="toKnowledgeDetail(item)"
                    >
                      <div class="knowledge__top">
                        <div class="li__title">
                          {{ _.get(item, 'resName', '') }}
                        </div>
                        <div class="li__name">
                          <span>{{ item.providerName ? item.providerName : '暂无提供者' }}</span>
                        </div>
                      </div>
                      <div class="knowledge__bottom">
                        <span class="rate__box">
                          <el-rate v-model="item.scope" disabled />
                          <span class="rate__text">{{ item.scope.toFixed(1) }}分</span>
                        </span>
                        <span class="knowledge__time">{{ item.createTime | formatter }}</span>
                      </div>
                    </li>
                  </ul>
                </li>
                <li v-if="!_.isEmpty(newsData)" class="main__li">
                  <div class="parter__title">新闻</div>
                  <ul class="content__ul">
                    <li
                      v-for="item in newsData"
                      :key="item.id"
                      class="new__li"
                      @click="toNewDetail(item)"
                    >
                      <el-image class="logo__img" :src="item.picUrl" fit="cover">
                        <div slot="error" class="image__slot">
                          <el-image
                            class="new__li__error"
                            :src="require('../../../../public/img/newDefault.png')"
                          />
                        </div>
                      </el-image>
                      <div class="new__bottom">
                        <div class="li__title">
                          {{ _.get(item, 'title', '') }}
                        </div>
                        <div class="new__time">
                          <span>
                            <i class="el-icon-view" />
                            <span style="margin-left: 4px">{{ item.hits ? item.hits : 0 }}次</span>
                          </span>
                          <span>{{ item.createTime | formatter }}</span>
                        </div>
                      </div>
                    </li>
                  </ul>
                </li>
              </ul>
              <div class="pagination__content">
                <el-pagination
                  v-if="queryInfo.type"
                  :page-sizes="[16, 32, 48, 64]"
                  :page-size="queryInfo.pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="totalNum"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                />
              </div>
            </div>
          </div>
          <common-empty v-else height="70vh" text="暂无搜索结果，换个关键字试试~  " />
        </div>
      </div>
      <the-footer class="search__footer" />
    </div>
  </div>
</template>
<script>
const NAV_lIST = [
  { key: '全部', value: '' },
  { key: '课程', value: 'course' },
  { key: '培训', value: 'train' },
  { key: '必修课', value: 'studyPlan' },
  { key: '直播', value: 'live' },
  { key: '知识库', value: 'knowledge' },
  { key: '新闻', value: 'news' }
]
const TRAIN_WAY = {
  1: '在线培训',
  2: '面授培训',
  3: '混合培训',
  11: '外训',
  12: '外训',
  13: '外训'
}
const TRAIN_STATUS = {
  1: '未开始',
  2: '进行中',
  3: '已结束'
}
const STATUS_MAP = {
  live: '直播中',
  end: '未开始'
}
import TheHeader from '@/page/TheHeader'
import Mark from 'mark.js'
import { mapGetters } from 'vuex'
import { homeSearch } from '@/api/home'
import CommonEmpty from '@/components/common-empty/Empty'
import TheFooter from '@/page/TheFooter.vue'
import LiveTimeTips from '@/views/live/components/LiveTimeTips'
import moment from 'moment'
export default {
  name: 'SearchList',
  components: {
    TheHeader,
    TheFooter,
    LiveTimeTips,
    CommonEmpty
  },
  filters: {
    formatter(date) {
      return moment(date).format('YYYY/MM/DD')
    }
  },
  data() {
    return {
      requireImg: require('@/assets/images/required_bg.png'),
      totalNum: 0,
      queryInfo: {
        pageSize: 4,
        pageNo: 1,
        key: '',
        type: '' // type :train,course,studyPlan,live,knowledge,news
      },
      courseData: [],
      trainData: [],
      studyPlanData: [],
      liveData: [],
      knowledgeData: [],
      newsData: []
    }
  },

  computed: {
    existSomeone() {
      return _.some(
        [
          this.courseData,
          this.trainData,
          this.studyPlanData,
          this.liveData,
          this.knowledgeData,
          this.newsData
        ],
        (item) => !_.isEmpty(item)
      )
    },
    ...mapGetters(['comSearchText']),
    NAV_lIST: () => NAV_lIST,
    TRAIN_WAY: () => TRAIN_WAY,
    TRAIN_STATUS: () => TRAIN_STATUS,
    STATUS_MAP: () => STATUS_MAP,
    dataScore: {
      get() {
        return 0
      },
      set() {}
    }
  },
  watch: {
    'queryInfo.key': {
      handler(val) {
        if (val) {
          this.loadData()
        } else {
          this.$nextTick(() => {
            this.markTitle()
          })
        }
      },
      deep: true,
      immediate: true
    },
    comSearchText: {
      handler(val) {
        this.queryInfo.key = val
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleSizeChange(val) {
      this.queryInfo.pageSize = val
      this.loadData()
    },
    handleCurrentChange(val) {
      this.queryInfo.pageNo = val
      this.loadData()
    },
    /**
     * 用来标记搜索文字高亮
     */
    markTitle() {
      const markInstance = new Mark('.li__title')
      markInstance.unmark().mark(this.queryInfo.key, {
        acrossElements: true,
        separateWordSearch: false
      })
      const markInstanceLive = new Mark('.live__name')
      markInstanceLive.unmark().mark(this.queryInfo.key, {
        acrossElements: true,
        separateWordSearch: false
      })
    },
    toLiveDetail(data) {
      this.$router.push({ path: '/live/Detail', query: { id: data.liveId } })
    },
    toKnowledgeDetail(data) {
      this.$router.push({ path: '/knowledge/detail', query: { id: data.id } })
    },
    toNewDetail(data) {
      this.$router.push({
        path: '/news/Details',
        query: { id: data.id, hits: data.hits, isHot: data.isHot }
      })
    },
    toStudyDetail(data) {
      this.$router.push({ path: '/myRequiredDetails', query: { item: JSON.stringify(data) } })
    },
    toCourseDetail(data) {
      //  jumpType，1-课程中心，2-培训，3-必修课
      const PATH_MAP = {
        1: '/course/detail',
        2: '/course/detail',
        3: '/requiredCourseDetail'
      }
      this.$router.push({
        path: _.get(PATH_MAP, data.jumpType, PATH_MAP[1]),
        query: { id: data.courseId }
      })
    },
    toTrainDetail(item) {
      //  jumpType，1-讲师任务/我的任务,0-培训中心
      const PATH_MAP = {
        0: '/train/detail',
        1: '/train/detail' // TODO待补充我的任务的路径
      }
      const { id: trainId, trainName: title, trainWay, userType } = item
      const path = PATH_MAP[item.jumpType] || PATH_MAP[0]
      // userType 0:学员,1:讲师
      this.$router.push({
        path,
        query: {
          title,
          trainId,
          trainWay,
          userType
        }
      })
    },
    handleClick(val) {
      this.queryInfo.type = val.value
      // 搜索全部的时候需要恢复
      if (this.queryInfo.type === '') {
        this.queryInfo.pageSize = 4
        this.queryInfo.pageNo = 1
      } else {
        this.queryInfo.pageSize = 16
      }
      this.loadData()
    },
    loadData: _.debounce(function() {
      if (this.queryInfo.key) {
        this.$store.commit('SET_SEARCH_HISTORY', this.queryInfo.key)
      }
      homeSearch(this.queryInfo).then((res) => {
        const { total, ...reset } = res
        this.totalNum = total
        this.courseData = _.get(reset, 'course.data', [])
        this.trainData = _.get(reset, 'train.data', [])
        this.studyPlanData = _.get(reset, 'studyPlan.data', [])
        this.liveData = _.get(reset, 'live.data', [])
        this.knowledgeData = _.get(reset, 'knowledge.data', [])
        this.newsData = _.get(reset, 'news.data', [])
        this.$nextTick(() => {
          this.markTitle()
        })
      })
    }, 300)
  }
}
</script>
<style scoped lang="scss">
/deep/ mark {
  color: #1677ff;
  background: transparent;
}
/deep/ .el-input {
  input {
    caret-color: #2875d4;
    border-radius: 4px 0 0 4px;
    &:focus {
      border-color: #2875d4;
    }
  }
}
.search__container {
  .search__header {
    background-color: #fff;
    box-shadow: inset 0 -1px 0 0 rgba(0, 11, 21, 0.08);
    z-index: 1000;
    position: fixed;
    width: 100vw;
    left: 0;
    top: 0;
  }
  .search__main {
    padding-top: 64px;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    .main__content {
      flex: 1;
      .search__top {
        background: #ffffff;
        box-shadow: 0 2px 8px 0 rgba(0, 61, 112, 0.08);
        height: 176px;
        display: flex;
        justify-content: center;
        .top__container {
          width: 1200px;
          display: flex;
          align-items: center;
          flex-direction: column;
          .input__box {
            display: flex;
            align-items: center;
            width: 920px;
            height: 56px;
            margin: 40px 0 24px;
            input {
              background: none;
              outline: none;
              border: none;
            }
            /deep/ .el-input__inner {
              height: 100%;
            }
            .input__class {
              background: rgba(0, 11, 21, 0.02);
              border-radius: 4px;
              height: 100%;
              width: calc(920px - 116px);
            }
            .input__right {
              height: 100%;
              width: 116px;
              display: flex;
              align-items: center;
              justify-content: center;
              background: #2875d4;
              border-radius: 0 4px 4px 0;
              font-family: PingFangSC-Semibold;
              font-size: 18px;
              color: #ffffff;
              font-weight: 600;
              cursor: pointer;
            }
          }
          .nav__box {
            display: flex;
            width: 100%;
            height: 56px;
            align-items: center;
            .nav__li {
              cursor: pointer;
              margin-right: 40px;
              font-family: PingFangSC-Regular;
              font-size: 16px;
              font-size: 16px;
              color: rgba(0, 11, 21, 0.65);
            }
            .active__li {
              font-family: PingFangSC-Medium;
              font-size: 16px;
              color: #2875d4;
              position: relative;
              font-weight: 500;
              &::before {
                content: '';
                position: absolute;
                bottom: -18px;
                left: 0;
                width: 100%;
                height: 2px;
                background-color: #2875d4;
              }
            }
          }
        }
      }
      .search__bottom {
        padding-top: 20px;
        width: 1200px;
        margin: 0 auto;
        .bottom__box {
          display: flex;
          justify-content: center;
          flex-direction: column;
          align-items: center;
          .tips__card {
            margin-bottom: 20px;
            width: 100%;
            /deep/ .el-card__body {
              padding: 21px 24px;
            }
            .tips__box {
              font-family: PingFangSC-Regular;
              font-size: 14px;
              color: rgba(0, 11, 21, 0.85);
              display: flex;
              align-items: center;
              .active__class {
                color: #1677ff;
              }
            }
          }
          .main__container {
            width: 100%;
            .main__ul {
              .main__li {
                margin-top: 36px;
                &:first-child {
                  margin-top: 20px;
                }
                .parter__title {
                  font-family: PingFangSC-Regular;
                  font-size: 24px;
                  color: rgba(0, 11, 21, 0.85);
                  font-weight: 550;
                }
                .content__ul {
                  margin-top: 16px;
                  display: flex;
                  flex-wrap: wrap;
                  justify-content: space-between;
                  flex-direction: row;
                  padding-bottom: 10px;
                  &::after {
                    content: '';
                    flex: auto;
                  }
                  .content__li,
                  .knowledge__li,
                  .new__li {
                    position: relative;
                    width: calc((100% - 20px * 3) / 4);
                    border-radius: 4px;
                    overflow: hidden;
                    margin-right: 20px;
                    margin-bottom: 20px;
                    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
                    background: #ffffff;
                    display: flex;
                    align-items: center;
                    flex-direction: column;
                    cursor: pointer;
                    &:nth-child(4n + 4) {
                      margin-right: 0;
                    }
                    &:hover {
                      box-shadow: 0 2px 14px 0 rgba(0, 61, 112, 0.3);
                    }
                    .li__title {
                      font-family: PingFangSC-Medium;
                      font-size: 14px;
                      color: rgba(0, 11, 21, 0.85);
                      font-weight: 550;
                      margin-bottom: 8px;
                      overflow: hidden; /*超出部分隐藏*/
                      text-overflow: ellipsis; /* 超出部分显示省略号 */
                      white-space: nowrap; /*规定段落中的文本不进行换行 */
                    }
                    .li__name {
                      font-family: PingFangSC-Regular;
                      font-size: 12px;
                      color: rgba(#000b15, 0.45);
                      margin-bottom: 18px;
                      .lectuere__class {
                        position: relative;
                        margin-right: 17px;
                        &::before {
                          content: '';
                          position: absolute;
                          right: -8px;
                          top: 2px;
                          width: 1px;
                          height: 10px;
                          background: #ebeced;
                        }
                      }
                    }
                  }
                  .content__li {
                    .image__content {
                      position: relative;
                      .header__play {
                        position: absolute;
                        left: 50%;
                        top: 50%;
                        width: 48px;
                        height: 48px;
                        background: rgba(0, 11, 21, 0.45);
                        border-radius: 100%;
                        margin-left: -24px;
                        margin-top: -24px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        .play__icon {
                          width: 0;
                          height: 0;
                          margin-left: 8px;
                          border-top: 10px solid transparent;
                          border-left: 20px solid #ffffff;
                          border-bottom: 10px solid transparent;
                        }
                      }
                    }
                    .logo__img {
                      width: 100%;
                      height: 166px;
                      border-radius: 4px 4px 0 0;
                      .image-slot {
                        width: 100%;
                        height: 100%;
                        img {
                          width: 100%;
                          height: 100%;
                        }
                      }
                    }
                    .status__class {
                      position: absolute;
                      right: 10px;
                      top: 10px;
                      border-radius: 4px;
                      width: 52px;
                      height: 20px;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                    }
                    .status__text {
                      height: 20px;
                    }
                    .underway__class {
                      background: #f0f9ff;
                      color: #2875d4;
                    }
                    .nostart__class {
                      background: #fffee6;
                      color: #f5c200;
                    }
                    .end__class {
                      background-color: #fef2f2;
                      color: #fe808b;
                    }
                    .live__icon {
                      width: 65px;
                      display: flex;
                      align-items: center;
                    }
                    .bottom__content {
                      padding: 16px;
                      width: 100%;
                      .li__bottom {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        .rate__box {
                          display: flex;
                          align-items: center;
                          /deep/ .el-rate {
                            width: 100px;
                            .el-rate__icon {
                              margin-right: 2px;
                            }
                          }
                          .rate__text {
                            font-family: PingFangSC-Regular;
                            font-size: 12px;
                            color: rgba(0, 11, 21, 0.45);
                          }
                        }
                      }
                      .live__bottom {
                        .live__time {
                          width: calc(100% - 50px);
                          overflow: hidden;
                          text-overflow: ellipsis;
                          white-space: nowrap;
                        }
                      }
                    }
                  }
                  .knowledge__li {
                    .knowledge__top {
                      border-bottom: 1px solid rgba(0, 11, 21, 0.08);
                      width: 100%;
                      padding: 24px 16px 6px;
                    }
                    .knowledge__bottom {
                      padding: 16px;
                      width: 100%;
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                      .rate__box {
                        display: flex;
                        align-items: center;
                      }
                      .knowledge__time {
                        height: 20px;
                        line-height: 20px;
                      }
                    }
                  }
                  .new__li {
                    position: relative;
                    border-radius: 4px;
                    .logo__img {
                      height: 250px;
                    }
                    .new__li__error {
                      width: 285px;
                      height: 250px;
                    }
                    .new__bottom {
                      position: absolute;
                      bottom: 0;
                      left: 0;
                      width: 100%;
                      padding: 8px 16px;
                      color: #ffffff;
                      background-color: rgba(#2a292f, 0.2);
                      .li__title {
                        color: #ffffff;
                      }
                      .new__time {
                        margin-top: 4px;
                        display: flex;
                        justify-content: space-between;
                      }
                    }
                  }
                }
              }
            }
            .pagination__content {
              width: 100%;
              display: flex;
              justify-content: flex-end;
            }
          }
        }
      }
      .live__svg__ul {
        display: flex;
        align-items: flex-end;
        height: 12px;
        margin-right: 2px;
        .live__svg__li {
          background-color: #2875d4;
          width: 1px;
          height: 4px;
          margin-right: 2px;
          animation-duration: 1s;
          animation-timing-function: linear;
          animation-delay: 2s;
          animation-iteration-count: infinite;
          animation-direction: alternate;
          animation-play-state: running;
          &:first-child {
            animation-name: firstLiMove;
          }
          &:nth-child(2) {
            animation-name: secondLiMove;
          }
          &:last-child {
            animation-name: thirdLiMove;
          }
        }
        @keyframes firstLiMove {
          100% {
            height: 10px;
          }
          75% {
            height: 8px;
          }
          50% {
            height: 6px;
          }
          25% {
            height: 4px;
          }
          0% {
            height: 2px;
          }
        }
        @keyframes thirdLiMove {
          100% {
            height: 2px;
          }
          75% {
            height: 4px;
          }
          50% {
            height: 6px;
          }
          25% {
            height: 8px;
          }
          0% {
            height: 10px;
          }
        }
        @keyframes secondLiMove {
          100% {
            height: 8px;
          }
          75% {
            height: 6px;
          }
          50% {
            height: 10px;
          }
          25% {
            height: 4px;
          }
          0% {
            height: 2px;
          }
        }
      }
    }
    .search__footer {
      align-self: flex-end;
    }
  }
}
</style>
