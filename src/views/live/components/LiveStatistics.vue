<template>
  <div class="LiveStatistics">
    <div class="container-header">
      <div class="title">统计汇总</div>
    </div>

    <div class="data-wrapper">
      <ul class="data-list">
        <li class="data-item">
          <div class="desc">
            观看次数
            <el-popover transition="none" title="数据统计" trigger="click">
              <i slot="reference" class="el-icon-question" style="cursor: pointer;"></i>
              <template slot>
                <div>
                  <span>数据来自第三方直播统计后台</span><br /><br />
                  <span>观看次数：播放器刷新一次算一次访问，是真实数据。</span><br /><br />
                  <span>观看人数：观看人数为观众IP地址去重后的统计结果。</span><br /><br />
                  <span>导出数据：导出所选日期及规则的详细数据（可以按照第三方直播导出详细的数据，比列表更全）。</span><br /><br />
                  <span>排序：进入时间由近及远。</span>
                </div>
              </template>
            </el-popover>
          </div>
          <div class="data">{{ data.pcTimes + data.mobileTimes }}<span class="unit">次</span></div>
          <div class="intro">
            <span class="intro-item">PC端 <span class="count">{{ data.pcTimes }}</span></span>
            <span class="intro-item">移动端 <span class="count">{{ data.mobileTimes }}</span></span>
          </div>
        </li>
        <li class="data-item">
          <div class="desc">观看时长</div>
          <div class="data">
            {{ data.pcDuration + data.mobileDuration }}<span class="unit">分钟</span>
          </div>
          <div class="intro">
            <span class="intro-item">PC端 <span class="count">{{ data.pcDuration }}</span></span>
            <span class="intro-item">移动端 <span class="count">{{ data.mobileDuration }}</span></span>
          </div>
        </li>
        <li class="data-item">
          <div class="desc">
            观看人数
            <el-popover transition="none" title="数据统计" trigger="click">
              <i slot="reference" class="el-icon-question" style="cursor: pointer;"></i>
              <template slot>
                <div>
                  <span>数据来自第三方直播统计后台</span><br /><br />
                  <span>观看次数：播放器刷新一次算一次访问，是真实数据。</span><br /><br />
                  <span>观看人数：观看人数为观众IP地址去重后的统计结果。</span><br /><br />
                  <span>导出数据：导出所选日期及规则的详细数据（可以按照第三方直播导出详细的数据，比列表更全）。</span><br /><br />
                  <span>排序：进入时间由近及远。</span>
                </div>
              </template>
            </el-popover>
          </div>
          <div class="data">{{ data.pcViews + data.mobileViews }}<span class="unit">人</span></div>
          <div class="intro">
            <span class="intro-item">PC端 <span class="count">{{ data.pcViews }}</span></span>
            <span class="intro-item">移动端 <span class="count">{{ data.mobileViews }}</span></span>
          </div>
        </li>
        <li class="data-item">
          <div class="desc">人均观看时长</div>
          <div class="data">
            {{ data.pcAveDuration + data.mobileAveDuration }}<span class="unit">分钟</span>
          </div>
          <div class="intro">
            <span class="intro-item">PC端 <span class="count">{{ data.pcAveDuration }}</span></span>
            <span class="intro-item">移动端 <span class="count">{{ data.mobileAveDuration }}</span></span>
          </div>
        </li>
        <li class="data-item">
          <div class="desc">人均观看次数</div>
          <div class="data">
            {{ data.pcAveTimes + data.mobileAveTimes }}<span class="unit">次</span>
          </div>
          <div class="intro">
            <span class="intro-item">PC端 <span class="count">{{ data.pcAveTimes }}</span></span>
            <span class="intro-item">移动端 <span class="count">{{ data.mobileAveTimes }}</span></span>
          </div>
        </li>
      </ul>
    </div>

    <div class="table-container">
      <div class="table-header">
        <div class="title">数据统计</div>
      </div>

      <el-table v-loading="tableLoading" :data="tableData" height="50vh">
        <el-table-column align="center" prop="userName" label="用户名称"> </el-table-column>
        <el-table-column align="center" prop="viewDuration" label="观看时长"> </el-table-column>
        <el-table-column align="center" prop="startDate" label="进入时间"> </el-table-column>
        <el-table-column align="center" prop="leaveDate" label="离开时间"> </el-table-column>
        <el-table-column align="center" prop="district" label="地区"> </el-table-column>
        <el-table-column align="center" prop="city" label="城市"> </el-table-column>
      </el-table>
    </div>

    <div class="page-container">
      <pagination
        :total="total"
        :page="query.pageNo"
        :limit="query.pageSize"
        @pagination="pagination"
      ></pagination>
    </div>
  </div>
