<template>
  <div class="newsDetails">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/news/list' }">
          新闻中心
        </el-breadcrumb-item>
        <el-breadcrumb-item style="color:rgba(0,11,21,0.85);">
          文章详情
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="content">
      <div class="btnBar">
        <div>
          <el-button size="small" @click="tonewsList">
            &nbsp; <i class="icon-fanhui fanhuiicon"></i> &nbsp; 返回上一级
          </el-button>
        </div>
        <div class="btnBar_to">
          <div>
            <el-button size="small" icon="el-icon-arrow-left" @click="cutInfo(0)">
              &nbsp;上一页
            </el-button>
          </div>
          <div>
            <el-button size="small" @click="cutInfo(1)">
              下一页&nbsp;<i class="el-icon-arrow-right el-icon--right"></i>
            </el-button>
          </div>
        </div>
      </div>

      <div class="content_title">
        {{ data.title }}
      </div>
      <div class="content_title_info">
        <div class="info_box">
          <span class="info_title"> 创建人 :&nbsp;</span>
          <span class="info_val">{{ data.userName }}</span>
        </div>
        <div class="info_box">
          <span class="info_title">创建时间 :&nbsp;</span>
          <span class="info_val">{{ data.beginPublishTime }}</span>
        </div>
        <div class="info_box">
          <span class="info_title">阅读量 :&nbsp;</span>
          <span class="info_val">{{ data.hits }}</span>
        </div>
      </div>

      <div class="download">
        <div v-for="(item, index) in data.attachment" :key="index">
          <el-button
            type="text"
            icon="el-icon-paperclip"
            style="font-size: 12px;"
            @click="isdownload(index)"
          >
            附件下载
          </el-button>
          <span>{{ item.localName }}</span>
          <a ref="file" href="#" :download="item.url"></a>
        </div>
      </div>

      <div class="content_info">
        <div class="newsImg_info info" v-html="data.content"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { newsInfo } from '@/api/pressCenter/pressCenter'
export default {
  name: 'NewsDetails',
  data() {
    return {
      data: {
        hits: '',
        topTime: ''
      },
      id: '',
      disabledBottom: false
    }
  },

  watch: {},

  created() {
    // this.getInfo()
    // console.log(Date.parse(new Date()).toString());
  },
  activated() {
    this.getInfo()
  },
  methods: {
    cutInfo(type) {
      let params = {
        // createTime: Date.parse(new Date()),
        beginPublishTime: this.data.beginPublishTime,
        type
      }

      this.getInfo(params)
    },

    async getInfo(data) {
      let params = {}
      if (!data) {
        params = {
          id: this.$route.query.id,
          hits: this.data.hits || this.$route.query.hits
        }
      } else {
        params = {
          ...data
        }
      }

      params.isHot = this.$route.query.isHot
      params.topTime = this.data.topTime
      // console.log(params)
      let res = await newsInfo(params)
      if (JSON.stringify(res) != '{}') {
        this.data = res
        this.data.content = _.unescape(this.data.content)
      } else {
        let info = data.type ? '下一页' : '上一页'
        this.$message.error(info + '没有内容了哦!')
      }
    },

    isdownload(index) {
      this.$refs.file[index].click()
    },

    tonewsList() {
      this.$router.push({ path: '/news/list' })
    }
  }
}
</script>

<style lang="scss" scoped>
.newsDetails {
  .breadcrumb {
    font-size: 14px;
    color: rgba(0, 11, 21, 0.45);
    line-height: 22px;
    margin: 24px 0;
  }
  .content {
    width: 1200px;
   /* height: 1000px;*/
    margin: 0 auto;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.1);
    padding: 24px;
    .btnBar {
      display: flex;
      justify-content: space-between;
      .btnBar_to {
        display: flex;
      }
      button {
        line-height: 16px;
        font-weight: bold;
      }
      .fanhuiicon {
        font-size: 10px;
        color: rgba(0, 11, 21, 0.85);
        letter-spacing: 0;
        font-weight: bold;
      }
    }
    .content_title {
      opacity: 0.85;
      font-family: PingFangSC-Medium;
      font-size: 22px;
      color: #000b15;
      line-height: 34px;
      margin-top: 24px;
    }
    .content_title_info {
      display: flex;
      font-size: 14px;
      color: rgba(0, 11, 21, 0.45);

      .info_box {
        margin-right: 24px;
        margin-top: 16px;
      }
    }
    .download {
      font-size: 12px;
      color: rgba(0, 11, 21, 0.45);
      border-bottom: 1px solid #ebeced;
      margin-bottom: 25px;
      padding-bottom: 20px;
      div {
        height: 20px;
      }
      span {
        margin-left: 10px;
      }
    }
    .info {
      //opacity: 0.65;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #000b15;
      line-height: 22px;
    }
  }
}
</style>
<style>
.newsImg_info img {
  width: 100%;
}
</style>
