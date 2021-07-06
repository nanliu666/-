<template>
  <div class="expertsAnswer">
    <!-- 顶部筛选 -->
    <el-row type="flex" justify="space-between" style="padding: 0 25px">
      <div class="screening-left">
        <el-input
          v-model="keyword"
          placeholder="请输入您要查找的专区"
          suffix-icon="el-icon-search"
          style="width: 380px"
          @input="searchZone"
          size="small"
          clearable
        >
        </el-input>
      </div>
      <div class="screening-right">
        <el-row type="flex" justify="space-between">
          <el-select v-model="zoneName" style="width: 280px" @change="selectZone" size="small">
            <el-option
              v-for="item in zoneOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-date-picker
            v-model="postTime"
            style="margin-left: 12px; width: 280px"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            size="small"
            @change="changePostTime"
          >
          </el-date-picker>
        </el-row>
      </div>
    </el-row>
    <el-divider></el-divider>
    <!-- 专家帖子列表 -->
    <post-list
      ref="postList"
      :showLoadMore="true"
      :requestParameters="requestParameters"
      :pageConfig="pageConfig"
      :isExpertTopic="true"
      :isShowTag="true"
    ></post-list>
  </div>
</template>

<script>
import postList from './components/postList.vue'
import { queryAllAreas } from '@/api/community'
export default {
  name: 'ExpertsAnswer',
  components: {
    postList
  },
  data() {
    return {
      keyword: '', // 搜索关键词
      zoneName: '0',
      zoneOptions: [
        {
          label: '全部专区',
          value: '0'
        }
      ],
      postTime: '', // 发帖时间
      pageConfig: {
        pageNo: 1,
        pageSize: 40,
        total: 0
      },
      requestParameters: {} // 专家帖子列表请求参数
    }
  },
  methods: {
    //   查询专家绑定的专区
    async initQueryAllAreas() {
      await queryAllAreas({ isExpert: 'Y' }).then((res) => {
        if (res.data.length) {
          res.data.map((v) => {
            this.zoneOptions.push({ label: v.name, value: v.id })
          })
        }
      })
    },
    // 关键词筛选
    searchZone: _.debounce(function (val) {
      this.requestParameters.content = val
      this.$refs.postList.initTopic()
    }, 300),
    // 时间筛选
    changePostTime() {
      if (!this.postTime) this.postTime = []
      this.requestParameters.startDate = this.postTime[0]
      this.requestParameters.endDate = this.postTime[1]
      this.$refs.postList.initTopic()
    },
    // 下拉筛选
    selectZone(val) {
      val == '0' ? (this.requestParameters.areaId = '') : (this.requestParameters.areaId = val)
      this.$refs.postList.initTopic()
    }
  },
  mounted() {
    this.initQueryAllAreas()
  }
}
</script>

<style lang="scss" scoped>
.expertsAnswer {
  .screening-right {
    /deep/ .el-date-editor .el-range-separator {
      padding: 0;
    }
  }
}
</style>
