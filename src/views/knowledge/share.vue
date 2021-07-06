<template>
  <div v-loading="isLoading" class="outsideTraining">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/" style="padding: 25px 0 20px">
      <el-breadcrumb-item>知识分享</el-breadcrumb-item>
      <el-breadcrumb-item>{{ pageTitle }}</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主体内容 -->
    <div class="form-card">
      <el-card>
        <div class="container">
          <!-- 申请信息 -->
          <div class="application-information">
            <div class="title">基本信息</div>
            <!-- 表单信息 -->
            <common-form
              ref="formData"
              style="margin-top: 35px"
              :columns="formColumns"
              :model="formData"
            >
              <template #introduction>
                <el-input
                  v-model="formData.introduction"
                  type="textarea"
                  placeholder="请输入内容"
                  :rows="10"
                  maxlength="200"
                  show-word-limit
                >
                </el-input>
                <div class="attachment-upload">
                  <span>附件上传</span>
                  <span>
                    支持单次或文件批量上传，最多可上传20个文件，且每个文件大小不超过10M，图片大小不超过5M
                  </span>
                </div>
              </template>
              <template #attachments>
                <common-upload
                  v-model="fileList"
                  need-handler
                  :before-upload="beforeUpload"
                  :on-upload-progress="onUploadProgress"
                  :multiple="true"
                  drag
                  @getValue="getValue"
                  @on-masterFileMax="masterFileMax"
                >
                  <template #default>
                    <div class="upload">
                      <i class="iconfont iconimage_icon_export"></i>
                      <div>点击或者拖拽文件到此区域</div>
                      <div>支持文档、ppt、Excel、pdf、音频、视频、压缩文件和其他附件格式</div>
                    </div>
                  </template>
                </common-upload>
                <div class="UploadProgress">
                  <template v-for="(item, index) in progressList">
                    <el-progress
                      v-if="item.percent !== 100"
                      :key="index"
                      :percentage="item.percent"
                      status="success"
                      text-inside
                      :stroke-width="15"
                    />
                  </template>
                </div>
                <ul class="uploader-ul">
                  <li
                    v-for="(item, index) in formData.attachments"
                    :key="index"
                    class="uploader-li"
                  >
                    <svg v-if="iconType(item.fileName)" class="icon" aria-hidden="true">
                      <use :xlink:href="iconType(item.fileName)"></use>
                    </svg>
                    <img
                      v-else
                      :src="item.url"
                      style="width: 35px; height: 35px; border-radius: 5px"
                    />
                    <el-tooltip
                      effect="dark"
                      :content="item.fileName"
                      placement="top"
                      :disabled="!isToolTiop(item.fileName)"
                    >
                      <span class="uploader-file ellipsis">{{ item.fileName }}</span>
                    </el-tooltip>

                    <i class="el-icon-close" @click.stop="deleteUpload(item)" />
                  </li>
                </ul>
              </template>
              <template #type>
                <el-select v-model="formData.type" :disabled="!!formData.attachments.length">
                  <el-option
                    v-for="(item, index) in typeArr"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </template>
            </common-form>
          </div>
          <!-- 提交按钮 -->
          <div class="submit-btn">
            <el-button type="primary" size="medium" @click="submitFn">发布</el-button>
            <el-button style="margin-left: 10px" size="medium" @click="cancel">取消</el-button>
          </div>
        </div>
      </el-card>
    </div>
    <appr-submit
      ref="apprSubmit"
      category-id="11"
      @submit="handleSubmit"
      @apprCancel="isLoading = false"
    />
  </div>
</template>

