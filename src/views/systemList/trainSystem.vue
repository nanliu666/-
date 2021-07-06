<template>
  <div v-loading="loading">
    <common-breadcrumb :route-list="routeList" />
    <div class="system-tab">
      <el-tabs v-model="queryData.activeName" @tab-click="toggle_activeName">
        <el-tab-pane
          v-for="item in systemListTypeTabs"
          :key="item.name"
          :label="item.title"
          :name="item.name"
        ></el-tab-pane>
      </el-tabs>
      <el-row type="flex" justify="space-between" align="center">
        <el-col :span="8">
          <el-input
            v-model="queryData.search_name"
            clearable
            size="small"
            class="search-box"
            placeholder="查找相关清单"
            suffix-icon="el-icon-search"
            maxlength="20"
            @input="search_systemList(queryData.search_name)"
          >
          </el-input>
        </el-col>
        <el-col class="system-right-query">
          <el-checkbox
            v-model="allChecked"
            :indeterminate="indeterminate"
            :disabled="trainSystemList.length < 1"
            @change="getAllChecked"
          >全选</el-checkbox>
          <div
            class="system-right-download"
            :class="chechedId.length > 0 ? '' : 'active'"
            @click="allowDownload"
          >
            <i class="el-icon-download"></i>
            <span>批量下载({{ chechedId.length }})</span>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-row :gutter="20">
      <el-col v-for="item in trainSystemList" :key="item.id" :span="6">
        <div class="homeSystem">
          <div class="systemItem">
            <template v-if="item.showIcon">
              <div class="imgIcon">
                <img :src="item.showIcon" alt="" />
              </div>
            </template>
            <template v-else>
              <el-image :src="item.fileUrl" class="img" fit="cover" />
            </template>
            <div class="homeSystemList">
              <div class="homeSystemTitle">
                <span class="homeSystemName">{{ item.fileName }}</span>
                <span v-if="item.status > 0" class="homeSystemListTop">置顶</span>
              </div>
              <div class="homeSystemTextTime">{{ item.uploadTime }}</div>
            </div>
          </div>
          <div class="system-list-mask" :class="{ showMask: item.isCheck }">
            <div class="system-list-mask-box">
              <el-checkbox
                v-model="item.isCheck"
                class="system-list-checked"
                @change="changeChecked($event, item)"
              ></el-checkbox>
              <div class="mask-item" @click="changeDownload(item)">
                <i class="el-icon-download"></i>
                <span>下载</span>
              </div>
              <div class="mask-item" @click="changeView(item)">
                <i class="el-icon-view"></i>
                <span>预览</span>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <div>
      <div v-if="trainSystemList.length" class="pagination">
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
      </div>
      <div v-else style="text-align: center">
        <img src="../../assets/images/nodata.png" />
        <div>暂无数据</div>
      </div>
    </div>
  </div>
