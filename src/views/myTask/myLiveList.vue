<template>
  <div class="index-container">
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
          <div class="item_live_imgBox" style="cursor: pointer">
            <img :src="item.coverImageUrl" class="image_live" @click="goDetail(item.liveId)" />
            <span v-show="item.status == 'live'" class="item_live_status">直播中</span>
            <!-- <span v-show="item.status == 'start'" class="item_live_status" style="color:#00B061">未开始</span> -->
            <span v-show="item.status == 'end'" class="item_live_status" style="color: #fcba00">未开始</span>
            <div
              v-show="item.status == 'live'"
              class="item_live_playButton"
              @click="goDetail(item.liveId)"
            >
              <span @click="goDetail(item.liveId)"></span>
            </div>
            <span v-show="item.status == 'live'" class="item_live_userNumber"><i class="el-icon-user"></i> {{ item.viewersNumber }}</span>
          </div>

          <div style="padding: 10px 14px; height: 93px">
            <h3 class="showText">{{ item.channelName }}</h3>
            <p class="department">{{ item.categoryName }}</p>
            <el-tooltip class="item" effect="dark" content="Bottom Center 提示文字" placement="top">
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
              <p v-else class="department" style="padding: 10px 14px; height: 96px">
                <span> &nbsp; </span>
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
      <el-col v-if="queryData.totalNum" :span="6" :offset="14">
        <el-pagination
          layout="total,prev,pager,next,sizes,jumper"
          :total="queryData.totalNum"
          :page-size.sync="queryData.pageSize"
          :current-page.sync="queryData.pageNo"
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
</template>
<script>
import { liveStudentList } from '@/api/myTask'
// 直播列表
export default {
  name: 'LiveList',
  data() {
    return {
      queryData: {
        // 包含所有搜索条件参数
        totalNum: 0,
        pageNo: 1,
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

      liveList: []
    }
  },

  created() {
    this.getLiveListData()
  },
  methods: {
    // 获取直播列表数据
    // isQuery查询阐述，isFirstPage判断是否从第一页开始查询，除了直接点击切换页面外点击分类等都从第一页开始查询
    async getLiveListData() {
      let res = await liveStudentList(this.queryData)
      this.liveList = res.data
      this.queryData.totalNum = res.totalNum
    },

    // 跳转直播详情页
    goDetail(id) {
      this.$router.push({ path: '/live/Detail', query: { id: id } })
    },

    // 分页切换到某一页面
    toggle_page(index) {
      this.queryData.pageNo = index
      this.getLiveListData()
    },
    // 修改分页每次列表显示数据数量
    toggle_pageSize(size) {
      this.queryData.pageSize = size
      this.getLiveListData()
    }
  }
}
</script>

<style scoped lang="scss">
.index-container {
  margin-top: 16px;
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

  .showText {
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

  /deep/.is-always-shadow {
    transition-duration: 0.3s;
    box-shadow: 0 2px 8px 0 rgba(0, 63, 161, 0.06);
    margin-top: 10px;
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0px 9px 12px 2px rgba(0.1, 63, 161, 0.12);
      .card-cover {
        visibility: visible !important;
      }
    }
  }
}
</style>
