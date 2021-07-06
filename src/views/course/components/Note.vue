<template>
  <div class="note">
    <div v-if="showAdd" class="add">
      <el-input
        v-model="addnote"
        type="textarea"
        placeholder="记录你的想法吧～"
        maxlength="200"
        show-word-limit
        resize="none"
        :rows="5"
      ></el-input>

      <div class="addBtn">
        <el-button type="primary" size="mini" @click="submitNote">
          保存
        </el-button>
      </div>
    </div>

    <ul>
      <li v-for="(item, index) in listData" :key="index">
        <div v-show="showEdit !== index" class="list">
          <div class="info">
            <div class="user_info">
              <span class="img">
                <img :src="info.avatarUrl" alt="" />
              </span>

              <span class="name"> {{ info.name }} </span>
            </div>

            <div class="time">
              {{ item.createTime }}
            </div>
          </div>

          <div class="content">
            <div class="text">
              {{ item.remark }}
            </div>
          </div>

          <div class="btns">
            <div
              class="toLearn"
              :style="`border: 1px solid ${setColor(item)};color: ${setColor(item)};`"
            >
              <i class="el-icon-video-play"></i>
              <span @click="tolearn(item)">{{ setType(item) || '去播放' }}</span>
            </div>
            <div class="edit">
              <span @click="editBtn(index)"> <i class="el-icon-edit"></i> 编辑</span>
              <span @click="delBtn(item)"> <i class="el-icon-delete"></i> 删除</span>
            </div>
          </div>
        </div>
        <div v-show="showEdit === index" class="editNote">
          <el-input
            v-model="item.remark"
            type="textarea"
            placeholder="记录你的想法吧～"
            maxlength="200"
            show-word-limit
            resize="none"
            :rows="5"
          ></el-input>

          <div class="editNote_btn">
            <el-button size="mini" @click="showEdit = ''">取消</el-button>
            <el-button size="mini" type="primary" @click="preservationBtn(item)">保存</el-button>
          </div>
        </div>
      </li>
    </ul>

    <div v-if="pageConfig.total" class="page">
      <el-pagination
        :current-page="pageConfig.pageNo"
        :page-sizes="pageConfig.sizes"
        :page-size="pageConfig.pageSize"
        layout="total, sizes, prev, pager, next"
        :total="pageConfig.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>

    <div v-else style="text-align: center">
      <img src="../../../assets/images/nodata.png" style="max-width: 100%;" />
      <div>暂无数据</div>
    </div>
  </div>
</template>

