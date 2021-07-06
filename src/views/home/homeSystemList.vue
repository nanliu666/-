<template>
  <div>
    <h3 class="LMTitle" style="padding-top:46px">
      <span class="span1">制度清单</span>
      <router-link to="/systemList/trainSystem">
        查看更多
      </router-link>
    </h3>
    <div class="LModule">
      <div class="LModule2">
        <div
          v-for="item in systemListData"
          :key="item.id"
          class="homeSystem"
        >
          <div class="systemItem">
            <template v-if="showThumb(item.fileUrl)">
              <div class="imgIcon">
                <img :src="showThumb(item.fileUrl)" alt="" />
              </div>
            </template>
            <template v-else>
              <el-image :src="item.fileUrl" class="img" fit="cover" />
            </template>
            <div class="homeSystemList">
              <div class="homeSystemTitle">
                <span class="homeSystemName">{{ item.fileName }}</span>
                <span v-if="item.status>0" class="homeSystemListTop">置顶</span>
              </div>
              <div class="homeSystemTextTime">{{ item.uploadTime | formate }}</div>
            </div>
          </div>
          <!-- <common-image-view
            :url="item.url"
            :file-name="item.fileName"
            :is-download="konwledgeDetail.allowDownload === 1"
            :preview-src-list="previewSrcList"
            @downloadFile="downloadFile"
          /> -->
          <div class="system-list-mask">
            <div class="system-list-mask-box">
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
      </div>
    </div>
  </div>
</template>
<script>
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
  components: {},
  filters:{
    formate(val){
      return val.toString().replace(/-/g,'/')
    }
  },
  props: {
    systemListData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  watch:{
    systemListData(val){
      console.log(val)
    }
  },
  mounted(){
  },
  methods: {
    toSystemDetaill(item) {
      // 调转到培训详情
      const { id: trainId, trainName: title, trainWay, userType } = item
      this.$router.push({
        name: 'trainDetail',
        params: {
          title,
          trainId,
          trainWay,
          userType
        }
      })
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
    changeDownload(item){
      if(item.fileUrl.indexOf('http')<0&&item.fileUrl.indexOf('https')<0){
        this.$message.error('文件地址不正确')
        return
      }
      downLoadFile(item)
    },
    //预览
    async changeView(row){
      if(row.fileUrl.indexOf('http')<0&&row.fileUrl.indexOf('https')<0){
        this.$message.error('文件地址不正确')
        return
      }
      let url = row.fileUrl
      let onlineViewType = ['doc','docx', 'xls', 'xlsx','xlsm', 'ppt', 'pptx']
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
    }
  }
}
</script>
<style lang="scss" scoped>
  .homeSystem:hover .system-list-mask{
      display: flex;
  }
  .homeSystem{
    width: 285px;
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 88, 121, 0.08);
    margin: 0 20px 20px 0;
    border-radius: 4px;
    float: left;
    background: url('/img/bgicon.png') repeat-x 0px 0px #fff;
    box-sizing: border-box;
    padding:24px  16px;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    .systemItem{
      display: flex;
      align-items: center;
      .img {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        margin-right: 16px;
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
      .homeSystemList{
        flex:1;
        .homeSystemTitle{
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom:8px;
          .homeSystemListTop{
            width:40px;
            height:18px;
            border-radius: 4px;
            text-align: center;
            line-height:18px;
            background: linear-gradient(136deg, #F3D84F 0%, #FFB905 100%);
            font-size:12px;
            color: #FFFFFF;
          }
          .homeSystemName{
            max-width:154px;
            font-size: 14px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color:rgba(0,11,21,0.85);
          }
        }
      }
      .homeSystemTextTime{
        text-align: left;
        font-size: 12px;
        color: rgba(0,11,21,0.45);
      }
    }
  }
  .system-list-mask{
    border-radius: 4px;
    position: absolute;
    width:100%;
    height:100%;
    left:0;
    // top:100px;
    top:0;
    transition:all 0.8s ease-in-out;
    background: rgba(0,0,0,0.45);
    display: none;
    align-items: center;
    justify-content: center;
    .system-list-mask-box{
      display: flex;
      align-items: center;
      color:#fff;
    }
    .mask-item{
      text-align: center;
    }
    .mask-item+.mask-item{
      margin-left:24px;
    }
    i{
      display: block;
      font-size:18px;
      margin-bottom:4px;
    }
  }
</style>

