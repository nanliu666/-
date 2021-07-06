<template>
  <div class="lecturer__list">
    <common-breadcrumb :route-list="routeList" />
    <div class="list__top">
      <el-card>
        <div class="top__card">
          <div class="input__box">
            <el-input
              v-model="queryInfo.teacherName"
              class="top__search"
              placeholder="查找讲师"
              suffix-icon="el-icon-search"
              @input="searchFun"
            />
          </div>
          <el-divider />
          <div class="tabs__box">
            <li
              v-for="(item, index) in navList"
              :key="index"
              class="tabs__li"
              :class="{ active__li: item.value === queryInfo.type }"
              @click="changeLi(item)"
            >
              {{ item.key }}
            </li>
          </div>
        </div>
      </el-card>
    </div>
    <ul v-if="!_.isEmpty(lecturerList)" class="list__bottom">
      <li
        v-for="(item, index) in lecturerList"
        :key="index"
        class="bottom__li"
        @click="toDetail(item)"
      >
        <el-card shadow="hover" class="card">
          <div class="card__content">
            <el-image class="card__image" :src="item.fileUrl">
              <div slot="error">
                <el-image :src="require('../../../../public/img/teacher.png')" />
              </div>
            </el-image>
            <div class="boottm__content">
              <com-content :data="item" type="list" />
              <div class="introduction__class">
                <span class="label">介绍：</span>
                <span class="value">
                  {{ deleteHTMLTag(_.unescape(item.introduction)) }}
                </span>
              </div>
            </div>
          </div>
        </el-card>
      </li>
    </ul>
    <common-empty v-else />
    <el-pagination
      class="pagination__class"
      :current-page="queryInfo.pageNo"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="queryInfo.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalPagesize"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
  </div>
</template>
<script>
import { deleteHTMLTag } from '@/util/util'
import CommonEmpty from '@/components/common-empty/Empty'
import CommonBreadcrumb from '@/components/common-breadcrumb/Breadcrumb'
import ComContent from './components/comContent'
import { queryTeacherMienList } from '@/api/home'
export default {
  name: 'LectureList',
  components: {
    CommonBreadcrumb,
    ComContent,
    CommonEmpty
  },
  data() {
    return {
      navList: [
        { key: '推荐', value: '1' },
        { key: '最新', value: '3' },
        { key: '评分最高', value: '2' }
      ],
      totalPagesize: 0,
      lecturerList: [],
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
      queryInfo: {
        pageNo: 1,
        pageSize: 10,
        teacherName: '',
        type: '1'
      }
    }
  },
  activated() {
    this.loadData()
  },
  methods: {
    searchFun: _.debounce(function() {
      this.loadData()
    }, 500),
    deleteHTMLTag,
    changeLi(data) {
      this.queryInfo.type = data.value
      this.loadData()
    },
    toDetail(data) {
      this.$router.push({
        path: '/lecturer/detail',
        query: { id: data.idStr, userId: data.userId }
      })
    },
    handleSizeChange(val) {
      this.queryInfo.pageSize = val
      this.loadData()
    },
    handleCurrentChange(val) {
      this.queryInfo.pageNo = val
      this.loadData()
    },
    handleClick() {
      this.queryInfo.pageNo = 1
      this.loadData()
    },
    loadData() {
      queryTeacherMienList(this.queryInfo).then((res) => {
        const { data, totalNum } = res
        this.totalPagesize = totalNum
        this.lecturerList = data
      })
    }
  }
}
</script>
<style scoped lang="scss">
/deep/ .el-divider--horizontal {
  margin: 16px 24px !important;
  width: calc(100% - 48px);
  background: #EBECED;
}
.lecturer__list {
  .list__top {
    margin-bottom: 20px;
    /deep/ .el-card__body {
      padding: 0;
    }
    .top__card {
      .input__box {
        padding: 24px 0 0 24px;
      }
      .top__search {
        width: 380px;
      }
      .tabs__box {
        padding: 0px 0 0px 24px;
        display: flex;
        .tabs__li {
          cursor: pointer;
          font-family: PingFangSC-Regular;
          font-size: 16px;
          color: rgba(0, 11, 21, 0.65);
          margin-right: 36px;
          padding-bottom: 14px;
          font-weight: 500;
        }
        .active__li {
          color: #2875d4;
          position: relative;
          &::before {
            content: '';
            height: 2px;
            width: 100%;
            background-color: #2875d4;
            position: absolute;
            left: 0;
            bottom: 0;
          }
        }
      }
    }
  }
  .list__bottom {
    .bottom__li {
      cursor: pointer;
      margin-bottom: 20px;
      .card{
        border: none;
        box-shadow: 0 2px 8px 0 rgba(0,61,112,0.06);
      .card__content {
        display: flex;
        justify-content: flex-start;
        .card__image {
          width: 120px;
          height: 120px;
          border-radius: 100%;
          overflow: hidden;
        }
        .boottm__content {
          width: calc(100% - 126px);
          padding-left: 24px;
          overflow: auto;
          .introduction__class {
            margin-top: 8px;
            display: flex;
            .label {
              width: 50px;
              font-family: PingFangSC-Medium;
              font-size: 14px;
              color: rgba(0, 11, 21, 0.45);
            }
            .value {
              width: calc(100% - 50px);
              overflow: hidden;
              display: -webkit-box; //将元素设为盒子伸缩模型显示
              -webkit-box-orient: vertical; //伸缩方向设为垂直方向
              -webkit-line-clamp: 2; //超出3行隐藏，并显示省略号
            }
          }
        }
      }
      }
    }
  }
  .pagination__class {
    margin-top: 20px;
    float: right;
  }
}
</style>
