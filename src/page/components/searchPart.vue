<template>
  <div ref="treeWrap" class="search__container">
    <div class="search__input">
      <i class="el-icon-close" @click="close" />
      <el-input
        v-model="searchText"
        maxlength="100"
        placeholder="输入感兴趣内容搜索"
        @keyup.enter.native="toSearch"
      />
      <i class="iconimage_icon_search iconfont search__icon" @click="toSearch" />
      <span class="system__class" @click="toKnowledgeSystem">知识体系</span>
    </div>
    <el-card v-if="!_.isEmpty(historyList)" class="box-card">
      <div class="search__history">
        <div class="history__header">
          <span>历史搜索</span>
          <span class="header__right" @click="clearHistory">
            <i class="iconic_sousuo_qingkong iconfont" />
            <span class="clear__history">清空</span>
          </span>
        </div>
        <ul class="history__ul">
          <li
            v-for="(item, index) in _.reverse(_.cloneDeep(historyList))"
            :key="index"
            class="history__li"
            @click="toSearch(item)"
          >
            <span class="li__content">{{ item }}</span>
          </li>
        </ul>
      </div>
    </el-card>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Mark from 'mark.js'
export default {
  name: 'SearchPart',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      searchText: ''
    }
  },
  computed: {
    ...mapGetters(['comSearchText', 'historyList'])
  },
  watch: {
    searchText: {
      handler(val) {
        let markInstance = new Mark('.history__li')
        markInstance.unmark().mark(val, {
          acrossElements: true,
          separateWordSearch: false
        })
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.closeByOther()
  },
  methods: {
    clearHistory() {
      this.$store.commit('CLEAR_SEARCH_HISTORY')
    },
    /**
     * 点击其他地方关闭搜索
     */
    closeByOther() {
      document.addEventListener('mouseup', (e) => {
        let tree = this.$refs.treeWrap
        if (tree) {
          if (!tree.contains(e.target)) {
            this.close()
          }
        }
      })
    },
    close() {
      this.$emit('closeSearch', false)
    },
    toSearch(data) {
      const target = _.isString(data) ? data : this.searchText
      if (target) {
        this.$store.commit('SET_SEARCH_TEXT', target)
        this.$router.push({ path: '/search/list' })
        this.$store.commit('SET_SEARCH_HISTORY', this.searchText)
        this.searchText = ''
        this.close()
      }
    },
    toKnowledgeSystem() {
      this.$message.error('开发中...')
      if (process.env.NODE_ENV === 'development') {
        this.$router.push({ path: '/knowledge-system' })
      }
    }
  }
}
</script>
<style scoped lang="scss">
/deep/ mark {
  color: #1677ff;
  background: transparent;
}
.search__container {
  z-index: 1000;
  .search__input {
    position: absolute;
    top: -8px;
    width: 520px;
    left: calc(50vw - 250px);
    height: 54px;
    display: flex;
    align-items: flex-end;
    /deep/ .el-input__inner {
      border: 0;
    }
    .search__icon {
      position: absolute;
      font-size: 20px;
      bottom: 6px;
      right: 0;
      cursor: pointer;
      color: #8c9195;
      cursor: pointer;
    }
    /deep/ .el-input {
      input {
        width: calc(100% - 100px);
        float: left;
      }
    }
    .el-icon-close {
      position: absolute;
      bottom: 9px;
      left: -20px;
      font-size: 22px;
      color: #8c9195;
      cursor: pointer;
    }

    .system__class {
      position: absolute;
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color: #2875d4;
      font-weight: 500;
      right: 32px;
      bottom: 8px;
      cursor: pointer;
    }
  }
  /deep/ .el-card__body {
    padding: 0;
  }
  /deep/ .el-card {
    border-radius: 0 0 4px 4px;
  }
  /deep/ .el-input {
    input {
      caret-color: #2875d4;
    }
  }
  .box-card {
    position: absolute;
    width: 540px;
    height: 250px;
    left: calc(50vw - 270px);
    bottom: -250px;
    padding: 16px 0;
    .search__history {
      background-color: #fff;
      .history__header {
        padding: 0 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: rgba(0, 11, 21, 0.45);
        margin-bottom: 16px;
        .header__right {
          display: flex;
          align-items: center;
          cursor: pointer;
          .clear__history {
            margin-left: 6px;
          }
        }
      }
      .history__ul {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: rgba(0, 11, 21, 0.85);
        .history__li {
          cursor: pointer;
          padding: 0 16px;
          height: calc((250px - 16px * 2 - 22px) / 5);
          display: flex;
          align-items: center;
          &:last-child {
            margin-bottom: 0;
          }
          &:hover {
            background-color: #f2f2f2;
          }
          .li__content {
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-align: left;
          }
        }
      }
      .empty__text {
        height: 196px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: rgba(0, 11, 21, 0.45);
      }
    }
  }
}
</style>
