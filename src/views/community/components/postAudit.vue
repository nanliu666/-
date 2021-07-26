<template>
  <div class="postAudit">
    <!-- 筛选 -->
    <div class="screening">
      <el-row
        type="flex"
        :justify="seleteData.length ? 'space-between' : 'end'"
        style="align-items: flex-end"
      >
        <!-- 多选批量操作 -->
        <div v-if="seleteData.length" class="seletion">
          已选中{{ seleteData.length }}项<el-divider direction="vertical"></el-divider
          ><el-button type="text" style="padding: 0" @click="handleThrough(true)"
            >批量通过</el-button
          ><el-button type="text" style="padding: 0" @click="handleRefused(true)"
            >批量拒绝</el-button
          >
        </div>
        <el-date-picker
          v-model="auditTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          size="small"
          @change="changeAuditTime"
        >
        </el-date-picker>
      </el-row>
    </div>
    <!-- 数据表格 -->
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%; margin-top: 20px"
      @select="handlerSeletion"
      @select-all="handlerSeletion"
      ref="mutilTable"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <div class="table-content">
            <el-row>
              <el-col :span="24"
                ><el-row type="flex">
                  <el-col :span="1"><span class="table-content-title">标题:</span></el-col
                  ><el-col
                    ><span class="table-content-title">{{ props.row.title }}</span></el-col
                  ></el-row
                ></el-col
              >
              <el-col :span="24" style="margin-top: -20px"
                ><el-row type="flex" style="align-items: baseline">
                  <el-col :span="1"><span class="table-content-infomation">正文:</span></el-col
                  ><el-col
                    ><span class="table-content-infomation">{{ props.row.content }}</span></el-col
                  ></el-row
                ></el-col
              >
              <el-col>
                <el-row :gutter="20">
                  <el-col>
                    <div v-if="props.row.imgUrl" class="previewPicture">
                      <img
                        v-for="(src, index) in props.row.imgUrl.split(',').slice(0, 3)"
                        :key="index"
                        :src="src"
                        class="previewPicture-img"
                        @click="previewImgObject(props.row.imgUrl.split(','), index)"
                      />
                    </div>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </template>
      </el-table-column>
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="name" label="发帖人">
        <template slot-scope="scope"
          ><el-button type="text" @click="goHomePages(scope.row)">{{
            scope.row.name
          }}</el-button></template
        >
      </el-table-column>
      <el-table-column prop="workNo" label="用户编号"></el-table-column>
      <el-table-column prop="orgName" label="所在部门"></el-table-column>
      <el-table-column prop="createTime" label="发帖时间"></el-table-column>
      <el-table-column prop="expertHelp" label="求助专家"> </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button size="medium" type="text" @click="handleThrough(scope.row)">通过</el-button>
          <el-divider direction="vertical" style="vertical-align: text-bottom"></el-divider>
          <el-button size="medium" type="text" @click="handleRefused(scope.row)">拒绝</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="page">
      <el-pagination
        :current-page="pageConfig.pageNo"
        :page-sizes="pageConfig.pageSizes"
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
import 'viewerjs/dist/viewer.css' // 图片预览插件
import { api as viewerApi } from 'v-viewer'
import { queryUnauditedTopicList, approvedTopic, rejectedTopic } from '@/api/community'
export default {
  name: 'PostAudit',
  data() {
    return {
      auditTime: [],
      tableData: [],
      pageConfig: {
        pageNo: 1,
        pageSizes: [10, 20, 30, 40],
        pageSize: 10,
        total: 0
      },
      seleteData: [], // 多选数据
      loading: false
    }
  },
  mounted() {
    this.initUnauditedTopicList()
  },
  methods: {
    //   分页筛选
    async handleSizeChange(val) {
      this.pageConfig.pageSize = val
      await this.initUnauditedTopicList()
      //   多选数据分页回显
      if (this.seleteData.length) {
        this.tableData.forEach((row) => {
          for (let i = 0; i < this.seleteData.length; i++) {
            if (row.id == this.seleteData[i].id) {
              this.$refs.mutilTable.toggleRowSelection(row, true)
            }
          }
        })
      }
    },
    async handleCurrentChange(val) {
      this.pageConfig.pageNo = val
      await this.initUnauditedTopicList()
      //   多选数据分页回显
      if (this.seleteData.length) {
        this.tableData.forEach((row) => {
          for (let i = 0; i < this.seleteData.length; i++) {
            if (row.id == this.seleteData[i].id) {
              this.$refs.mutilTable.toggleRowSelection(row, true)
            }
          }
        })
      }
    },
    // 查询待审核帖子列表
    async initUnauditedTopicList() {
      let params = {
        pageNo: this.pageConfig.pageNo,
        pageSize: this.pageConfig.pageSize,
        areaId: this.$route.query.areaId,
        startDate: this.auditTime[0],
        endDate: this.auditTime[1]
      }
      this.loading = true
      await queryUnauditedTopicList(params)
        .then((res) => {
          this.tableData = res.data

          this.pageConfig.total = res.totalNum
        })
        .finally(() => {
          this.loading = false
        })
    },
    changeAuditTime() {
      if (!this.auditTime) this.auditTime = []
      this.pageConfig.pageNo = 1
      this.initUnauditedTopicList()
    },
    //   通过
    async handleThrough(row) {
      await approvedTopic(
        Object.prototype.toString.call(row) === '[object Boolean]'
          ? this.seleteData.map((v) => v.id).join(',')
          : row.id
      ).then(() => {
        this.seleteData = []
        this.pageConfig.pageNo = 1
        this.initUnauditedTopicList()
        this.$message.success('通过成功!')
      })
    },
    // 拒绝
    async handleRefused(row) {
      await rejectedTopic(
        Object.prototype.toString.call(row) === '[object Boolean]'
          ? this.seleteData.map((v) => v.id).join(',')
          : row.id
      ).then(() => {
        this.seleteData = []
        this.pageConfig.pageNo = 1
        this.initUnauditedTopicList()
        this.$message.success('拒绝成功!')
      })
    },
    // 多选
    handlerSeletion(selection, row) {
      let _this = this
      // row有值是单选，undefined是多选
      if (row) {
        // true就是选中，0或者false是取消选中
        let selected = selection && selection.indexOf(row) !== -1
        if (!selected) {
          for (let i = 0; i < _this.seleteData.length; i++) {
            if (_this.seleteData[i].id == row.id) {
              _this.seleteData.splice(i, 1)
              break
            }
          }
        } else {
          _this.seleteData.push(row)
        }
      } else {
        if (selection.length) {
          _this.seleteData = [..._this.seleteData, ...selection]
          // reduce去重
          let obj = {}
          _this.seleteData = _this.seleteData.reduce(function (item, next) {
            obj[next.id] ? '' : (obj[next.id] = true && item.push(next))
            return item
          }, [])
        } else {
          // 如果是取消勾选，并把当前页数据存在的在multipleSelection中去掉
          _this.tableData.forEach((row) => {
            if (_this.seleteData.indexOf(row) !== -1) {
              _this.seleteData.splice(_this.seleteData.indexOf(row), 1)
            }
          })
        }
      }
    },
    // 图片预览
    previewImgObject(images, index) {
      viewerApi({
        options: {
          toolbar: true,
          initialViewIndex: index
        },
        images: images
      })
    },
    // 跳转他人主页
    goHomePages(item) {
      this.$router.push({ path: '/community/otherHomePage', query: { userId: item.userId } })
    }
  }
}
</script>

<style lang="scss" scoped>
.postAudit {
  .screening {
    /deep/ .el-date-editor .el-range-separator {
      padding: 0;
    }
  }
  .table-content {
    &-title {
      font-size: 16px;
      color: rgba(0, 11, 21, 0.85);
      font-weight: bold;
    }
    &-infomation {
      font-size: 14px;
      color: rgba(0, 11, 21, 0.65);
      line-height: 22px;
      display: inline-block;
      vertical-align: top;
    }
  }
  .previewPicture {
    &-img {
      width: 160px;
      height: 90px;
      margin-right: 16px;
      border-radius: 5px;
      cursor: pointer;
    }
  }
  .page {
    margin-top: 12px;
    text-align: right;
    padding-bottom: 20px;
  }
}
</style>
