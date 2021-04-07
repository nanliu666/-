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
      <li v-for="(item, index) in 10" :key="index">
        <div v-show="showEdit !== index" class="list">
          <div class="info">
            <div class="user_info">
              <span class="img">
                <img :src="url" alt="" />
              </span>

              <span class="name"> 大帅逼 </span>
            </div>

            <div class="time">
              2021/4/7 3:40:48
            </div>
          </div>

          <div class="content">
            <div class="text">
              {{ note }}
            </div>
          </div>

          <div class="btns">
            <div class="toLearn">
              <i class="el-icon-video-play"></i>
              <span>看文章</span>
            </div>
            <div class="edit">
              <span @click="editBtn(index)"> <i class="el-icon-edit"></i> 编辑</span>
              <span @click="delBtn"> <i class="el-icon-delete"></i> 删除</span>
            </div>
          </div>
        </div>
        <div v-show="showEdit === index" class="editNote">
          <el-input
            v-model="note"
            type="textarea"
            placeholder="记录你的想法吧～"
            maxlength="200"
            show-word-limit
            resize="none"
            :rows="5"
          ></el-input>

          <div class="editNote_btn">
            <el-button size="mini" @click="showEdit = ''">取消</el-button>
            <el-button size="mini" type="primary" @click="preservationBtn">保存</el-button>
          </div>
        </div>
      </li>
    </ul>

    <div class="page">
      <el-pagination
        :current-page="pageConfig.pageNo"
        :page-sizes="pageConfig.sizes"
        :page-size="pageConfig.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageConfig.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  //showAdd是否显示顶部输入框
  //currentChapter 记录笔记时，播发页面
  props: ['showAdd', 'currentChapter'],
  data() {
    return {
      url:
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.wxcha.com%2Ffile%2F201704%2F27%2F21ae080743.jpg&refer=http%3A%2F%2Fimg.wxcha.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620372842&t=53936a2266d2d9cada1e789f44864618',
      pageConfig: {
        sizes: [10, 20, 50, 100],
        pageSize: 20,
        pageNo: 1,
        total: 0
      },
      note: '1111txtxxxxxxx啥也不是txtxxxxxxx啥也不是txtxxxxxxx啥也不是txtxxxxxxx啥也不是txtxxxxxxx啥也不是txtxxxxxxx啥也不是txtxxxxxxx啥也不是txtxxxxxxx啥也不是txtxxxxxxx啥也不是txtxxxxxxx啥也不是',
      showEdit: '',
      addnote: ''
    }
  },
  watch: {
    currentChapter: (newVal) => {
      console.log(newVal)
    }
  },
  created() {},
  activated() {},

  methods: {
    //   新增
    submitNote() {
      this.$message({
        message: '新增成功',
        type: 'success'
      })
    },
    // 保存
    preservationBtn() {
      this.showEdit = ''
      this.$message({
        message: '保存成功',
        type: 'success'
      })
    },
    // 删除
    delBtn() {
      this.$confirm('确定要删除该笔记吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
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
    },
    // 获取数据
    initData() {}
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
          img {
            width: 24px;
            height: 24px;
          }
        }
      }

      .time {
        font-family: PingFangSC-Regular;
        font-size: 14px;
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
    text-align: right;
    /deep/ .el-input {
      width: 60px;
    }
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
    }
  }
}
</style>
