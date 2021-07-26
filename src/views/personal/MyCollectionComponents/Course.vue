<template>
  <div class="Course">
    <ul>
      <li v-for="(item, index) in list" :key="index"  :class="{'active':item.courseId===currentCourse.courseId}" @mouseenter="showCancelCollection(item)" @mouseleave="closeCancelCollection(item)">
        <img  class="img" :src="item.coverUrl || imgUrl" alt="" />
        <div class="title line-clamp1">{{item.courseName}}</div>
        <div class="info line-clamp1">
          <span class="name">讲师： {{item.teacherName}} </span>
          <span class="line"></span>
          <span class="study">  学习人数： {{item.people || 0}}人</span>
        </div>
        <div class="score">
          <el-rate
            v-model="item.scope"
            disabled
            show-score
            text-color="#666"
            score-template="{value}分"
          >
          </el-rate>
         <span class="tag line-clamp1" v-if="item.knowledgeSystemName">{{item.knowledgeSystemName}}</span>
        </div>
        <div class="cancelcollection" @click="handleCourseClick(item)" v-if="item.courseId===currentCourse.courseId">
          <span class="star" @click.stop="Collection(item)">
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
import{getCollectionCourseList,cancelCollectionCourse} from "@/api/course"
export default {
  data() {
    return {
      currentCourse: '',
      imgUrl: require('@/assets/images/required_bg.png'),
      totalNum: 0,
      list:[],
      page: {
        pageSize: 10,
        pageNo: 1
      }
    }
  },
  mounted(){
    this.loadCourseList()
  },
  methods: {
    goList(){
      this.$router.push({ path: '/course/list'})
    },
    handleCourseClick(item) {
      if(!item.canRedirect){
        this.$message({
          type:'info',
          message:'当前课程不支持跳转'
        })
        return
      }
      if(item.invalid){
        this.$message({
          type:'info',
          message:'当前课程已失效'
        })
        return
      }
      this.$router.push({ path: '/course/detail', query: { id: item.courseId } })
    },
    showCancelCollection(obj){
      this.currentCourse = obj
    },
    closeCancelCollection(){
      this.currentCourse = ''
    },
    Collection(obj) {
      this.$confirm('确定要取消收藏该课程吗？?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          cancelCollectionCourse({
            id:obj.collectId
          }).then(res=>{
              this.$message({
                type: 'success',
                message: '取消收藏成功!'
              })
              this.loadCourseList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.loadCourseList()
    },
    handleCurrentChange(val) {
      this.page.pageNo = val
      this.loadCourseList()
    },
    loadCourseList() {
    getCollectionCourseList({
      ...this.page,
      devType:sessionStorage.getItem('role'),
    }).then(({totalNum,data})=>{
      this.list = data
      this.totalNum = totalNum
    })
  }
  },
  
}
</script>

<style lang="scss" scoped>
.Course {
  
  ul {
   display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  width: 100%;
    li {
      width: 285px;
      margin-top: 20px;
      margin-right:20px;
      background-color: #fff;
      box-shadow: 0 2px 8px 0 rgba(0, 63, 161, 0.06);
      border-radius: 4px;
      &:nth-child(3n) {
        margin-right: 0;
      }
      /* 一行否则出现省略号 */
      .line-clamp1 {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
      .img {
        width: 100%;
        border-radius: 4px 4px 0 0;
        height: 166px;
      }
      .title {
        font-size: 14px;
        color: rgba(0,11,21,0.85);
        font-weight: bold;
        margin: 16px 16px 8px 16px;
      }
      .info {
        font-size: 12px;
        color: rgba(0,11,21,0.45);
        padding: 0 16px;
        .line{
          display: inline-block;
          width: 1px;
          height: 10px;
          background: #EBECED;
          margin: 0 8px;
        }
      }
      .score {
        display: flex;
        justify-content: space-between;
        padding: 18px 16px;
        .tag {
          font-size: 12px;
          color: #878C90;
          text-align: center;
          padding: 1px 8px;
          background: #F5F5F6;
          border-radius: 4px;
          width: 90px;
        }
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
