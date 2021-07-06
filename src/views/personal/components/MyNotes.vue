<template>
  <div class="MyNotes">
    <ul>
      <li v-for="(item, index) in nodeData" :key="index">
        <div class="item_box">
          <img :src="item.courseCoverUrl" alt="" @click="toCourseDetail(item.courseId)" />
          <div class="title">
            <div @click="toCourseDetail(item.courseId)">{{ item.courseName }}</div>
            <span>共{{ item.noteNum }}条笔记</span>
          </div>
          <div class="btn">
            <el-button type="text" @click="openFn(index)">
              {{ ` ${item.Btn ? '收起' : '展开'}笔记` }}
              <i v-if="item.Btn" class="el-icon-arrow-down"></i>
              <i v-else class="el-icon-arrow-up"></i>
            </el-button>
          </div>
        </div>
        <Node v-if="item.Btn" class="node" :course-id="item.courseId"></Node>
      </li>
    </ul>

    <div v-show="nodeData.length" class="page">
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

    <!-- 无数据 -->
    <div v-show="!nodeData.length" class="contentShow">
      <div class="content_box">
        <img src="@/assets/images/my_noData.png" alt="" />
        <div class="text">
          还没有笔记
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Node from './Note'
import { getNoteCourseList } from '@/api/personal'
export default {
  components: { Node },
  data() {
    return {
      imgUrl:
        'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3865120497,1233684244&fm=26&gp=0.jpg',
      showBtn: {
        Btn: false,
        iNum: ''
      },
      total: 100,
      nodeData: [],
      page: {
        pageNo: 1, //请求页码
        pageSize: 10 //每页条数
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    toCourseDetail(id) {
      this.$router.push({ path: '/course/detail', query: { id: id } })
    },

    openFn(i) {
      // this.showBtn.iNum = i
      // this.showBtn.Btn = !this.showBtn.Btn
      this.nodeData[i].Btn = !this.nodeData[i].Btn
    },

    async getData() {
      let { data, totalNum } = await getNoteCourseList({ ...this.page })
      data.forEach((item) => {
        item.Btn = false
      })
      console.log(data)
      this.nodeData = data

      this.total = totalNum
    },

    handleSizeChange(val) {
      this.page.pageSize = val
    },
    handleCurrentChange(val) {
      this.page.pageNo = val
    }
  }
}
</script>

<style lang="scss" scoped>
.MyNotes {
  margin-bottom: -100px;
  width: 100%;
  ul {
    li {
      margin-top: 20px;
      &:nth-child(1) {
        margin-top: 0;
      }
      background-color: #fff;
      box-shadow: 0 2px 8px 0 rgba(0, 63, 161, 0.06);
      padding: 24px;
      .item_box {
        position: relative;
        display: flex;
        img {
          width: 210px;
          height: 118px;
          border-radius: 4px;
          cursor: pointer;
        }
        .title {
          flex: 1;
          padding: 0 16px;
          div {
            font-family: PingFangSC-Medium;
            font-size: 14px;
            color: #000b15;
            line-height: 28px;
            font-weight: 500;
            cursor: pointer;
          }
          span {
            display: block;
            margin-top: 24px;
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: rgba(0, 11, 21, 0.85);
            letter-spacing: 0;
            line-height: 18px;
            font-weight: 400;
          }
        }
        .btn {
          padding-top: 75px;
        }
      }
      .node {
        margin-top: 24px;
      }
    }
  }

  .page {
    position: relative;
    height: 100px;
    .pagination {
      position: absolute;
      top: 24px;
      right: 24px;
    }
  }
  .contentShow {
    background: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.08);
    border-radius: 4px;
    width: 100%;
    height: 500px;
    display: flex;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 100px;
    .content_box {
      width: 338px;
      height: 290px;
      img {
        width: 100%;
        height: 100%;
      }
      .text {
        text-align: center;
        margin-top: 16px;
        font-size: 14px;
        color: rgba(0, 11, 21, 0.65);
        letter-spacing: 0;
      }
    }
  }
}
</style>
