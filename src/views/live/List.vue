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
        <el-row v-show="navigation.length != 0" class="breadcrumb_navigation">
          <el-col :span="24">
            <span class="title">已选条件：</span>
            <span class="type">分类：</span>
            <div v-for="(item, index) in navigation" :key="index" class="type_list">
              <span class="label">{{ item.children.name }}</span>
              <span v-show="navigation.length - 1 == index" class="close"><i
                class="el-icon-close"
                @click="close_breadcrumb_navigation(navigation, item, index)"
              ></i></span>
              <span v-show="navigation.length - 1 != index" class="right"><i class="el-icon-arrow-right"></i></span>
            </div>
          </el-col>
        </el-row>
        <el-row ref="liveTypes" class="filter-item">
          <el-col :span="1">
            分类：
          </el-col>
          <el-col :span="20">
            <!-- 如果当前选中的id等于父级id则高亮全部，或在最顶级分类无任何选中时高亮，面包屑导航数组中最后一个则为当前分类的父级分类并且存有id -->
            <span
              :class="
                queryData.liveType_select ==  
                  (navigation.length > 0 ? navigation[navigation.length - 1].children.idStr : '')
                  ? 'active_type'
                  : ''
              "
              @click="showThisLiveAllType()"
            >
              全部
            </span>
            <span
              v-for="(item, index) in liveClassification"
              :key="index"
              :class="queryData.liveType_select == item.idStr ? 'active_type' : ''"
              @click="toggle_type(liveClassification, item)"
            >{{ item.name }}</span>
          </el-col>
          <el-col v-show="moreLiveTypeButton" :span="2">
            <el-button size="small" class="more_type" @click="showAllLiveType()">
              更多
              <i class="el-icon-arrow-down"></i>
            </el-button>
          </el-col>
        </el-row>

        <el-row class="filter-item">
          <el-col :span="23">
            状态：
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
        <el-col v-for="(item, index) in liveList" :key="index" :span="6" type="flex"  justify="start" class="grid-content cursorDiv">
          <el-card :body-style="{ padding: '0px' }">
            <div class="item_live_imgBox " style="cursor: pointer;">
              <img :src="item.coverImageUrl" class="image_live" @click="goDetail(item.liveId)" />
              <span v-show="item.status == 'live'" class="item_live_status">直播中</span>
              <span v-show="item.status == 'start'" class="item_live_status" style="color:#00B061">未开始</span>
              <span v-show="item.status == 'end'" class="item_live_status" style="color:#FCBA00">已结束</span>
              <div  @click="goDetail(item.liveId)"
                v-show="item.status == 'live'"
                class="item_live_playButton"
              >
                <span  @click="goDetail(item.liveId)" ></span>
              </div>
              <span v-show="item.status == 'live'" class="item_live_userNumber"><i class="el-icon-user"></i> {{ item.viewersNumber }}</span>
            </div>

            <div style="padding: 10px 14px;height: 93px;">
              <h3 class="showText">{{ item.channelName }}</h3>
              <p class="department">{{ item.categoryName }}</p>
              <el-tooltip
                class="item"
                effect="dark"
                content="Bottom Center 提示文字"
                placement="top"
              >
                <p v-if="item.planTime.length > 0" class="department">
                  {{ item.lecturerName }} |

                  <span v-if="item.batchDeclare == 'plural' || item.batchDeclare == 'single'">
                    {{ item.planTime[0].split('~')[0] }} ~ {{ item.planTime[0].split('~')[1] }}
                  </span>

                  <span v-if="item.cycleInfo.cycleMode == 'day'">
                    <span>每天 </span>
                  </span>
                  <span v-if="item.cycleInfo.cycleMode == 'week'">
                    <span>每周 </span>
                    <span v-for="(item, index) in item.cycleInfo.cycleTime.split(',')" :key="index">周{{ item }}/</span>
                  </span>
                  <span v-if="item.cycleInfo.cycleMode == 'month'">
                    <span>每月 </span>
                    <span v-for="(item, index) in item.cycleInfo.cycleTime.split(',')" :key="index">{{ item }}号/</span>
                  </span>
                  <span>
                    {{ item.planTime[0].split('~')[0].split(' ')[1] }} ~
                    {{ item.planTime[0].split('~')[1].split(' ')[1] }}</span>
                </p>  
                 <p v-else   class="department"   style="padding: 10px 14px;height: 96px;" >
                   <span>
                     &nbsp;
                   </span>
                 </p>

                <div slot="content">
                  <div v-if="item.batchDeclare == 'plural' || item.batchDeclare == 'single'">
                    <p v-for="(i, index) in item.planTime" :key="index">
                      第{{ index + 1 }}次：{{ i.split('~')[0] }} ~ {{ i.split('~')[1] }}
                    </p>
                  </div>
                  <p v-if="item.cycleInfo.cycleMode == 'day'">每天</p>
                  <p v-if="item.cycleInfo.cycleMode == 'week'">
                    每周
                    <span v-for="(item, index) in item.cycleInfo.cycleTime.split(',')" :key="index">周{{ item }}/</span>
                  </p>
                  <p v-if="item.cycleInfo.cycleMode == 'month'">
                    每月
                    <span v-for="(item, index) in item.cycleInfo.cycleTime.split(',')" :key="index">{{ item }}号/</span>
                  </p>

                  <div v-if="item.batchDeclare == 'cycle'">
                    <p v-for="(i, index) in item.planTime" :key="index">
                      第{{ index + 1 }}次：{{ i.split('~')[0].split(' ')[1] }} ~
                      {{ i.split('~')[1].split(' ')[1] }}
                    </p>
                  </div>
                </div>
              </el-tooltip>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6" :offset="14" v-if="liveList.lenght>0">
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
       <div v-if="liveList.lenght==0 || _.isEmpty(liveList)" style="text-align: center;">
        <img src="../../assets/images/nodata.png" />
        <div>暂无数据</div>
      </div>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getcategoryTree, getLiveList } from '@/api/live'
