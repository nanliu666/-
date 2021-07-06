<template>
  <div>
    <div>
      <common-breadcrumb ref="breadcrumb" :route-list="routeList" />
    </div>

    <div class="CertificateDetail">
      <div class="topBtn">
        <div>
          <div class="title">
            {{ sondata.templateName }}（{{ sondata.certificateNo }}）

            <!-- <span v-if="sondata.status == 1" class="status">
              正常
            </span>
            <span v-if="sondata.status == 2" class="status">
              停用
            </span> -->
            <span v-if="sondata.status == 3" class="status">
              已失效
            </span>
          </div>
          <div class="info">
            <span>颁发机构：{{ sondata.awardAgency || '--' }}</span>
            <span>发放时间：{{ sondata.grantTime || '--' }}</span>
            <span>有效期：{{ sondata.bornTime || '--' }} ~ {{ sondata.deadTime || '--' }} </span>
          </div>
        </div>
        <div class="btn">
          <el-button type="primary" @click="downLoadInfo">
            下载证书
          </el-button>
        </div>
      </div>

      <div class="name_text">
        {{ sondata.text }}
      </div>

      <div ref="capture" class="capture">
        <CertificateComponents :certificate-data="sondata"></CertificateComponents>
      </div>

      <!-- <div ref="capture" >
        <div class="preview_right_in">
          <div class="preview_right_box">
            <img :src="sondata.backUrl" alt="" class="bgimg" />
            <div class="name">
              {{ sondata.templateName }}
            </div>
            <div class="text">
              {{ sondata.text }}
            </div>
            <div class="awardAgency">
              {{ sondata.awardAgency }}
            </div>
            <img :src="sondata.logoUrl" alt="" class="logo" />
            <div class="studentName">
              {{ sondata.stuName }}
            </div>
            <div class="serial">
              <div>证书编号:</div>
              <div>{{ CertificateNumberInitials }}-{{ serialNumber }}</div>
              <div>{{ sondata.grantTime }}</div>
            </div>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas'
import CertificateComponents from './CertificateComponents'
import { pinyin } from 'pinyin-pro'
export default {
  name: 'CertificateDetail',
  components: {
    CertificateComponents,
    CommonBreadcrumb: () => import('@/components/common-breadcrumb/Breadcrumb')
  },
  data() {
    return {
      routeList: [
        {
          path: '/personal',
          title: '我的档案'
        },
        {
          path: '/Certificate',
          title: '证书'
        },
        {
          path: '',
          title: '证书详情'
        }
      ],
      CertificateNumberInitials: '',
      serialNumber: '',
      image: '',
      sondata: {}
    }
  },
  watch: {
    sondata(newVal) {
      let currentstr = pinyin(newVal.awardAgency, { pattern: 'initial', type: 'array' })
        .splice(0, 2)
        .join('')
        .toUpperCase()
      this.CertificateNumberInitials = currentstr ? currentstr : 'YB'
      let currentArr = this.sondata.certificateNo.split('-')
      this.serialNumber = `${currentArr[1]}-${currentArr[2]}`
    },
    $route: {
      handler: function() {
        this.getData()
      },
      // 深度观察监听
      deep: true
    }
  },
  created() {
    this.getData()
  },
  activated() {
    this.getData()
  },
  methods: {
    getData() {
      this.$nextTick(() => {
        this.sondata = JSON.parse(this.$route.query.item)
      })
    },
    //点击生成图片
    downLoadInfo() {
      html2canvas(this.$refs.capture, { useCORS: true, logging: true }).then((canvas) => {
        // this.$refs.addImage.append(canvas);//在下面添加canvas节点
        let link = document.createElement('a')
        link.href = canvas.toDataURL() //下载链接
        link.setAttribute('download', `${this.sondata.templateName + '.png'}`)
        link.style.display = 'none' //a标签隐藏
        document.body.appendChild(link)
        link.click()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.CertificateDetail {
  background-color: #fff;
  margin-top: 20px;
  padding: 24px;
  .topBtn {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #ebeced;
  }
  .title {
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: rgba(0, 11, 21, 0.85);
    letter-spacing: 0;
    line-height: 22px;
    font-weight: 500;
  }
  .info {
    display: flex;
    padding: 8px 0 20px;

    span {
      margin-right: 16px;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: rgba(0, 11, 21, 0.45);
      letter-spacing: 0;
      line-height: 22px;
      font-weight: 400;
    }
  }
  .name {
    font-size: 14px;
    color: rgba(0, 11, 21, 0.85);
    letter-spacing: 0;
    margin-top: 20px;
  }
  .name_text {
    margin: 20px 0 20px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: rgba(0, 11, 21, 0.85);
    letter-spacing: 0;
    line-height: 22px;
    font-weight: 400;
  }

  .preview_right_in {
    //   padding-left: 50px;
    //   padding-top: 20px;
    width: 1152px;
    height: 815px;
    margin-top: 16px;

    .preview_right_box {
      position: relative;
      border: 1px solid #d9dbdc;
      margin-top: 15px;
      width: 100%;
      height: 100%;
      .bgimg {
        width: 100%;
        height: 100%;
        z-index: -1;
      }
      .awardAgency {
        position: absolute;
        bottom: 100px;
        left: 500px;
        z-index: 99;
      }
      .name {
        position: absolute;
        top: 146px;
        left: 50%;
        font-size: 64px;
        color: #ab856a;
        transform: translateX(-50%);
        text-align: center;
        width: 80%;
        font-weight: 600;
      }
      .text {
        position: absolute;
        top: 490px;
        left: 50%;
        transform: translateX(-50%);
        width: 50%;
        height: 28%;

        opacity: 0.65;
        font-size: 18px;
        color: #000b15;
        text-align: center;
        line-height: 28px;
      }
      .logo {
        position: absolute;
        top: 622px;
        left: 50%;
        transform: translateX(-50%);
        width: 112px;
        height: 112px;
      }
      .studentName {
        position: absolute;
        top: 386px;
        left: 50%;
        transform: translateX(-50%);
        opacity: 0.85;
        font-size: 40px;
        color: #000b15;
        text-align: center;
      }
      .serial {
        position: absolute;
        right: 117px;
        bottom: 80px;
        font-size: 14px;
        color: rgba(0, 11, 21, 0.45);
        line-height: 28px;
      }
    }
  }
  .status {
    background-color: rgba(0, 0, 0, 0.226);
    padding: 5px 10px;
    color: #fff;
    border-radius: 3px;
  }
  .capture {
    padding-left: 135px;
  }
}
</style>
