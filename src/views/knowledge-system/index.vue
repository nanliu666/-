<template>
  <div class="knowledge-system">
    <div class="plane-outer" :style="{ height: fold ? '98px' : 'auto' }">
      <div class="plane-inner">
        <div class="plane-title">知识体系：</div>
        <ul class="plane-content">
          <li class="knowledge-name active">全部</li>
          <li class="knowledge-name">管理与领导力</li>
          <li class="knowledge-name">创意设计</li>
          <li class="knowledge-name">热门行业</li>
          <li class="knowledge-name">自我提升</li>
          <li class="knowledge-name">知识体系</li>
          <li class="knowledge-name">设计</li>
          <li class="knowledge-name">产品创意</li>
          <li class="knowledge-name">在线课程</li>
          <li class="knowledge-name">面授课程</li>
          <li class="knowledge-name">直播课程</li>
          <li class="knowledge-name">直播课程</li>
          <li class="knowledge-name">直播课程</li>
          <li class="knowledge-name">直播课程</li>
          <li class="knowledge-name">直播课程</li>
          <li class="knowledge-name">直播课程</li>
          <li class="knowledge-name">直播课程</li>
          <li class="knowledge-name">直播课程</li>
          <li class="knowledge-name">直播课程</li>
          <li class="knowledge-name">直播课程</li>
          <li class="knowledge-name">直播课程</li>
          <li class="knowledge-name">直播课程</li>
          <li class="knowledge-name">直播课程</li>
          <li class="knowledge-name">直播课程</li>
          <li class="knowledge-name">直播课程</li>
          <li class="knowledge-name">直播课程</li>
          <li class="knowledge-name">直播课程</li>
        </ul>
        <el-button type="default" size="mini" class="more-btn" @click="fold = !fold">{{ fold ? '更多' : '收起'
        }}<i
          :class="{ 'el-icon-arrow-up': !fold, 'el-icon-arrow-down': fold }"
          class="el-icon--right"
        ></i></el-button>
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

    <div class="data-container">
      <div class="card-wrapper">
        <div class="card">
          <div class="card-banner">
            <img src="" :onerror="errorImg.online" />
            <div class="card-cover">
              <div class="card-cover-btn">开始学习</div>
            </div>
          </div>
          <div class="card-status process">
            已结束
          </div>
          <div class="card-content">
            <div class="card-title">
              汽车起重机XGC88000产品基本应用汽车起重机XGC88000产品基本应用汽车起重机XGC88000产品基本应用汽车起重机XGC88000产品基本应用汽车起重机XGC88000产品基本应用汽车起重机XGC88000产品基本应用
            </div>
            <div class="card-desc">
              <span class="train-type">面授培训</span>
              <span class="train-date">学习人数：30人</span>
            </div>
          </div>

          <div class="card-rate">
            <el-rate disabled show-score score-template="{value}分"></el-rate>
            <div class="marker">大数据</div>
          </div>
        </div>
      </div>
    </div>
    <pagination :total="total" @pagination="pagination" />
  </div>
</template>

<script>
import pagination from '@/components/common-pagination'
export default {
  name: 'KnowledgeSystem',
  components: {
    pagination
  },
  data() {
    return {
      errorImg: {
        online: 'this.src="' + require('@/assets/images/online.png') + '"',
        offline: 'this.src="' + require('@/assets/images/Offline.png') + '"',
        mixin: 'this.src="' + require('@/assets/images/mixin.png') + '"',
        outTrain: 'this.src="' + require('@/assets/images/outTrain.png') + '"'
      },
      activeTab: 'all',
      fold: true,
      tabBarStyle: {},
      query: {
        pageSize: 10,
        pageNo: 1
      },
      total: 0
    }
  },
  watch: {
    activeTab: {
      handler() {
        this.getData()
        this.$nextTick(() => {
          this.tabBarStyle = this.getTabBarStyle()
        })
      },
      immediate: true
    }
  },
  methods: {
    getData() {},
    getTabBarStyle() {
      const style = {}
      const tabs = this.$parent.$el.querySelectorAll('.tab-item')
      const activeTab = [...tabs].find((el) => el.classList.contains('active'))
      let offset = 0
      for (let i = 0; i < tabs.length; i++) {
        const tab = tabs[i]
        if (tab !== activeTab) {
          let { width } = window.getComputedStyle(tab)
          offset += parseFloat(width)
        } else {
          break
        }
      }
      let { width, paddingLeft, paddingRight } = window.getComputedStyle(activeTab)
      // width = parseFloat(width)
      // paddingLeft = parseFloat(paddingLeft)
      // paddingRight = parseFloat(paddingRight)
      style.width = parseFloat(width) + 'px'
      style.transform = `translateX(${offset}px)`
      return style
    },
    pagination({ page: pageNo, limit: pageSize }) {
      Object.assign(this.query, { pageNo, pageSize })
      this.getData()
    }
  }
}
</script>

<style lang="scss" scoped>
.knowledge-system {
  .plane-outer {
    margin-top: 20px;
    background: #ffffff;
    width: 100%;
    box-shadow: 0 2px 8px 0 rgba(0, 61, 112, 0.06);
    border-radius: 4px;
    overflow: hidden;
    transition: all 1s linear;
    .plane-inner {
      display: flex;
      padding: 24px 24px 8px 24px;
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
    height: 56px;
    background-color: #fff;
    padding: 16px 24px;
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
      padding: 0 15px;
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
  .data-container {
    margin-top: 18px;
    display: flex;
    flex-wrap: wrap;
    min-height: 55vh;
    .card-wrapper {
      width: 285px;
      height: 282px;
      margin-bottom: 16px;
      transition-duration: 0.3s;
      background-color: #fff;
      margin-right: 20px;
      border-radius: 4px;
      overflow: hidden;
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
      .card {
        position: relative;
        cursor: pointer;
        background-color: #fff;
        width: 285px;
        box-shadow: 0 2px 8px 0 rgba(0, 63, 161, 0.06);
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
      }
      .card-content {
        position: relative;
        padding: 10px 16px 7px;
        width: 100%;
        height: 71px;
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
          font-size: 12px;
          color: #000b15;
          height: 18px;
          line-height: 18px;
          .train-date {
            width: 0;
            flex: 1;
            margin-left: 17px;
          }
        }
      }
      .card-rate {
        position: relative;
        box-sizing: border-box;
        padding: 7px 16px 17px;
        .marker {
          position: absolute;
          right: 16px;
          bottom: 17px;
          background: #f5f5f6;
          border-radius: 4px;
          font-size: 12px;
          color: rgba(0, 11, 21, 0.45);
          text-align: center;
          line-height: 20px;
          height: 20px;
          width: 52px;
        }
      }
    }
  }
  .empty-tips {
    text-align: center;
    cursor: default;
    img {
      width: 419px;
      height: 391px;
    }
    .empty-text {
      color: #909090;
    }
  }
}
</style>
