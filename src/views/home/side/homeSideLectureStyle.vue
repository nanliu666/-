<template>
  <div class="lecture__style__container">
    <el-card>
      <div class="lecture__title">
        <span class="title__left">讲师风采</span>
        <span class="title__right" @click="toLecture">
          <span class="more__text">更多</span>
        </span>
      </div>
      <ul class="lecture__ul">
        <li
          v-for="(item, index) in lectureList"
          :key="index"
          class="lecture__li"
          @click="toLecturer(item)"
        >
          <div class="li__container">
            <el-image class="content__image" :src="item.fileUrl">
              <div slot="error">
                <el-image
                  style="width: 40px; height: 40px"
                  :src="require('../../../../public/img/teacher.png')"
                />
              </div>
            </el-image>
            <div class="li__content">
              <div class="li__title">{{ item.teacherName }}</div>
              <div class="content__text">
                {{
                  item.introduction && _.trim(item.introduction)
                    ? deleteHTMLTag(_.unescape(item.introduction))
                    : '--'
                }}
              </div>
            </div>
          </div>
        </li>
      </ul>
    </el-card>
  </div>
</template>
<script>
import { queryTeacherMienList } from '@/api/home'
import { deleteHTMLTag } from '@/util/util'
export default {
  name: 'HomeSideLectureStyle',
  data() {
    return {
      lectureList: []
    }
  },
  created() {
    this.initData()
  },
  methods: {
    deleteHTMLTag,
    toLecture() {
      this.$router.push({ path: '/lecturer/list' })
    },
    initData() {
      queryTeacherMienList({ pageNo: 1, pageSize: 5, type: 1 }).then((res) => {
        const { data } = res
        this.lectureList = data
      })
    },
    toLecturer(data) {
      this.$router.push({
        path: '/lecturer/detail',
        query: { id: data.idStr, userId: data.userId }
      })
    }
  }
}
</script>
<style scoped lang="scss">
.lecture__style__container {
  margin-top: 20px;
  .lecture__title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 24px;
    .title__left {
      font-family: PingFangSC-Semibold;
      font-size: 16px;
      color: rgba(0, 11, 21, 0.85);
      line-height: 24px;
      font-weight: 600;
    }
    .title__right {
      cursor: pointer;
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: rgba(0, 11, 21, 0.45);
      line-height: 18px;
      font-weight: 400;
      .more__text {
      }
    }
  }
  .lecture__ul {
    .lecture__li {
      margin-bottom: 24px;
      cursor: pointer;
      .li__container {
        display: flex;
        .content__image {
          width: 40px;
          height: 40px;
          margin-right: 10px;
          border-radius: 100%;
          overflow: hidden;
          .error__image {
            width: 100%;
            height: 100%;
            background-color: #8c9195;
          }
        }
        .li__content {
          display: flex;
          justify-content: flex-start;
          flex-direction: column;
          flex: 1;
          .li__title {
            width: 100%;
            margin-bottom: 4px;
            font-size: 14px;
            text-align: left;
            color: rgba(0, 11, 21, 0.85);
            font-weight: 500;
            display: -webkit-box;
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
          }
          .content__text {
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: rgba(0, 11, 21, 0.45);
            line-height: 20px;
            font-weight: 400;
            text-align: left;
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
</style>
