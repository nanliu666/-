<template>
  <div class="live">
    <div class="top-container">
      <div class="search-wrapper">
        <el-input
          v-model="queryData.search_liveName"
          clearable
          size="small"
          class="search-box"
          placeholder="查找直播"
          suffix-icon="el-icon-search"
          maxlength="20"
          @input="search_live(queryData.search_liveName)"
        >
        </el-input>
      </div>
      <div class="filter-wrapper">
        <el-row
          v-show="navigation.length != 0 || knowledgeNavigation.length != 0"
          class="breadcrumb_navigation"
        >
          <el-col :span="24">
            <div>
              <span class="title">已选条件：</span>
              <span class="type">分类：</span>
              <div v-for="(item, index) in navigation" :key="index" class="type_list">
                <span class="label">{{ item.children.name }}</span>
                <span v-show="navigation.length - 1 == index" class="close"><i
                  class="el-icon-close"
                  @click="close_breadcrumb_navigation(navigation, item, index, 'classify')"
                ></i></span>
                <span v-show="navigation.length - 1 != index" class="right"><i class="el-icon-arrow-right"></i></span>
              </div>
            </div>
            <div style="margin-left:80px;margin-top:10px">
              <span class="type">知识体系：</span>
              <div v-for="(item, index) in knowledgeNavigation" :key="index" class="type_list">
                <span class="label">{{ item.children.name }}</span>
                <span v-show="knowledgeNavigation.length - 1 == index" class="close"><i
                  class="el-icon-close"
                  @click="
                    close_breadcrumb_navigation(knowledgeNavigation, item, index, 'knowledge')
                  "
                ></i></span>
                <span v-show="knowledgeNavigation.length - 1 != index" class="right"><i class="el-icon-arrow-right"></i></span>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row ref="liveTypes" class="filter-item">
          <el-col :span="2"> 分类： </el-col>
          <el-col :span="20">
            <!-- 如果当前选中的id等于父级id则高亮全部，或在最顶级分类无任何选中时高亮，面包屑导航数组中最后一个则为当前分类的父级分类并且存有id -->
            <span
              :class="
                queryData.liveType_select ==
                  (navigation.length > 0 ? navigation[navigation.length - 1].children.idStr : '')
                  ? 'active_type'
                  : ''
              "
              @click="showThisLiveAllType('classify')"
            >
              全部
            </span>
            <span
              v-for="(item, index) in liveClassification"
              :key="index"
              :class="queryData.liveType_select == item.idStr ? 'active_type' : ''"
              @click="toggle_type(liveClassification, item, 'classify')"
            >{{ item.name }}</span>
          </el-col>
          <el-col v-show="moreLiveTypeButton" :span="2">
            <el-button size="small" class="more_type" @click="showAllLiveType('classify')">
              更多
              <i class="el-icon-arrow-down"></i>
            </el-button>
          </el-col>
        </el-row>
        <el-row ref="knowledgeTypes" class="filter-item">
          <el-col :span="2"> 知识体系： </el-col>
          <el-col :span="20">
            <!-- 如果当前选中的id等于父级id则高亮全部，或在最顶级分类无任何选中时高亮，面包屑导航数组中最后一个则为当前分类的父级分类并且存有id -->
            <span
              :class="
                queryData.knowledgeClass_select ==
                  (knowledgeNavigation.length > 0
                    ? knowledgeNavigation[knowledgeNavigation.length - 1].children.idStr
                    : '')
                  ? 'active_type'
                  : ''
              "
              @click="showThisLiveAllType('knowledge')"
            >
              全部
            </span>
            <span
              v-for="(item, index) in knowledgeClassifyList"
              :key="index"
              :class="queryData.knowledgeClass_select == item.idStr ? 'active_type' : ''"
              @click="toggle_type(knowledgeClassifyList, item, 'knowledge')"
            >{{ item.name }}</span>
          </el-col>
          <el-col v-show="moreKnowledgeTypeButton" :span="2">
            <el-button size="small" class="more_type" @click="showAllLiveType('knowledge')">
              更多
              <i class="el-icon-arrow-down"></i>
            </el-button>
          </el-col>
        </el-row>
        <el-row class="filter-item">
          <el-col :span="2"> 状态： </el-col>
          <el-col :span="20">
            <span
              v-for="(item, index) in liveStatus"
              :key="index"
              :class="queryData.liveStatus_select == item.id ? 'active_type' : ''"
              @click="goggle_status(item)"
            >{{ item.label }}</span>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="index-container">
      <el-row class="tabs-box">
        <el-col :span="24">
          <!-- @tab-click="handleClick" -->
          <el-tabs v-model="queryData.activeName" @tab-click="toggle_activeName()">
            <el-tab-pane
              v-for="item in liveTypeTabs"
              :key="item.name"
              :label="item.title"
              :name="item.name"
            ></el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col
          v-for="(item, index) in liveList"
          :key="index"
          :span="6"
          type="flex"
          justify="start"
          class="grid-content cursorDiv"
        >
          <el-card :body-style="{ padding: '0px' }">
            <div class="item_live_imgBox" style="cursor: pointer" @click="goDetail(item.liveId)">
              <div class="watchnum">
                <img src="../../assets/images/playicon.png" width="48" height="48" alt="" />
                <span class="num"><i class="iconfont iconimage_icon_user"></i>{{ item.viewersNumber || 0 }}</span>
              </div>
              <img :src="item.coverImageUrl" class="image_live" />
              <span v-if="item.status == 'live'" class="item_live_status">直播中</span>
              <!-- <span v-show="item.status == 'start'" class="item_live_status" style="color:#00B061">未开始</span> -->
              <span v-else class="item_live_status" style="color: #fcba00">未开始</span>
              <!-- <div
                v-show="item.status == 'live'"
                class="item_live_playButton"
                @click="goDetail(item.liveId)"
              >
                <span @click="goDetail(item.liveId)"></span>
              </div> -->
              <!-- <span v-show="item.status == 'live'" class="item_live_userNumber"><i class="el-icon-user"></i> {{ item.viewersNumber }}</span> -->
            </div>

            <div style="padding: 16px 14px; height: 93px">
              <h3 class="showText">{{ item.channelName }}</h3>
              <p class="department">{{ item.categoryName }}</p>

              <div class="footer">
                <live-time-tips :item="item" />
                <div class="tag" style="position:relative;">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="item.knowledgeSystemName"
                    placement="top-start"
                    :disabled="item.isShow"
                  >
                    <span
                      v-if="item.knowledgeSystemName"
                      :ref="'tag' + index"
                      @mouseover="isShow(index)"
                    >{{ item.knowledgeSystemName }}</span>
                  </el-tooltip>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col v-if="liveList.length" :span="6" :offset="14">
          <el-pagination
            layout="total,prev,pager,next,sizes,jumper"
            :total="queryData.totalNum"
            :page-size.sync="queryData.pageSize"
            :current-page.sync="queryData.totalNo"
            @current-change="toggle_page"
            @size-change="toggle_pageSize"
          >
            <span class="pageSizeInput"> <el-input class="pageSizeBorder"></el-input>条/页</span>
          </el-pagination>
        </el-col>
        <div v-else style="text-align: center">
          <img src="../../assets/images/nodata.png" />
          <div>暂无数据</div>
        </div>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getcategoryTree, getLiveList } from '@/api/live'