<script>
import {
  getCourseNotesListPC,
  saveCourseNotePC,
  editCourseNote,
  deleteCourseNote
} from '@/api/course'
import { getuserInfo } from '@/api/my'
export default {
  //showAdd是否显示顶部输入框
  //currentChapter 记录笔记时，播发页面
  props: ['showAdd', 'currentChapter'],
  data() {
    return {
      listData: [],
      info: {},
      pageConfig: {
        sizes: [10, 20, 50, 100],
        pageSize: 10,
        pageNo: 1,
        total: 0
      },
      showEdit: '',
      addnote: '',
      note: '',
      current: '',
      noteType: ['看文章', '看文档', '看资料', '看作业', '看视频'],
      noteColor: ['#00B061', '#FC7C01', '#FF4329', '#FCBA00', '#00B061']
    }
  },
  watch: {
    currentChapter: function(newVal) {
      this.current = newVal
    }
  },

  created() {
    this.initData()
  },
  activated() {
    this.initData()
  },

  methods: {
    setType(item) {
      return this.noteType[item.contentType - 1]
    },
    setColor(item) {
      return this.noteColor[item.contentType - 1]
    },
    tolearn(item) {
      console.log(item)
      this.$router.push({
        path: '/course/learn',
        query: {
          courseId: this.$route.query.id || this.$route.query.courseId,
          chapterId: item.contentId,
          seat: Math.ceil(Math.random() * 1000)
        }
      })
    },
    // 获取数据
    async initData() {
      let params = {
        courseId: this.$route.query.id || this.$route.query.courseId, //课程id
        pageNo: this.pageConfig.pageNo, // 页码
        pageSize: this.pageConfig.pageSize // 页面数
      }
      let { data, totalNum } = await getCourseNotesListPC(params)
      this.listData = data
      this.pageConfig.total = totalNum
      // this.pageConfig.pageNo = totalPage
      this.$emit('totalNum', totalNum)
      // 头像名字
      this.info = await getuserInfo()
    },
    //   新增
    submitNote() {
      // 输入内容非空判断
      if (this.addnote.trim()) {
        let params = {
          courseId: this.$route.query.courseId,
          remark: this.addnote,
          contentId: this.current.contentId
        }
        // 判断当前有没有播发课件
        if (params.contentId) {
          saveCourseNotePC(params).then(() => {
            this.$message({
              message: '新增成功',
              type: 'success'
            })
            this.initData()
            this.addnote = ''
          })
        } else {
          this.$message({ message: '当前有没有播放课件哦!' })
        }
      } else {
        this.$message({ message: '内容不能为空!' })
      }
    },
    // 保存
    preservationBtn(item) {
      let params = {
        id: item.id,
        remark: item.remark
      }
      editCourseNote(params).then(() => {
        this.showEdit = ''
        this.initData()
        this.$message({
          message: '保存成功',
          type: 'success'
        })
      })
    },
    // 删除
    delBtn(item) {
      this.$confirm('确定要删除该笔记吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteCourseNote({ id: item.id }).then(() => {
            this.initData()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 编辑
    editBtn(i) {
      this.showEdit = i
    },
    handleSizeChange(val) {
      this.pageConfig.pageSize = val
      this.initData()
    },
    handleCurrentChange(val) {
      this.pageConfig.pageNo = val
      this.initData()
    }
  }
}
</script>

<style lang="scss" scoped>
.note {
  width: 100%;
  li {
    border-top: 1px solid #ebeced;
    padding: 24px 0;

    &:nth-child(1) {
      border: none;
    }
    .info {
      display: flex;
      justify-content: space-between;
      .user_info {
        display: flex;
        .name {
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: rgba(0, 11, 21, 0.45);
          letter-spacing: 0;
          line-height: 22px;
        }
        .img {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          overflow: hidden;
          margin-right: 8px;
          background-color: #ccc;
          img {
            width: 24px;
            height: 24px;
          }
        }
      }

      .time {
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: rgba(0, 11, 21, 0.45);
        line-height: 22px;
        width: 118px;
        text-align: right;
      }
    }

    .content {
      display: flex;
      justify-content: space-between;
      margin-top: 8px;
      .text {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: rgba(0, 11, 21, 0.85);
        letter-spacing: 0;
        line-height: 22px;
        word-break: break-all;
      }
    }

    .btns {
      margin-top: 18px;
      display: flex;
      justify-content: space-between;
      .toLearn {
        width: 65px;
        height: 20px;
        line-height: 18px;
        border: 1px solid #00b061;
        color: #00b061;
        border-radius: 9px;
        display: flex;
        display: flex;
        cursor: pointer;
        justify-content: center;
        span {
          font-family: PingFangSC-Regular;
          font-size: 12px;
          letter-spacing: 0;
          text-align: right;
          margin-left: 2px;
        }
        i {
          margin-top: 2px;
        }
      }
      .edit {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: rgba(0, 11, 21, 0.65);
        line-height: 22px;
        span {
          margin-left: 18px;
          cursor: pointer;
        }
      }
    }
  }
  .page {
    margin-top: 10px;
    text-align: right;
  }

  .editNote {
    .editNote_btn {
      margin-top: 8px;
      padding-right: 20px;
      text-align: right;
    }
  }
  .add {
    .addBtn {
      margin-top: 8px;
      text-align: right;
      //   .el-pagination {
      //     transform: scale(0.5);
      //   }
    }
  }
}
</style>
