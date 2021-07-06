<template>
  <div class="MyShare">
    <ul class="list">
      <li class="top_share" @click="toEdit">
        <div>
          <i class="el-icon-share"></i>
          <span>一点分享</span>
        </div>
      </li>
      <li v-for="(item, index) in listData" :key="index" @click="toDetail(item)">
        <div class="top_box">
          <div class="title">
            {{ item.resName }}
          </div>
          <div class="name">
            <span>{{ item.providerName }}</span>
            <span> {{ item.createTime }} </span>
          </div>
        </div>
        <div class="botton_box">
          <span class="rate_box">
            <el-rate
              :value="toNumFn(item.scope)"
              disabled
              show-score
              text-color="#b8bbbe"
              score-template="{value}"
            >
            </el-rate>
            <span>分</span>
          </span>
          <span class="text"> {{ item.knowledgeSystemFullName }} </span>
        </div>

        <div class="dialog_box">
          <div>
            <span v-if="showDel(item)" class="el-icon-delete" @click="deleteItem(item)"></span>
            <span v-if="showEdit(item)" class="el-icon-edit-outline" @click="editItem(item)"></span>
          </div>
        </div>
      </li>
    </ul>
    <div class="pagination_box">
      <el-pagination
        :page-sizes="[10, 20, 30, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { myShareList, knowledgeDelete, getApprInfo } from '@/api/personal'
export default {
  data() {
    return {
      rateValue: 4.9,
      total: 0,
      page: {
        pageNo: 1, //请求页码
        pageSize: 10 //每页条数
      },
      listData: []
    }
  },
  computed: {
    showDel() {
      return (data) => {
        if (data.approveStatus == 0 && data.apprNum != 0) return false
        else if (data.approveStatus == 1) return false
        else return true
      }
    },
    showEdit() {
      return (data) => {
        if (data.approveStatus == 0) return false
        else if (data.approveStatus == 1) return false
        else return true
      }
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    // 去分享
    toEdit() {
      this.$router.push({ path: '/knowledge/list' })
    },
    toDetail(item) {
      // 先调一下接口，实时判断审批状态
      getApprInfo({ bizId: item.id, formKey: 'applyKnowledgeShare' }).then((res) => {
        if (JSON.stringify(res) == '{}' || res.status === 'Pass') {
          // 如果是后台创建的，不走审批流res就是空数据     或者Pass已通过
          this.$router.push({ path: '/knowledge/detail', query: { id: item.id } })
        } else if (res.apprNo) {
          // 已拒绝/已撤回/审核中，点击整个卡片，跳转审批中心【我发起的-详情】页面
          this.$router.push({
            path: '/approvalCenter/details',
            query: { apprNo: res.apprNo, key: 'applyKnowledgeShare' }
          })
        }
      })
    },
    // 删除
    deleteItem(item) {
      console.log(item.id)

      this.$confirm('确定要删除该资源吗？', '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.delFn(item)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    delFn(item) {
      knowledgeDelete({ id: item.id }).then(() => {
        this.getData()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
    },
    // 编辑
    editItem(item) {
      this.$router.push({ name: 'share', query: { id: item.id } })
    },
    toNumFn(i) {
      return parseFloat(i) || 0
    },
    async getData() {
      let { data, totalNum } = await myShareList(this.page)
      this.listData = data
      this.total = totalNum
    },
    handleSizeChange(val) {
      this.page.pageNo = 1
      this.page.pageSize = val
      this.getData()
    },
    handleCurrentChange(val) {
      this.page.pageNo = val
      this.getData()
    }
  }
}
</script>

<style lang="scss" scoped>
.MyShare {
  margin-bottom: -77px;
  .list {
    display: flex;
    flex-wrap: wrap;

    li {
      width: 437px;
      height: 167px;
      background: #ffffff;
      box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);

      border-radius: 4px;
      margin-top: 20px;
      transition-duration: 0.3s;

      &:nth-child(-n + 1) {
        margin-top: 0;
      }
      &:nth-child(-n + 2) {
        margin-top: 0;
      }
      &:nth-child(2n) {
        margin-left: 20px;
      }
      position: relative;
      .dialog_box {
        opacity: 0;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        right: 0;
        background: rgba(0, 11, 21, 0.45);
        border-radius: 4px;
        display: flex;
        justify-content: space-evenly;
        padding-top: 61px;
        div {
          width: 112px;
          display: flex;
          justify-content: space-between;
          span {
            cursor: pointer;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background-color: #fff;
            line-height: 44px;
            text-align: center;
            color: #8c9195;
            font-size: 16px;
          }
        }
      }
      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 9px 12px 0 rgba(0, 63, 161, 0.12);
        .card-cover {
          visibility: visible !important;
        }
        .dialog_box {
          opacity: 1;
        }
      }

      .top_box {
        padding: 32px;
        .title {
          font-family: PingFangSC-Medium;
          font-size: 14px;
          color: rgba(0, 11, 21, 0.85);
          font-weight: 500;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
          word-break: break-all;
        }
        .name {
          margin-top: 8px;
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: rgba(0, 11, 21, 0.45);
          letter-spacing: 0.43px;
          font-weight: 400;
        }
      }
      .botton_box {
        border-top: 1px solid rgba(0, 11, 21, 0.08);
        display: flex;
        justify-content: space-between;
        padding: 16px;
        .rate_box {
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: rgba(0, 11, 21, 0.45);
          letter-spacing: 0;
          font-weight: 400;
          display: flex;
          line-height: 20px;
        }
        .text {
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: #868b90;
          text-align: center;
          line-height: 18px;
          font-weight: 400;
          background: #f5f5f6;
          border-radius: 4px;
          padding: 2px 5px;
        }
      }
    }

    .top_share {
      border: 1px dashed #2875d4;
      cursor: pointer;
      div {
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #2875d4;
        letter-spacing: 0;
        font-weight: 500;
        margin: 76px auto;
        text-align: center;
        span {
          padding: 0 5px;
        }
      }
    }
  }
  .pagination_box {
    padding: 24px 0;
    text-align: right;
  }
}
</style>