import { getAllKnowledgeCatalogList } from '@/api/knowledge'
import LiveTimeTips from '@/views/live/components/LiveTimeTips'
// import CategorySelect from '@/views/course/components/CategorySelect'
// 直播列表
export default {
  name: 'LiveList',
  components: { LiveTimeTips },
  data() {
    return {
      queryData: {
        // 包含所有搜索条件参数
        search_liveName: '', // input 搜索
        liveType_select: '', // 直播分类
        liveStatus_select: '', // 直播状态
        knowledgeClass_select: '', //直播知识体系
        activeName: '1', // 直播任务类型
        totalNum: 10,
        totalNo: 1,
        pageSize: 10
      },
      liveStatus: [
        // 所有直播状态
        {
          id: '',
          label: '全部'
        },
        // {
        //   id: 'ready',
        //   label: '未开始'
        // },
        {
          id: 'live',
          label: '直播中'
        },
        {
          id: 'end',
          label: '未开始'
        }
        // {
        //   id: 'replay',
        //   label: '直播回放'
        // }
      ],
      moreLiveTypeButton: false, // 根据分类长度判断是否显示更多按钮
      moreKnowledgeTypeButton: false, // 根据分类长度判断是否显示更多按钮
      liveClassification: [], // 获取所有直播分类
      knowledgeClassifyList: [], //获取知识体系分类
      navigation: [], //   面包屑导航，包含本层级的所有分类和当前项
      knowledgeNavigation: [], //   知识体系面包屑导航，包含本层级的所有分类和当前项
      liveList: [],
      liveTypeTabs: [
        // tabs选项卡
        {
          title: '直播任务',
          name: '1'
        },
        {
          title: '我的直播',
          name: '2'
        },
        {
          title: '全部直播',
          name: '3'
        }
      ],
      flag: false
    }
  },
  watch: {
    liveClassification: function() {
      this.$nextTick(function() {
        // 判断分类是否超出1行
        if (this.$refs.liveTypes.$el.offsetHeight > 43) {
          this.moreLiveTypeButton = true
          this.$refs.liveTypes.$el.style.height = '35px'
        }
      })
    },
    knowledgeClassifyList: function() {
      this.$nextTick(function() {
        // 判断分类是否超出1行
        if (this.$refs.knowledgeTypes.$el.offsetHeight > 43) {
          this.moreKnowledgeTypeButton = true
          this.$refs.knowledgeTypes.$el.style.height = '35px'
        }
      })
    }
  },
  mounted() {
    // 获取直播分类

    getcategoryTree({
      source: 'live'
    }).then((res) => {
      res.forEach((element) => {
        if (element.status === 1) {
          this.liveClassification.push(element)
        }
      })
    })
    getAllKnowledgeCatalogList({ id: '0' }).then((res) => {
      this.knowledgeClassifyList = res
    })

    // 默认获取我的直播任务,如果为空隐藏该tabs
    getLiveList({
      listType: 1
    }).then((res) => {
      if (res.data.length == 0) {
        this.liveTypeTabs.splice(0, 1)
        this.queryData.activeName = '2'
        this.getLiveListData(true, false)
      } else {
        this.getLiveListData()
      }
    })
  },
  methods: {
    getNavigationByType(type) {
      return _.filter(this.navigation, { type })
    },
    // 获取直播列表数据
    // isQuery查询阐述，isFirstPage判断是否从第一页开始查询，除了直接点击切换页面外点击分类等都从第一页开始查询
    getLiveListData(isQuery, isFirstPage) {
      if (isQuery) {
        var params = {}
        params.listType = this.queryData.activeName
        this.queryData.search_liveName != '' ? (params.search = this.queryData.search_liveName) : ''
        this.queryData.liveStatus_select != ''
          ? (params.status = this.queryData.liveStatus_select)
          : ''
        this.queryData.liveType_select != ''
          ? (params.categoryId = this.queryData.liveType_select)
          : ''
        params.pageSize = this.queryData.pageSize
        this.queryData.knowledgeClass_select != ''
          ? (params.knowledgeSystemId = this.queryData.knowledgeClass_select)
          : ''
        // 是否从第一页开始查询
        if (isFirstPage) {
          params.pageNo = this.queryData.totalNo
        } else {
          params.pageNo = this.queryData.totalNo = 1
        }
        getLiveList(params).then((res) => {
          this.liveList = res.data
          this.queryData.totalNum = res.totalNum
        })
      } else {
        getLiveList().then((res) => {
          this.liveList = res.data
          this.queryData.totalNum = res.totalNum
        })
      }
    },
    // 点击全部分类获取当前分类的父级分类id
    // 获取父级id下的所有视频
    showThisLiveAllType(type) {
      let queryKkey = type === 'classify' ? 'liveType_select' : 'knowledgeClass_select',
        navigationKey = type === 'classify' ? 'navigation' : 'knowledgeNavigation'
      this.queryData[queryKkey] =
        this[navigationKey].length > 0
          ? this[navigationKey][this[navigationKey].length - 1].children.idStr
          : ''
      this.getLiveListData(true, false)
    },
    // 更多按钮，控制分类超过两行是否显示
    showAllLiveType(type) {
      let key = type === 'classify' ? 'liveTypes' : 'knowledgeTypes'
      if (this.$refs[key].$el.style.height == '35px') {
        this.$refs[key].$el.style.height = 'auto'
      } else {
        this.$refs[key].$el.style.height = '35px'
      }
    },
    // input输入搜索
    search_live() {
      this.getLiveListData(true, false)
    },
    // 切换直播任务，直播任务/我的直播/全部直播
    toggle_activeName() {
      this.getLiveListData(true, false)
    },
    // 点击分类如果有下级显示下级并且将当前级别显示在面包屑导航上
    toggle_type(obj, item, type) {
      let key = type === 'classify' ? 'liveClassification' : 'knowledgeClassifyList',
        queryKkey = type === 'classify' ? 'liveType_select' : 'knowledgeClass_select',
        navigationKey = type === 'classify' ? 'navigation' : 'knowledgeNavigation'
      this.queryData[queryKkey] = item.idStr
      if (item.children) {
        this[key] =
          type === 'classify' ? item.children.filter((i) => i.status === 1) : item.children // 只显示不被禁用的分类
        this[navigationKey].push({
          sameLevel: obj,
          children: item
        })
      }
      this.getLiveListData(true, false)
    },
    // 切换直播状态并且重新获取数据
    goggle_status(item) {
      this.queryData.liveStatus_select = item.id
      this.getLiveListData(true, false)
    },
    // 跳转直播详情页
    goDetail(id) {
      this.$router.push({ path: '/live/Detail', query: { id: id } })
    },
    // 删除面包屑导航
    close_breadcrumb_navigation(arr, item, index, type) {
      arr.splice(index, 1)
      let key = type === 'classify' ? 'liveClassification' : 'knowledgeClassifyList',
        queryKkey = type === 'classify' ? 'liveType_select' : 'knowledgeClass_select',
        navigationKey = type === 'classify' ? 'navigation' : 'knowledgeNavigation'
      this[key] = item.sameLevel
      this.queryData[queryKkey] =
        this[navigationKey].length > 0
          ? this[navigationKey][this[navigationKey].length - 1].children.idStr
          : ''
    },
    // 分页切换到某一页面
    toggle_page(index) {
      this.queryData.totalNo = index
      this.getLiveListData(true, true)
    },
    // 修改分页每次列表显示数据数量
    toggle_pageSize(size) {
      this.queryData.pageSize = size
      this.getLiveListData(true, false)
    },
    isShow(index) {
      this.$set(this.liveList[index], 'isShow', this.$refs['tag' + index][0].offsetWidth <= 72)
    }
  }
}
</script>

