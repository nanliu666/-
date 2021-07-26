<template>
  <div class="treeSelect">
    <div class="selected">
      <ul>
        <li v-if="selected.length" style="margin-right: 10px">已选知识体系:</li>
        <li v-for="(item, index) in selected" :key="item.idStr" class="know">
          <i v-if="index !== 0" class="el-icon-arrow-right"></i>
          <span>{{ item.name }}</span>
          <i class="el-icon-close" @click="closeTab(index, item)"></i>
        </li>
      </ul>
    </div>
    <div class="list">
      <span class="title">知识体系:</span>
      <div class="tabs">
        <span
          class="filter-radio"
          :class="{ active: !filterForm.knowledgeSystemId }"
          @click="knowClick(false)"
        >
          全部
        </span>
        <span v-for="(item, index) in knowList" :key="item.idStr">
          <span
            v-if="index < 12"
            :class="{ active: filterForm.knowledgeSystemId === item.idStr }"
            class="filter-radio"
            @click="knowClick(item)"
          >
            {{ item.name }}
          </span>
          <span
            v-if="index >= 12 && isMore"
            :class="{ active: filterForm.knowledgeSystemId === item.idStr }"
            class="filter-radio"
            @click="knowClick(item)"
          >
            {{ item.name }}
          </span>
        </span>
      </div>
      <el-button v-if="knowList.length > 12 && !isMore" size="mini" @click.prevent="isMore = true">更多<i class="el-icon-arrow-down"></i>
      </el-button>
      <el-button v-if="knowList.length > 12 && isMore" size="mini" @click.prevent="isMore = false">
        收起<i class="el-icon-arrow-up"></i>
      </el-button>
    </div>
  </div>
</template>

<script>
import { getKnowList } from 'src/api/train'
export default {
  props: {
    filterForm: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      knowList: [],
      selected: [],
      konwId: '',
      isMore: false
    }
  },
  created() {
    this.getKnowList('0')
  },
  methods: {
    getKnowList(id) {
      id = id ? id : 0
      getKnowList({ id: id }).then((res) => {
        this.knowList = res
      })
    },
    //点击知识体系
    knowClick(data) {
      data
        ? this.selected.push({
            name: data.name,
            parentId: data.parentIdStr,
            id: data.idStr
          })
        : (this.selected = [])
      this.filterForm.knowledgeSystemId = data ? data.idStr : ''
      this.getKnowList(data.idStr)
      this.$parent.queryList()
    },
    closeTab(index, data) {
      this.selected.splice(index)
      this.filterForm.knowledgeSystemId = data.id
      this.getKnowList(data.parentId)
      this.$parent.queryList()
    }
  }
}
</script>

<style lang="scss" scoped>
.treeSelect {
  font-size: 14px;
  color: rgba(0, 11, 21, 0.45);
  .list {
    margin-top: 5px;
    display: flex;
    justify-content: space-between;
    .title {
      flex-shrink: 0;
    }
    .tabs {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      .filter-radio {
        white-space: nowrap;
        margin-left: 12px;
        margin-right: 0;
      }
      span {
        margin-bottom: 8px;
        height: 20px;
        line-height: 20px;
      }
    }
    ::v-deep button.el-button.el-button--default.el-button--mini {
      flex-shrink: 0;
      align-self: flex-start;
      margin-left: 20px;
    }
  }
  .filter-radio {
    cursor: pointer;
    margin-right: 24px;
    color: rgba(0, 11, 21, 0.85);

    &.selected {
      color: #2875d4;
      font-weight: 600;
    }
  }
  .selected {
    ul {
      display: flex;
      flex-wrap: wrap;
      li {
        flex-shrink: 0;
        margin-bottom: 5px;
      }
      .know {
        cursor: default;
        color: #2875d4;
        background-color: #f0f9ff;
        padding: 5px;
      }
      .el-icon-arrow-right {
        margin: 0 5px;
        color: #d4cacc;
      }
      .el-icon-close {
        cursor: pointer;
        margin-left: 5px;
        color: #9ca1c1;
      }
    }
  }
  .active {
    color: #2875d4;
    font-weight: 600;
  }
}
</style>