// 直播列表
export default {
  name: 'LiveList',
  data() {
    return {
      queryData: {
        // 包含所有搜索条件参数
        search_liveName: '', // input 搜索
        liveType_select: '', // 直播分类
        liveStatus_select: '', // 直播状态
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
        {
          id: 'ready',
          label: '未开始'
        },
        {
          id: 'live',
          label: '直播中'
        },
         {
          id: 'end',
          label: '已结束'
         }
        // {
        //   id: 'replay',
        //   label: '直播回放'
        // }
      ],
      moreLiveTypeButton: false, // 根据分类长度判断是否显示更多按钮
      liveClassification: [], // 获取所有直播分类
      navigation: [], //   面包屑导航，包含本层级的所有分类和当前项
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
      ]
    }
  },
  watch: {
    liveClassification: function() {
      this.$nextTick(function() {
        // 判断分类是否超出1行
        if (this.$refs.liveTypes.$el.offsetHeight > 43) {
          this.moreLiveTypeButton = true
          this.$refs.liveTypes.$el.style.height = '30px'
        }
      })
    }
  },
  mounted() {
    // 获取直播分类

    getcategoryTree({
      source: 'live',
    }).then((res) => {
      res.forEach(element => {
        if(element.status===1){
          this.liveClassification.push(element)
        } 
      });
      
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
          console.log(res.data)
          this.queryData.totalNum = res.totalNum
        })
      }
    },
    // 点击全部分类获取当前分类的父级分类id
    // 获取父级id下的所有视频
    showThisLiveAllType() {
      this.queryData.liveType_select =
        this.navigation.length > 0 ? this.navigation[this.navigation.length - 1].children.idStr : ''
      this.getLiveListData(true, false)
    },
    // 更多按钮，控制分类超过两行是否显示
    showAllLiveType() {
      if (this.$refs.liveTypes.$el.style.height == '30px') {
        this.$refs.liveTypes.$el.style.height = 'auto'
      } else {
        this.$refs.liveTypes.$el.style.height = '30px'
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
    toggle_type(obj, item) {
      this.queryData.liveType_select = item.idStr
      if (item.children) {
        this.liveClassification = item.children
        this.navigation.push({
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
    close_breadcrumb_navigation(arr, item, index) {
      arr.splice(index, 1)
      this.liveClassification = item.sameLevel
      this.queryData.liveType_select =
        this.navigation.length > 0 ? this.navigation[this.navigation.length - 1].children.idStr : ''
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
            color: #01aafc;
          }
          .close {
            color: #01aafc;
            margin-left: 10px;
          }
          .right {
            margin-left: 5px;
          }
        }
        .type {
        }
      }
      .filter-item {
        font-size: 14px;
        margin-top: 5px;
        line-height: 25px;
        overflow: hidden;
        height: auto;
        span {
          height: 35px;
          display: inline-block;
          margin-left: 20px;
          cursor: pointer;
        }
        .active_type {
          color: #01aafc;
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
      .item_live_status {
        position: absolute;
        top: 10px;
        right: 20px;
        background: #fff;
        font-size: 12px;
        -webkit-transform: scale(0.9);
        padding: 5px 8px;
        border-radius: 3px;
        color: #01aafc;
      
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
    
    .showText{
      width: 250px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
     
    }

    .department {
      color: #ccc;
      font-size: 12px;
      margin: 5px 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .tabs-box {
      background: #fff;
      padding: 5px 20px 0;
      box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
      margin: 30px 0;
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

  
}
</style>