<script>
import '@/config/iconfont'
import CommonUpload from '@/components/common-upload/CommonUpload'
import { getNextCatalogsById, addKnowledge, getDetailsById, updateKnowledge } from '@/api/knowledge'
import { categoryMap } from '@/const/approve'
import ApprSubmit from '@/components/appr-submit/ApprSubmit'
const FORM_COLUMNS = [
  {
    itemType: 'input',
    label: '知识名称',
    prop: 'resName',
    required: true,
    maxlength: 60,
    span: 24,
    offset: 0
  },
  {
    label: '所在分类',
    itemType: 'treeSelect',
    prop: 'catalogId',
    required: true,
    span: 24,
    offset: 0,
    props: {
      selectParams: {
        placeholder: '请选择所在分类',
        multiple: false
      },
      treeParams: {
        'check-strictly': true,
        'default-expand-all': false,
        'expand-on-click-node': false,
        clickParent: true,
        data: [],
        filterable: false,
        props: {
          children: 'children',
          label: 'name',
          value: 'id',
          disabled: 'disabled'
        },
        required: true
      }
    }
  },
  {
    itemType: 'treeSelect',
    label: '知识体系',
    prop: 'knowledgeSystemId',
    span: 24,
    offset: 0,
    props: {
      props: {
        selectParams: {
          placeholder: '请选择所在分类',
          multiple: false
        },
        treeParams: {
          'check-strictly': true,
          'default-expand-all': false,
          'expand-on-click-node': false,
          clickParent: true,
          data: [],
          filterable: false,
          props: {
            children: 'children',
            label: 'name',
            value: 'id',
            disabled: 'disabled'
          },
          required: true
        }
      }
    }
  },
  {
    prop: 'introduction',
    label: '知识介绍',
    itemType: 'slot',
    span: 24
  },
  {
    itemType: 'radio',
    label: '上传模式',
    prop: 'uploadType',
    required: true,
    span: 24,
    offset: 0,
    options: [
      {
        label: '本地文件',
        value: 0
      },
      {
        label: '链接文件',
        value: 1
      }
    ]
  }
]
const uploadConfigList = [
  {
    prop: 'type',
    label: '知识类型',
    span: 24,
    data: '',
    offset: 0,
    filterable: true,
    multiple: false,
    itemType: 'slot'
  },
  {
    itemType: 'slot',
    label: '附件',
    prop: 'attachments',
    props: {
      label: 'jobName',
      value: 'id'
    },
    required: false,
    span: 24
  }
]
const UPLOAD_ONLINE = [
  {
    itemType: 'input',
    label: '资源路径',
    prop: 'resUrl',
    required: true,
    maxlength: 2083,
    span: 24
  }
]