</template>
<script>
import CommonBreadcrumb from '@/components/common-breadcrumb/Breadcrumb'
import { getHomeSystemList } from '@/api/home'
import { downLoadFile,getReviewUrl } from '@/util/util'
const myIcon = {
  ppt: require('../../assets/images/icon_ppt.svg'),
  doc: require('../../assets/images/icon_doc.svg'),
  pdf: require('../../assets/images/icon_pdf.svg'),
  other: require('../../assets/images/icon_other.svg'),
  ad: require('../../assets/images/icon_ad.svg'),
  xls: require('../../assets/images/icon_xls.svg'),
  zip: require('../../assets/images/icon_zip.svg'),
  vi: require('../../assets/images/icon_vi.svg')
}
export default {
  name: 'HomeSystemList',
  components: {
    CommonBreadcrumb
  },
  data() {
    return {
      trainSystemList: [], //培训制度
      routeList: [
        {
          path: '/home',
          title: '首页'
        },
        {
          path: '',
          title: _.get(this.$route.meta, 'title', ' ')
        }
      ],
      systemListTypeTabs: [
        {
          title: '培训制度',
          name: '1'
        },
        {
          title: '业务表单',
          name: '2'
        }
      ],
      tabIndex: '1',
      allChecked: false, //所有
      indeterminate: false, //状态标识
      chechedId: [],
      queryData: {
        // 包含所有搜索条件参数
        search_name: '', // input 搜索
        activeName: '1', // 制度清单类型的tab
        totalNum: 0,
        pageSize: 10,
        pageNo: 1
      },
      loading: false
    }
  },
  mounted() {
    this.getSystemList()
  },
  methods: {
    getSystemList(isLoad) {
      // 获取制度清单列表
      this.loading = true
      this.allChecked = false
      this.indeterminate = false
      if (isLoad) {
        this.$set(this.queryData, 'pageNo', 1)
        this.chechedId = []
      }
      const param = {
        pageSize: this.queryData.pageSize,
        pageNo: this.queryData.pageNo,
        type: this.queryData.activeName,
        name: this.queryData.search_name
      }
      getHomeSystemList(param)
        .then((res) => {
          this.loading = false
          const myId = this.chechedId.map((val) => val.id)
          res.data.forEach((val) => {
            val.showIcon=this.showThumb(val.fileUrl)
            val.isCheck = myId.indexOf(val.id) > -1
          })
          this.queryData.totalNum = res.totalNum || 0
          this.trainSystemList = res.data
          this.checkedIcon()
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 全选
    getAllChecked() {
      const myChechedId=this.chechedId.map(val=>val.id)
      this.trainSystemList.forEach((val) => {
        val.isCheck = this.allChecked
        if (this.allChecked) {
          if (myChechedId.indexOf(val.id) < 0) {
            this.chechedId.push(val)
          }
        }
      })
      this.indeterminate = false
      if (!this.allChecked) {
        const trainId = this.trainSystemList.map((val) => val.id)
        this.chechedId = this.chechedId.filter((item) => trainId.indexOf(item.id) < 0)
      }
    },
    // 单选
    changeChecked(checked, row) {
      if (checked) {
        this.chechedId.push(row)
      } else {
        this.chechedId = this.chechedId.filter((val) => val.id != row.id)
      }
      this.checkedIcon()
    },
    //全选icon的变化
    checkedIcon() {
      const no = this.trainSystemList.every((val) => {
        //全部没选
        return val.isCheck == false
      })
      const all = this.trainSystemList.every((val) => {
        //全选
        return val.isCheck == true
      })
      if (!no && all) {
        this.allChecked = true
      }
      if (no && !all) {
        this.allChecked = false
      }
      if (!no && !all) {
        this.indeterminate = true
        this.allChecked = false
      } else {
        this.indeterminate = false
      }
    },
    //批量下载
    allowDownload() {
      if (this.chechedId.length > 0) {
        const imgUrl = this.chechedId.every((val) => {
          return val.fileUrl.indexOf('http') > -1 || val.fileUrl.indexOf('https') > -1
        })
        if (!imgUrl) {
          this.$message.error('文件地址不正确')
          return
        }
        this.chechedId.map((item) => {
          downLoadFile(item)
        })
      }
    },
    showThumb(fileName) {
      const lastIndex = fileName.lastIndexOf('.')
      const fileType = fileName.substr(lastIndex + 1, fileName.length).toLowerCase()
      const docType = ['doc', 'docx']
      const execlType = ['xls', 'xlsx', 'xlsm']
      const pdfType = ['pdf']
      const pptType = ['ppt', 'pptx']
      const wpsType = ['wps', 'rtf']
      const zipType = ['rar', 'zip']
      const adType = ['mp3', 'wma', 'wav']
      const viType = ['avi', 'wmv', 'mp4', '3gp', 'rm', 'rmvb', 'mov']
      if (docType.includes(fileType)) {
        //文档
        return myIcon['doc']
      } else if (execlType.includes(fileType)) {
        return myIcon['xls']
      } else if (pdfType.includes(fileType)) {
        return myIcon['pdf']
      } else if (pptType.includes(fileType)) {
        return myIcon['ppt']
      } else if (wpsType.includes(fileType)) {
        return myIcon['other']
      } else if (zipType.includes(fileType)) {
        return myIcon['zip']
      } else if (adType.includes(fileType)) {
        return myIcon['ad']
      } else if (viType.includes(fileType)) {
        return myIcon['vi']
      }
      return ''
    },
    // 下载
    changeDownload(item) {
      if (item.fileUrl.indexOf('http') < 0 && item.fileUrl.indexOf('https') < 0) {
        this.$message.error('文件地址不正确')
        return
      }
      downLoadFile(item)
    },
    //预览
    async changeView(row) {
      if (row.fileUrl.indexOf('http') < 0 && row.fileUrl.indexOf('https') < 0) {
        this.$message.error('文件地址不正确')
        return
      }
      let url = row.fileUrl
      let onlineViewType = [
        'doc',
        'docx',
        'xls',
        'xlsx',
        'xlsm',
        'ppt',
        'pptx',
      ]
      let allZip=['zip','rar']
      let fileTypeName = url.substring(url.lastIndexOf('.') + 1, url.length).split('?')[0]
      if(allZip.includes(fileTypeName.toLowerCase())){
        this.$message.error('此文件类型无法预览，推荐下载之后打开')
        return
      }
      let isWord = onlineViewType.find((type) => type === fileTypeName.toLowerCase())
      if (isWord) {
        // url = 'http://view.officeapps.live.com/op/view.aspx?src=' + url
        let { data } = await getReviewUrl({
          convertType: 0,
          fileUrl: url
        })
        url=data.data.viewUrl
      }
      window.open(url, '_blank')
    },
    // 切换制度清单
    toggle_activeName() {
      if (this.tabIndex == this.queryData.activeName) {
        return
      }
      this.tabIndex = this.queryData.activeName
      this.chechedId = []
      this.queryData.totalNum = 0
      this.queryData.pageSize = 10
      this.queryData.search_name = ''
      this.getSystemList(true)
    },
    // 搜索
    search_systemList() {
      this.getSystemList(true)
    },
    // 分页切换到某一页面
    toggle_page(index) {
      this.queryData.pageNo = index
      this.getSystemList()
    },
    // 修改分页每次列表显示数据数量
    toggle_pageSize(size) {
      this.queryData.pageSize = size
      this.getSystemList(true)
    }
  }
}
</script>
<style lang="scss" scoped>
.system-tab {
  background: #fff;
  padding: 24px 24px 10px 24px;
  box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
  margin: 20px 0;
  border-radius: 4px;
  /deep/.el-tabs__item {
    font-size: 16px;
    font-weight: 500;
  }
}
.system-right-query {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  .system-right-download {
    margin-left: 20px;
    cursor: pointer;
    .el-icon-download {
      margin-right: 4px;
    }
  }
  .active {
    cursor: not-allowed;
    font-size: 14px;
    color: rgba(0,11,21,0.25);
  }
}
.pagination {
  display: flex;
  justify-content: flex-end;
}

.homeSystem:hover .system-list-mask {
  display: flex;
}
.homeSystem {
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 88, 121, 0.08);
  margin-bottom: 12px;
  border-radius: 4px;
  background: url('/img/bgicon.png') repeat-x 0px 0px #fff;
  box-sizing: border-box;
  padding: 24px 20px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  .systemItem {
    display: flex;
    align-items: center;
    .img {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      margin-right: 17px;
    }
    .imgIcon{
      width: 48px;
      height: 48px;
      border-radius: 50%;
      margin-right: 16px;
      display: flex;
      align-items:center;
      justify-content: center;
      background:rgba(53,144,255,0.1);
      img{
        width:26px;
      }
    }
    .homeSystemList {
      flex: 1;
      .homeSystemTitle {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;
        .homeSystemListTop {
          width: 40px;
          height: 18px;
          border-radius: 4px;
          text-align: center;
          line-height: 18px;
          background: linear-gradient(136deg, #f3d84f 0%, #ffb905 100%);
          font-size: 12px;
          color: #ffffff;
        }
        .homeSystemName {
          max-width: 154px;
          font-size: 14px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: rgba(0, 11, 21, 0.85);
        }
      }
    }
    .homeSystemTextTime {
      text-align: left;
      font-size: 12px;
      color: rgba(0, 11, 21, 0.45);
    }
  }
}
.showMask {
  display: flex !important;
}
.system-list-mask {
  border-radius: 4px;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  transition: all 0.8s ease-in-out;
  background: rgba(0,11,21,0.45);
  display: none;
  align-items: center;
  justify-content: center;
  .system-list-mask-box {
    display: flex;
    align-items: center;
    color: #fff;
  }
  .system-list-checked {
    position: absolute;
    top: 10px;
    left: 10px;
  }
  .mask-item {
    text-align: center;
  }
  .mask-item + .mask-item {
    margin-left: 24px;
  }
  i {
    display: block;
    font-size: 18px;
    margin-bottom: 4px;
  }
}
</style>
