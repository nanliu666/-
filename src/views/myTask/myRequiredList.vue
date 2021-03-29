<template>
  <div class="myRequiredList">
    <ul class="items">
      <li v-for="(item, index) in 30" :key="index" class="item">
        <div class="item_img">
          <img :src="imgUrl" alt="" />
          <span class="span1">进行中</span>
          <span class="span2">未开始</span>
          <span class="span3">已结束</span>
        </div>

        <div class="item_title">
          标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题
        </div>

        <div class="item_time">
          2020/20/20~2020/20/20
        </div>

        <div class="item_Rate">
          <el-rate
            v-model="valueRate"
            disabled
            show-score
            text-color="#ff9900"
            score-template="{value}"
          >
          </el-rate>
        </div>

        <div class="item_complete">
          <img src="@/assets/images/my_seal.png" alt="" />
        </div>
      </li>
    </ul>

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
</template>
<script>
export default {
  data() {
    return {
      imgUrl:
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201805%2F11%2F20180511062955_xjlcy.thumb.700_0.jpg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1619432803&t=7d17d1f82ba55745d0522f3cb2a9412c',
      valueRate: 4.5,
      page: {
        pageNo: 1, //请求页码
        pageSize: 10, //每页条数
        total: 100
      }
    }
  },
  created() {},
  activated() {},
  methods: {
    handleSizeChange(val) {
      this.page.pageSize = val
      this.getInfo()
    },
    handleCurrentChange(val) {
      this.page.pageNo = val
      this.getInfo()
    }
  }
}
</script>

<style scoped lang="scss">
.myRequiredList {
  .items {
    display: flex;
    flex-wrap: wrap;
    .item {
      width: 273px;
      height: 276px;
      border-radius: 4px;
      overflow: hidden;
      box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
      margin-right: 20px;
      margin-top: 20px;
      position: relative;
      cursor: pointer;
      &:nth-child(4n) {
        margin-right: 0;
      }
      &:hover {
        opacity: 0.7;
      }
      &_img {
        width: 100%;
        height: 172px;
        position: relative;
        img {
          width: 100%;
          height: 100%;
        }
        .span1 {
          position: absolute;
          top: 8px;
          right: 8px;
          background: #fffce6;
          border-radius: 4px;
          font-size: 10px;
          width: 52px;
          height: 20px;
          line-height: 20px;
          text-align: center;
          color: #fcba00;
          font-style: none;
        }
        .span2 {
          position: absolute;
          top: 8px;
          right: 8px;
          background: #e7ffee;
          border-radius: 4px;
          font-size: 10px;
          width: 52px;
          height: 20px;
          line-height: 20px;
          text-align: center;
          color: #00b061;
          font-style: none;
        }
        .span3 {
          position: absolute;
          top: 8px;
          right: 8px;
          background: #e7fbff;
          border-radius: 4px;
          font-size: 10px;
          width: 52px;
          height: 20px;
          line-height: 20px;
          text-align: center;
          color: #01aafc;
          font-style: none;
        }
      }
      &_title {
        width: 100%;
        padding: 16px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #000b15;
        font-weight: bold;
        overflow: hidden;
        text-overflow: ellipsis;
        -o-text-overflow: ellipsis;
        white-space: nowrap;
      }
      &_time {
        padding: 3px 16px;
        opacity: 0.65;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #000b15;
        border-bottom: 1px solid #ebeced;
        margin-top: -10px;
        line-height: 28px;
      }
      &_Rate {
        padding: 4px 16px;
      }
      &_complete {
        position: absolute;
        bottom: 5px;
        right: 9px;
        overflow: hidden;
        width: 62px;
        height: 62px;
        border-radius: 50%;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .page {
    height: 50px;
    position: relative;
    .pagination {
      position: absolute;
      right: 24px;
      bottom: 0px;
    }
  }
}
</style>