export default {
  name: 'OutsideTraining',
  components: {
    CommonForm: () => import('@/components/common-form/CommonForm'),
    CommonUpload,
    ApprSubmit
  },
  data() {
    return {
      // 上传文件列表
      fileList: [],
      isLoading: false,
      // 知识类型选项
      typeArr: [
        { value: 1, label: '视频' },
        { value: 2, label: '文档' },
        { value: 3, label: '资料下载' }
      ],
      word: /\.(txt|doc|wps|rtf|docx)$/, // 文档格式
      video: /\.(avi|wmv|mp4|3gp|rm|rmvb|mov)$/, // 视频格式
      image: /\.(jpg|jpeg|png|GIF|gif|bmp)$/, // 图片
      compress: /\.(rar|zip)$/, // 压缩包
      audio: /\.(mp3|wma|wav)$/, // 音频
      // 批量生成进度条
      progressList: [],
      pageTitle: '',
      formData: {
        resName: '',
        catalogId: '',
        providerName: '',
        uploadType: 0, // 0本地文件 1链接文件
        resUrl: '',
        allowDownload: 0, //是否允许下载 0允许 1不允许
        introduction: '',
        attachments: [],
        knowledgeSystemId: '',
        type: 2
      },
      formColumns: FORM_COLUMNS,
      localColumns: [...FORM_COLUMNS, ...uploadConfigList],
      onlineColumns: [...FORM_COLUMNS, ...UPLOAD_ONLINE],
      autoSubmit: false,
      formKey: 'applyKnowledgeShare',
      formDataClone: null
    }
  },

  computed: {
    // 查询参数
    _formData() {
      const formData = _.cloneDeep(this.formData)
      formData.introduction = _.escape(formData.introduction)
      if (this.id) formData.knowledgeId = this.id
      return formData
    },
    catalogId() {
      return this.$route.query.catalogId || null
    },
    id() {
      return this.$route.query.id || null
    },
    iconType() {
      return (type) => {
        const ppt = /\.(ppt)$/
        const pdf = /\.(pdf)$/
        const xls = /\.(xls|xlsx)$/
        if (this.image.test(type)) return false
        else if (this.video.test(type)) return '#iconvi'
        else if (this.compress.test(type)) return '#iconyasuobao'
        else if (this.word.test(type)) return '#icondoc'
        else if (ppt.test(type)) return '#iconppt'
        else if (pdf.test(type)) return '#iconpdf'
        else if (this.audio.test(type)) return '#iconyinpin'
        else if (xls.test(type)) return '#iconxls'
        else return '#iconppt'
      }
    },
    isToolTiop() {
      return (name) => name.length > 25
    }
  },
  watch: {
    // 上传模式变化
    'formData.uploadType': {
      deep: true,
      immediate: true,
      handler(val) {
        // 本地文件（是否下载+附件），资源文件（资源路径）
        let tmp = val === 0 ? this.localColumns : this.onlineColumns
        this.formColumns = tmp
        if (val === 1) {
          this.formData.attachments = []
        } else {
          this.formData.resUrl = ''
        }
      }
    }
  },
  mounted() {
    this.initData()
    this.pageTitle = this.id ? '编辑我的分享' : '一点分享'
    if (this.catalogId) {
      this.formData.catalogId = this.catalogId
    }
  },
  activated() {
    if (this.id) {
      getDetailsById({ id: this.id }).then((res) => {
        res.introduction = _.unescape(res.introduction)
        this.formData = res
      })
    }
  },
  created() {
    this.formDataClone = _.cloneDeep(this.formData)
  },
  methods: {
    // 提交审批
    async submitApply() {
      let id = null
      if (this.id) {
        await updateKnowledge(this._formData)
        id = this.id
      } else {
        id = await addKnowledge(this._formData)
      }
      // this.formData.catalogName = this.parentOrgIdLabel
      this.$refs.apprSubmit
        .submit({
          formId: id,
          processName: categoryMap['11'],
          formKey: this.formKey
        })
        .then(() => {
          this.formData = _.cloneDeep(this.formDataClone)
          this.$message.success('已发布成功。')
          setTimeout(() => {
            this.id ? history.go(-1) : this.$router.push('/knowledge/list')
            this.isLoading = false
          }, 3000)
        })
    },
    handleSubmit() {
      this.submitFn()
    },
    // 上传知识
    submitFn() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          // 判断是否有在上传的文件
          if (this.progressList.length !== 0) {
            this.$message.warning('正在上传附件，请在上传完成后发布')
            return
          }
          this.isLoading = true
          // validate方法返回Promise,校验是否可发起，如果可发起Promise直接resolve
          this.$refs.apprSubmit.validate().then(async (process) => {
            if (process) this.submitApply()
            else {
              if (this.id) await updateKnowledge(this._formData)
              else await addKnowledge(this._formData)
              this.$message.success('已发布成功。')
              this.formData = _.cloneDeep(this.formDataClone)
              setTimeout(() => {
                this.id ? history.go(-1) : this.$router.push('/knowledge/list')
                this.isLoading = false
              }, 3000)
            }
          })
        }
      })
    },
    // 取消事件
    cancel() {
      this.formData = _.cloneDeep(this.formDataClone)
      this.$refs.formData.resetFields()
      history.go(-1)
    },
    initData() {
      let catalogId = _.find(this.formColumns, { prop: 'catalogId' })
      if (catalogId) {
        getNextCatalogsById({ id: '0' }).then((res) => {
          catalogId.props.treeParams.data = res
        })
      }
    },
    // 批量上传文件数量超出
    masterFileMax() {
      this.$message.error('上传文件数不能超过20个')
    },
    // 新增附件时，直接赋值
    getValue(value) {
      this.fileList = []
      _.each(value, (item) => {
        item.fileName = item.localName
      })
      let index = _.findIndex(
        this.formData.attachments,
        (item) => item.fileName === value[0].fileName
      )
      if (index > -1) {
        this.$message.error('附件已存在，请勿重复上传')
      }
      this.formData.attachments = _.uniqBy([...this.formData.attachments, ...value], 'fileName')
    },

    // 是否空文件
    isFileSize(file) {
      if (file.size === 0) {
        this.$message({
          message: '请不要上传空文件哦！',
          type: 'warning'
        })
        return true
      }
    },
    // 上传格式校验
    beforeUpload(file) {
      const fileName = file.name.toLowerCase()
      let regx = /\S/
      let tips = null
      let err = null
      if (this.formData.type === 1) {
        regx = /\.(avi|wmv|mp4|3gp|rm|rmvb|mov)/
        err = '只支持上传视频格式文件'
      } else if (this.formData.type === 2) {
        regx = /\.(txt|doc|wps|rtf|docx|ppt|pdf|jpg|jpeg|png|GIF|BMP)/
        err = '只支持上传文档、ppt、pdf、图片格式文件'
      }
      const imageRe = /\.(jpg|jpeg|png|GIF|BMP)/

      if (regx.test(fileName)) {
        if (imageRe.test(fileName)) {
          if (file.size / 1024 / 1024 > 5) tips = '图片大小不能超过5M'
        } else {
          if (file.size / 1024 / 1024 > 10) tips = '文件大小不能超过10M'
        }
      } else {
        setTimeout(() => {
          this.$message.error(err)
        }, 200)
        return false
      }
      if (tips) {
        setTimeout(() => {
          this.$message.error(tips)
        }, 200)
        return false
      }
    },

    onUploadProgress({ percent, uid }) {
      const index = this.progressList.findIndex((item) => item.uid === uid)
      if (index === -1) {
        if (percent === 100) return
        this.progressList.push({
          percent,
          uid
        })
      } else {
        this.progressList[index].percent = percent
        if (percent === 100) this.progressList.splice(index, 1)
      }
    },
    // 删除上传文件
    deleteUpload(data) {
      let index = _.findIndex(this.formData.attachments, (item) => {
        return item.uid === data.uid
      })
      this.formData.attachments.splice(index, 1)
    }
  }
}
</script>

