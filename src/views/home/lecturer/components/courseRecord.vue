<template>
  <div>
    <div v-if="!_.isEmpty(recordList)" class="content__box">
      <ul class="course__ul">
        <li v-for="item in recordList" :key="item.id" class="course__li" @click="toDetail(item)">
          <el-image
            v-if="_.get(item, 'coverUrl', '')"
            class="logo__img"
            :src="item.coverUrl"
            fit="cover"
          >
            <div slot="error" class="image__slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
          <div class="li__main">
            <div ref="liTitle" class="li__title ">
              {{ _.get(item, 'courseName', '') }}
            </div>
            <div class="li__name">
              <span class="name">
                <span>讲师：</span>
                <span>{{ _.get(item, 'teacherName', '') }}</span>
              </span>
              <span>
                <span>学习人数：</span>
                <span>{{ item.studyNums ? `${item.studyNums}人` : '--' }}</span>
              </span>
            </div>
            <div class="li__bottom">
              <el-rate v-if="_.get(item, 'score', 4)" v-model="item.score" />
              <el-tag v-if="!_.isEmpty(_.get(item, 'tags'))">{{ _.get(item, 'tags[0]') }}</el-tag>
            </div>
          </div>
        </li>
      </ul>
      <el-pagination
        class="pagination-box"
        :page-sizes="[12, 24, 36, 48]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
    <common-empty v-else />
  </div>
</template>
<script>
import { queryTeachCourseInfo } from '@/api/home'
import CommonEmpty from '@/components/common-empty/Empty'
export default {
  name: 'CourseRecord',
  components: {
    CommonEmpty
  },
  data() {
    return {
      totalNum: 0,
      queryInfo: {
        pageSize: 12,
        pageNo: 1,
        userId: ''
      },
      recordList: []
    }
  },
  computed: {
    userId() {
      return _.get(this.$route, 'query.userId', '1354960246551986178')
    }
  },
  activated() {
    this.loadData()
  },
  methods: {
    handleSizeChange(val) {
      this.queryInfo.pageSize = val
      this.loadData()
    },
    handleCurrentChange(val) {
      this.queryInfo.pageNo = val
      this.loadData()
    },
    loadData() {
      this.queryInfo.userId = this.userId
      queryTeachCourseInfo(this.queryInfo).then((res) => {
        const { data, totalNum } = res
        this.recordList = data
        this.totalNum = totalNum
      })
    },
    toDetail(data) {
      //  jumpType，1-课程中心，2-培训，3-必修课
      const PATH_MAP = {
        1: '/course/detail',
        2: '/course/detail',
        3: '/requiredCourseDetail'
      }
      this.$router.push({ path: PATH_MAP[data.jumpType], query: { id: data.id } })
    }
  }
}
</script>
<style scoped lang="scss">
/deep/ mark {
  color: #1677ff;
  background: transparent;
}
.content__box {
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .course__ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    flex-direction: row;
    padding-bottom: 10px;
    &::after {
      content: '';
      flex: auto;
    }
    .course__li {
      width: calc((100% - 60px) / 4);
      border-radius: 0 0 4px 4px;
      margin-bottom: 20px;
      margin-right: 20px;
      box-shadow: 0 2px 12px 0 rgba(0, 61, 112, 0.3);
      background: #ffffff;
      display: flex;
      align-items: center;
      flex-direction: column;
      cursor: pointer;
      &:nth-child(4n + 4) {
        margin-right: 0;
      }
      &:hover {
        box-shadow: 0 2px 14px 0 rgba(0, 61, 112, 0.4);
      }
      .logo__img {
        width: 100%;
        height: 166px;
        border-radius: 4px 4px 0 0;
        margin-bottom: 16px;
      }
      .li__main {
        padding: 0px 16px 16px;
        width: 100%;
        .li__title {
          font-family: PingFangSC-Medium;
          font-size: 14px;
          color: #000b15;
          font-weight: 550;
          margin-bottom: 8px;
          width: 100%;
          text-align: left;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .li__name {
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: rgba(#000b15, 0.45);
          margin-bottom: 12px;
          .name {
            margin-right: 16px;
          }
          .iconfont {
            font-size: 10px;
            margin-right: 4px;
          }
        }
        .li__bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      }
    }
  }
  .pagination-box {
    align-self: flex-end;
  }
}
</style>
