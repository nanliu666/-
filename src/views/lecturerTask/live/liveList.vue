<template>
  <div class="index-container">
    <el-row>
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
            <span v-if="item.status == 'live'" class="item_live_status start">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#iconzhibo"></use></svg>直播中</span>
            <!-- <span v-if="item.status == 'end'" class="item_live_status end">已结束</span> -->
            <span v-else class="item_live_status no-start">未开始</span>
            <div
              v-show="item.status == 'live'"
              class="item_live_playButton"
              @click="goDetail(item.liveId)"
            >
              <span @click="goDetail(item.liveId)"></span>
            </div>
            <span v-show="item.status == 'live'" class="item_live_userNumber"><i class="el-icon-user"></i> {{ item.viewersNumber }}</span>
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
    <i class="iconzhibo"></i>
    <el-row>
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
        <img src="../../../assets/images/nodata.png" />
        <div>暂无数据</div>
      </div>
    </el-row>
  </div>
</template>
<script>
import { lectureLiveTaskList } from '@/api/lecturerTask'
import '@/config/iconfont'
import LiveTimeTips from '@/views/live/components/LiveTimeTips'
// 直播列表
export default {
  name: 'LiveList',
  components: { LiveTimeTips },
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
        {
          id: 'start',
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
      let res = await lectureLiveTaskList(this.queryData)
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
    },
    isShow(index) {
      this.$set(this.liveList[index], 'isShow', this.$refs['tag' + index][0].offsetWidth <= 72)
    }
  }
}
</script>

<style scoped lang="scss">
.index-container {
  margin: 25px 0;
  padding-bottom: 25px;
  background-color: #f8f9f9;
  .grid-content.cursorDiv.el-col.el-col-6 {
    width: 285px !important;
    height: 282px !important;
    padding: 0 !important;
    margin-right: 20px !important;
    box-shadow: 0 2px 8px 0 rgba(0, 63, 161, 0.06);
    margin-bottom: 20px;
  }
  .el-card.is-always-shadow {
    margin-top: 0 !important ;
  }
  .grid-content.cursorDiv.el-col.el-col-6:nth-of-type(4n) {
    margin-right: 0 !important;
  }
  .el-card.is-always-shadow {
    height: 100% !important;
  }
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
      top: 6px;
      right: 7px;
      width: 52px;
      height: 20px;
      font-size: 12px;
      text-align: center;
      line-height: 22px;
      font-weight: 400;
      border-radius: 4px;
    }
    .start {
      color: #2875d4;
      background: #eaf8ff;
    }
    .no-start {
      color: #f5c200;
      background-color: #fffee6;
    }
    .end {
      color: rgba(0, 11, 21, 0.45);
      background-color: #f5f5f6;
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
    margin: 8px 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /deep/.is-always-shadow {
    transition-duration: 0.3s;
    box-shadow: 0 2px 8px 0 rgba(0, 61, 112, 0.06);
    margin-top: 10px;
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 20px 0 rgba(0, 63, 112, 0.12);
      .card-cover {
        visibility: visible !important;
      }
    }
  }
  .icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
    margin-right: 4px;
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
</style>
