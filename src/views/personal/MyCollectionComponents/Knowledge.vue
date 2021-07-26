<template>
  <div class="Train">
    <ul>
      <li v-for="(item, index) in list" :key="index"  :class="{'active':item.id===currentData.id}" @mouseenter="showCancelCollection(item)" @mouseleave="closeCancelCollection(item)">
      
        <div class="row">
           <div class="title line-clamp1 ">
            {{item.resName}}
          </div>
          <div>
            <span>{{item.providerName}} </span>
            <span>{{item.createTime | time}} </span>
          </div>
          
        </div>

        <div class="score">
          <div class="score-r">
            <el-rate
              v-model="item.scope"
              disabled
              show-score
              text-color="#666"
              score-template="{value}"
            >
            </el-rate>
            分
          </div>
          <div class="tag line-clamp1" v-if="item.knowledgeSystemName">
            {{item.knowledgeSystemName}}
          </div>
        </div>

        <div class="cancelcollection" @click="handleView(item)" v-if="item.id===currentData.id">
          <span class="star" @click.stop="cancelCollection(item)">
            <i class="iconfont iconoperating_ic_favorites"> </i>
          </span>
        </div>
      </li>
    </ul>
    <div v-if="list.length<=0">
        <div  style="text-align: center">
          <img src="../../../assets/images/nodata.png" />
          <div class="btn" @click="goList">去收藏</div>
        </div>
      </div>
    <div class="page" v-else>
      <el-pagination
        :current-page="page.pageNo"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {getCollectionList,addCollection} from '@/api/knowledge'
export default {
  data() {
    return {
      list: [],
      currentData:{},
      totalNum: 0,
      page: {
        pageSize: 10,
        pageNo: 1
      }
    }
  },
  filters:{
    time(val){
      return val.replace(/-/g,'/')
    }
  },
  mounted(){
    this.getList()
  },
  methods: {
    goList(){
      this.$router.push({ path: '/knowledge/list'})
    },
    handleView(row) {
      if(row.invalid){
        this.$message({
          type:'info',
          message:'当前知识库已失效'
        })
        return
      }
      this.$router.push({ name: 'KnowledgeDetail', query: { id: row.id } })
    },
    sollection(obj){
      addCollection({
            knowledgeId:obj.id
          }).then(res=>{
              this.$message({
                type: 'success',
                message: '取消收藏成功!'
              })
              this.getList()
          })
    },
    cancelCollection(obj) {
      this.$confirm('确定要取消收藏该知识库吗？?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(res => {
          if(res==='confirm'){
            this.sollection(obj)
          }
        })
    },
    showCancelCollection(obj){
      this.currentData = obj
    },
    closeCancelCollection(){
      this.currentData = ''
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.page.pageNo = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.page.pageNo = val
      this.getList()
    },
    getList(){
      getCollectionList({
        ...this.page
      }).then(res=>{
        this.list =  res.data
        this.totalNum = res.totalNum
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.Train {
  ul {
    display: flex;
    flex-wrap: wrap;
    li {
      width: 437px;
      margin-right: 20px;
      margin-top: 20px;
      background-color: #fff;
      border-radius: 4px;
      box-shadow: 0 2px 8px 0 rgba(0, 63, 161, 0.06);
      &:nth-child(2n) {
        margin-right: 0;
      }
       /* 一行否则出现省略号 */
      .line-clamp1 {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        word-break: break-all;
      }
      .title {
        font-size: 16px;
        color: rgba(0,11,21,0.85);
        font-weight: bold;
        padding-top: 24px;
        margin-bottom: 8px;
      }
      .row {
        font-size: 12px;
        color: rgba(0,11,21,0.45);
        letter-spacing: 0;
        line-height: 18px;
        padding: 0 24px 24px;
        span {
          margin-right: 15px;
        }
      }

      .score {
        border-top: 1px solid rgba(0,11,21,0.08);
        padding: 17px 24px;
        display: flex;
        justify-content: space-between;
        color: rgba(0,11,21,0.45);
        .score-r {
          display: flex;
          font-size: 12px;
        }
      }
      .tag{
        font-size: 12px;
          color: #878C90;
          text-align: center;
          padding: 1px 8px;
          background: #F5F5F6;
          border-radius: 4px;
          width: 90px;
      }
      &.active{
        position: relative;
        .cancelcollection{
           position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,11,21,0.45);
            border-radius: 4px;
            display: flex;
            justify-content: center;
            align-items: center;
            .star{
              cursor: pointer;
              background: #FFFFFF;
              width: 44px;
              height: 44px;
              border-radius: 50%;
              padding-top: 8px;
              display: inline-block;
              text-align: center;
              .iconfont{
                font-size: 30px;
                color: #8C9195;
              }
            }
        }
      }
    }
  }
  .btn{
        width: 100px;
        height: 40px;
        line-height: 40px;
        border-radius: 20px;
        color: #2875D4;
        border: 1px solid #2875D4;
        margin: auto;
        cursor: pointer;
    }
  .page {
    margin-top: 24px;
    text-align: right;
  }
}
</style>