<style scoped lang="scss">
.live {
  .top-container {
    margin-top: 20px;
    padding: 24px 24px 5px;
    background-color: #fff;
    border-bottom: 1px solid #ebeced;
    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
    .search-wrapper {
      padding-bottom: 16px;
      border-bottom: 1px solid rgba(235, 236, 237, 1);
      .search-box {
        width: 380px;
      }
    }
    .filter-wrapper {
      padding-top: 25px;
      color: rgba(0, 11, 21, 0.85);
      .breadcrumb_navigation {
        height: 43px;
        .title {
          margin-right: 20px;
          font-size: 12px;
        }
        .type {
          background: #f5f5f6;
          font-size: 12px;
          display: inline-block;
          padding: 3px 0px 3px 10px;
        }
        .type_list {
          padding: 3px 5px;
          font-size: 12px;
          background: #f5f5f6;
          display: inline-block;
          .label {
            color: #2875d4;
          }
          .close {
            color: #2875d4;
            margin-left: 10px;
          }
          .right {
            margin-left: 5px;
          }
        }
      }
      .filter-item {
        font-size: 14px;
        margin-top: 5px;
        line-height: 25px;
        overflow: hidden;
        height: auto;
        width: 100%;
        span {
          height: 35px;
          display: inline-block;
          margin-left: 20px;
          cursor: pointer;
        }
        .active_type {
          color: #2875d4;
        }
        .more_type {
          float: right;
          span {
            margin: 0 10px 0 5px;
          }
        }
      }
    }
  }
  .index-container {
    .image_live {
      width: 100%;
      height: 166px;
    }
    .item_live {
      margin-bottom: 25px;
    }
    .item_live_imgBox {
      position: relative;
      .watchnum {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        justify-content: center;
        display: flex;
        align-items: center;
        .num {
          position: absolute;
          bottom: 9px;
          right: 9px;
          background: rgba(0, 11, 21, 0.45);
          border-radius: 4px;
          padding: 3px 9px;
          color: #fff;
          .iconfont {
            font-size: 12px;
            margin-right: 5px;
          }
        }
      }
      .item_live_status {
        position: absolute;
        top: 10px;
        right: 20px;
        background: #fff;
        font-size: 12px;
        -webkit-transform: scale(0.9);
        padding: 5px 8px;
        border-radius: 3px;
        color: #2875d4;
      }
      .item_live_playButton {
        position: absolute;
        width: 48px;
        height: 48px;
        background: rgba(0, 0, 0, 0.5);
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        border-radius: 50%;
        span {
          position: absolute;
          width: 18px;
          height: 18px;
          top: 0;
          left: -10px;
          right: 0;
          bottom: 0;
          margin: auto;
          background-image: linear-gradient(-45deg, #fff 40%, transparent 40%);
          transform: rotate(-45deg);
        }
      }
      .item_live_userNumber {
        position: absolute;
        right: 10px;
        bottom: 10px;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 3px;
        color: #fff;
        padding: 3px 5px;
        font-size: 12px;
      }
    }

    h3 {
      margin: 0 0 15px 0;
      font-size: 14px;
    }

    .showText {
      width: 250px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .department {
      color: #ccc;
      font-size: 12px;
      margin: 8px 0 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .tabs-box {
      background: #fff;
      padding: 5px 20px 0;
      box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
      margin: 20px 0;
      > div {
        margin: 0;
      }
      /deep/.el-tabs__header {
        margin-bottom: 1px;
      }
      /deep/.el-tabs__nav-wrap::after {
        background: transparent;
      }
      /deep/.el-tabs__item {
        height: 45px;
      }
    }
  }
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .tag {
      text-align: center;
      flex-shrink: 0;
      max-width: 88px;
      background: #f5f5f6;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      border-radius: 4px;
      padding: 3px 8px;
      font-size: 12px;

      color: rgba(0, 11, 21, 0.45);
    }
  }
  ::v-deep .el-card__body {
    height: 282px;
  }
}
</style>
