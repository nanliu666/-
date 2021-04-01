<template>
  <div class="myRequiredDetails">
    <section>
      <!-- 入口路径 -->
      <div class="entry_path">
        <p><span class="common">学习 / </span><span class="especially">必修课详情</span></p>
      </div>
      <!-- 必修课类别 -->
      <div class="sort">
        <div class="left">
          <img src="./components/test.png" alt="" class="course_img">
        </div>
        <div class="right">
          <ul class="info">
            <li><span class="sort_title">消防学习知识</span><span class="sort_status">进行中</span></li>
            <li>
              <ul class="middle">
                <li>分类：<span class="middle_data">一级分类>二级分类</span></li>
                <li>学习时间：<span class="middle_data">2021/02/03 - 2021/02/05</span></li>
                <li>主办单位：<span class="middle_data">易宝软件</span></li>
              </ul>
            </li>
            <li class="info_bottom"><span class="info_bottom_details"><i class="iconimage_icon_user iconfont iconInfo"></i>200人</span><span class="info_bottom_details"><i class="iconimage_icon_time1 iconfont iconInfo"></i>20.5小时</span><span class="info_bottom_details"><i class="iconjifen iconfont iconInfo"></i>30积分</span></li>
          </ul>
        </div>
      </div>
      <!-- 课程分类 -->
      <div class="classification">
        <el-tabs class="content" v-model="activeName" @tab-click="handleSwitchCategories">
          <el-tab-pane label="全部课程" name="first">
            <my-required-details-list/>
          </el-tab-pane>
          <el-tab-pane label="未开始" name="second">
            <my-required-details-list/>
          </el-tab-pane>
          <el-tab-pane label="进行中" name="third">
            <my-required-details-list/>
          </el-tab-pane>
          <el-tab-pane label="已结束" name="fourth">
            <my-required-details-list/>
          </el-tab-pane>
        </el-tabs>
        <!-- 页码 -->
        <div class="page">
          <el-pagination
            :page-sizes="[10, 20, 30, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page.total"
            class="pagination"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
// import moment from 'moment'
import myRequiredDetailsList from './components/myRequiredDetailsList'
export default {
  name: 'MyRequiredDetails',
  components: {
    myRequiredDetailsList
  },
  props: {
    dataInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      activeName: 'first',
      page: {
        pageNo: 1, //请求页码
        pageSize: 10, //每页条数
        total: 100
      },
    }
  },
  created() {
    // this.handleDefault()
    const params = this.$route.query
    console.log('params----', params)
  },
  methods: {
    // 切换类别
    handleSwitchCategories(tab, event) {
      // console.log(tab, event)
      console.log('handleSwitchCategories')
    },
    // 处理页码大小条数
    handleSizeChange(val) {
      console.log('handleSizeChange')
      this.page.pageNo = 1
      this.page.pageSize = val
      this.getData()
    },
    // 当前页变动
    handleCurrentChange(val) {
      console.log('handleCurrentChange')
      this.page.pageNo = val
      this.getData()
    },
    // 获取数据
    getData() {
      console.log('getData')
    }
  }
}
</script>

<style lang="scss" scoped>
$timeHead: rgba(139, 155, 168, 0.65);

.myRequiredDetails{
  p{
    margin: 0;
  }
  // background: $timeHead;
  font-size: 14px;
  .entry_path{
    // 头部路径标识
    height: 62px;
    display: flex;
    align-items: center;
    .common{
      color: rgba(0,11,21,0.45);
    }
    .especially{
      color: rgba(0,11,21,0.85);
      font-weight: bold;
    }
  }
  .sort{
    // 必修课种类详情
    height: 214px;
    padding: 24px;
    // width: 100%;
    background: #FFFFFF;
    box-shadow: 0 2px 12px 0 rgba(0,61,112,0.08);
    border-radius: 4px;
    display: flex;
    .left{
      // 左边图片
      height: 100%;
      width: 273px;
      margin-right: 24px;
      background:#7498fe;
      border-radius: 4px;
      .course_img{
        height: 100%;
        width: 100%;
      }
    }
    .right{
      // 右边详细详细
      flex: 1;
      color: #000B15;
      .info{
        display: flex;
        height: 100%;
        flex-direction: column;
        justify-content: space-between;
        // align-items: stretch;
        .sort_title{
          font-size: 18px;
          font-weight: bold;
          opacity: 0.85;
        }
        .sort_status{
          margin-left: 16px;
          font-size: 12px;
          color: #FCBA00;
          text-align: center;
          line-height: 20px;
          display: inline-block;
          width: 52px;
          height: 20px;
          background: #FFFCE6;
          border-radius: 4px;
          position: relative;
          top: -3px;
        }
        .middle{
          position: relative;
          top: 2px;
          height: 80px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          li{
            color: rgba(0,11,21,0.45);
          }
          .middle_data{
            color: rgba(0,11,21,0.85);
          }
        }
        .info_bottom{
          font-size: 14px;
          color: rgba(0,11,21,0.45);
          .info_bottom_details{
            margin-right: 25px;
          }
          .iconInfo{
            // font-size: 14px;
            margin-right: 8px;
          }
        }
      }
    }
  }
  .classification{
    width: 100%;
    margin-top: 24px;
    padding: 24px 0;
    background: #FFFFFF;
    box-shadow: 0 2px 12px 0 rgba(0,61,112,0.08);
    border-radius: 4px;
    /deep/ .el-tabs__header{
      margin: 0;
      padding: 0 24px;
    }
    /deep/ .el-tabs__content{
      margin: 0 12px;
    }
    /deep/ .el-tabs__item{
      height: 56px;
      line-height: 56px;
      font-size: 16px;
      color: #000B15;
      opacity: 0.85;
    }
    /deep/ .el-tabs__item.is-active {
      // font-weight: bold;
      color: #01AAFC;
      opacity: 1;
    }
  }
  .content{
    // margin: 0 24px;
  }
  .page {
    display: flex;
    flex-direction: row-reverse;
    padding: 0 24px;
  }
}
</style>