</template>

<script>
import { getSummary, getAudience } from '@/api/live'
import Pagination from 'src/components/common-pagination'

export default {
  name: 'LiveStatistics',
  components: {
    Pagination
  },
  props: {
    livePlanId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      data: {
        pcTimes: 0,
        pcDuration: 0,
        pcViews: 0,
        pcAveTimes: 0,
        pcAveDuration: 0,
        mobileTimes: 0,
        mobileDuration: 0,
        mobileViews: 0,
        mobileAveTimes: 0,
        mobileAveDuration: 0
      },
      tableData: [],
      tableLoading: true,
      total: 0,
      query: {
        pageNo: 1,
        pageSize: 10
      }
    }
  },
  watch: {
    livePlanId() {
      this.getData()
    }
  },
  activated() {
    this.query.livePlanId = this.livePlanId
    this.getData()
  },
  methods: {
    getData() {
      this.getSummary()
      this.getAudience()
    },
    getSummary() {
      getSummary({ livePlanId: this.livePlanId }).then((res) => {
        Object.keys(res).forEach((key) => {
          this.data[key] = +res[key]
        })
      })
    },
    getAudience() {
      this.tableLoading = true
      getAudience(this.query)
        .then((res) => {
          this.tableData = res.data
          this.tableLoading = false
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    pagination({ page, limit }) {
      this.query.pageNo = page
      this.query.pageSize = limit
      this.getAudience()
    }
  }
}
</script>

<style scoped lang="scss">
.LiveStatistics {
  padding-top: 9px;
  background-color: #fff;
  margin-bottom: 24px;
  .container-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 40px;
    .title {
      cursor: default;
      border-left: 4px solid #01aafc;
      padding-left: 8px;
      font-size: 14px;
      color: rgba(0, 11, 21, 0.85);
      line-height: 16px;
    }
  }
  .data-wrapper {
    margin-top: 20px;
    .data-list {
      display: flex;
      .data-item {
        cursor: default;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        flex: 1;
        height: 80px;
        &:not(:last-child) {
          border-right: 1px solid #ebeced;
        }
        .desc {
          opacity: 0.45;
          font-size: 14px;
          color: #000b15;
          margin-bottom: 8px;
        }
        .data {
          font-size: 28px;
          color: rgba(0, 11, 21, 0.85);
          margin-bottom: 16px;
          .unit {
            font-size: 12px;
            color: rgba(0, 11, 21, 0.45);
            margin-left: 6px;
          }
        }
        .intro {
          .intro-item {
            font-size: 12px;
            color: rgba(0, 11, 21, 0.45);
            font-weight: 600;
            &:first-child {
              margin-right: 40px;
            }
            .count {
              display: inline-block;
              vertical-align: bottom;
              max-width: 80px;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
              font-size: 12px;
              color: rgba(0, 11, 21, 0.85);
            }
          }
        }
      }
    }
  }

  .table-container {
    margin-top: 48px;
    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      .title {
        cursor: default;
        border-left: 4px solid #01aafc;
        padding-left: 8px;
        font-size: 14px;
        color: rgba(0, 11, 21, 0.85);
        line-height: 16px;
      }
      .operate-area {
        display: flex;
        align-items: center;
        .checkbox {
          margin-right: 24px;
        }
        .export-btn {
          cursor: pointer;
          margin-left: 24px;
          font-size: 14px;
          color: rgba(0, 11, 21, 0.65);
          .iconimage_icon_export {
            color: rgba(0, 11, 21, 0.65);
          }
        }
      }
    }
  }
}
</style>