<style scoped lang="scss">
.outsideTraining .container {
  padding: 30px 65px 0;
}
.outsideTraining .applicant-information {
  padding: 0 0 33px 0;
}
.outsideTraining .title {
  color: #000b15;
  opacity: 0.85;
  font-size: 16px;
  font-weight: bold;
  padding-bottom: 18px;
  border-bottom: 1px solid #ccc;
}
.outsideTraining .applicant-information .name {
  color: #000b15;
  opacity: 0.45;
}

.outsideTraining .applicant-information /deep/ .el-col {
  margin-bottom: 9px;
}
.outsideTraining .application-information {
  padding: 0 0 33px 0;
}

.outsideTraining .application-information /deep/ .el-form-item {
  margin-bottom: 7px;
}

.project-information .name {
  color: #000b15;
  opacity: 0.45;
}
.project-information /deep/ .el-col {
  margin-bottom: 9px;
}
.submit-btn {
  text-align: center;
}
.submit-btn .el-button--primary {
  background-color: #2875d4;
  border-color: #2875d4;
  margin-top: 9px;
}
.attachment-upload {
  padding-top: 40px;
  span:first-child {
    font-size: 16px;
    color: rgba(0, 11, 21, 0.85);
    line-height: 24px;
    font-weight: 600;
  }
  span:last-child {
    font-size: 12px;
    color: rgba(0, 11, 21, 0.45);
    line-height: 18px;
    margin-left: 16px;
  }
}
::v-deep .el-upload-dragger {
  width: 380px;
  height: 184px;
  padding: 48px 70px 40px;
}
.upload {
  display: flex;
  flex-direction: column;
  i {
    font-size: 23px;
  }
  div:first-of-type {
    font-size: 14px;
    color: rgba(0, 11, 21, 0.85);
    letter-spacing: 0;
    font-weight: 400;
    margin: 14px 0 8px;
  }
  div:last-of-type {
    font-size: 12px;
    color: rgba(0, 11, 21, 0.45);
    letter-spacing: 0;
    text-align: center;
    line-height: 18px;
    font-weight: 400;
  }
}
.uploader-ul {
  padding-top: 16px;
}
.uploader-li {
  background: #ffffff;
  border: 1px solid #d9dbdc;
  border-radius: 4px;
  width: 380px;
  height: 64px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  img {
    width: 48px;
    height: 48px;
    margin-right: 10px;
  }
  .el-icon-close {
    flex: 1;
    text-align: right;
  }
  .icon {
    flex-shrink: 0;
    width: 2em;
    height: 2em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
    margin-right: 10px;
  }
}
::v-deep .el-progress-bar__outer {
  width: 380px;
}
</style>
