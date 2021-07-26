<template>
  <div class="category">
    <div v-if="_.size(selected) > 0||_.size(knowledgeSelected) > 0" class="category__selected">
      <span class="category__label"> 已选条件： </span>
      <div class="selectedCla">
        <div class="category__selected--wrap">
          <span class="category__selected--title"> 分类： </span>
          <ul>
            <li v-for="(item, index) in selected" :key="item[valueKey]">
              <span class="category__selected--label">
                {{ item[labelKey] }}
              </span>
              <i class="el-icon-close close" @click="handleDelete(index, item,1)"></i>
              <i v-if="index !== selected.length - 1" class="el-icon-arrow-right arrow"></i>
            </li>
          </ul>
        </div>
        <div class="category__selected--wrap">
          <span class="category__selected--title"> 知识体系： </span>
          <ul>
            <li v-for="(item, index) in knowledgeSelected" :key="item[valueKey]">
              <span class="category__selected--label">
                {{ item[labelKey] }}
              </span>
              <i class="el-icon-close close" @click="handleDelete(index, item,2)"></i>
              <i v-if="index !== selected.length - 1" class="el-icon-arrow-right arrow"></i>
            </li>
          </ul>
        </div>
      </div>
      <i v-if="$scopedSlots.selected" class="el-icon-arrow-right arrow"></i>
      <!-- <slot name="selected"></slot> -->
    </div>
    <div v-show="!_.isEmpty(categoryList)" class="category__list" style="display: flex">
      <span class="category__label">分类：</span>
      <!-- <ul>
        <li
          v-show="!selected.length"
          style="color: #01aafc"
          @click="handleCategoryClick({ name: '全部', id: '' })"
        >
          全部
        </li>
      </ul> -->
      <ul ref="industryRef" style="flex: 1" :class="{ hidde: !bussinessType }">
        <li v-for="item in categoryList" :key="item[valueKey]" @click="handleCategoryClick(item)">
          <div v-if="item[labelKey] == '全部'" style="color: #2875d4">{{ item[labelKey] }}</div>
          <div v-else><span class="_line">|</span> {{ item[labelKey] }}</div>
        </li>
      </ul>

      <div v-show="industryHeight" class="moreBtn">
        <div class="moreBtn_box" @click="bussinessType = !bussinessType">
          <span class="text">{{ bussinessType ? '收起' : '更多' }}</span>
          <i v-show="!bussinessType" class="el-icon-arrow-down"></i>
          <i v-show="bussinessType" class="el-icon-arrow-up"></i>
        </div>
      </div>
    </div>
    <div v-show="!_.isEmpty(knowledgeList)" class="category__list" style="display: flex">
      <span class="category__label">知识体系：</span>
      <!-- <ul>
        <li
          v-show="!selected.length"
          style="color: #01aafc"
          @click="handleCategoryClick({ name: '全部', id: '' })"
        >
          全部
        </li>
      </ul> -->
      <ul ref="industryRef2" style="flex: 1" :class="{ hidde: !bussinessType2 }">
        <li v-for="item in knowledgeList" :key="item[valueKey]" @click="handleCategoryClick2(item)">
          <div v-if="item[labelKey] == '全部'" style="color: #2875d4">{{ item[labelKey] }}</div>
          <div v-else><span class="_line">|</span> {{ item[labelKey] }}</div>
        </li>
      </ul>

      <div v-show="industryHeight2" class="moreBtn">
        <div class="moreBtn_box" @click="bussinessType2 = !bussinessType2">
          <span class="text">{{ bussinessType2 ? '收起' : '更多' }}</span>
          <i v-show="!bussinessType2" class="el-icon-arrow-down"></i>
          <i v-show="bussinessType2" class="el-icon-arrow-up"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getKnowledgeCatalogList } from '@/api/knowledge'
export default {
  name: 'CategorySelect',
  props: {
    // 加载方法,返回Promise对象
    load: {
      type: Function,
      default: () => []
    },
    // 数据唯一key
    valueKey: {
      type: String,
      default: 'id'
    },
    // 展示用字段
    labelKey: {
      type: String,
      default: 'name'
    }
  },
  data() {
    return {
      categoryList: [],      
      selected: [],
      knowledgeList:[], // 知识体系当前节点数据
      knowledgeSelected:[], // 知识体系选中节点数据   
      active: {
        knowledge:{},
        category:{}
      },
      industryHeight: true,
      bussinessType: true,
      industryHeight2: true,
      bussinessType2: true
    }
  },

  watch: {
    categoryList: function() {
      this.toUpdateClient()
    },
    selected: function() {
      this.toUpdateClient()
    },
    knowledgeList: function() {
      this.toUpdateClient2()
    },
    knowledgeSelected: function() {
      this.toUpdateClient2()
    }
  },

  mounted() {
    this.loadCategory(null)
    this.getKnowledgeCatalogListFn(0)
  },
  methods: {
    toUpdateClient() {
      this.$nextTick(function() {
        let cur = this.$refs['industryRef']
        if (cur.clientHeight > 30 && cur.clientHeight != 22) {
          // 是否显示btn
          this.industryHeight = true
          // // 是否显示分类
          this.bussinessType = false
        } else if (cur.clientHeight == 22) {
          // 是否显示btn
          this.industryHeight = true
          // // 是否显示分类
          this.bussinessType = false
        } else {
          this.industryHeight = false
          this.bussinessType = true
        }
      })
    },
    toUpdateClient2() {
      this.$nextTick(function() {
        let cur = this.$refs['industryRef2']
        if (cur.clientHeight > 30 && cur.clientHeight != 22) {
          // 是否显示btn
          this.industryHeight2 = true
          // // 是否显示分类
          this.bussinessType2 = false
        } else if (cur.clientHeight == 22) {
          // 是否显示btn
          this.industryHeight2 = true
          // // 是否显示分类
          this.bussinessType2 = false
        } else {
          this.industryHeight2 = false
          this.bussinessType2 = true
        }
      })
    },
    loadCategory(id) { // 获取分类数据
      this.load({ id }).then((list) => {
        //如果为空对象  会报错
        if(Object.prototype.toString.call(list) === '[object Object]'){
          list = []
        }
        this.categoryList = list
        if (!this.selected.length) {
          this.categoryList.unshift({ name: '全部', id: '' })
        }
      })
    },
    handleCategoryClick(category) { // 选中分类
      if (category.name == '全部') {
        this.selected = []
      }
      this.selected.push(category)
      this.active.category = category

      // let ids = []
      // this.selected.forEach((item) => {
      //   if (item.id) ids.push(item.id)
      // })
      // let data = { id: '' }
      // data.id = ids.toString()
      this.$emit('change', this.active)
      this.loadCategory(category[this.valueKey])
    },
    handleCategoryClick2(item) { // 选中知识体系
      if (item.name == '全部') {
        this.knowledgeSelected = []
      }
      this.knowledgeSelected.push(item)
      this.active.knowledge = item
      // let ids = []
      // this.selected.forEach((item) => {
      //   if (item.id) ids.push(item.id)
      // })
      // let data = { id: '' }
      // data.id = ids.toString()
      this.$emit('change', this.active)
      this.getKnowledgeCatalogListFn(item.idStr)
    },
    handleDelete(index,item,type) {
      if(type==1){
        this.toUpdateClient()
        this.selected = this.selected.slice(0, index)
        this.active.category = _.last(this.selected) || {}
        this.loadCategory(this.active[this.valueKey])
        this.$emit('change', this.active)
      }else{
        // knowledgeList:[], // 知识体系当前节点数据
        // knowledgeSelected:[], // 知识体系选中节点数据   
        this.toUpdateClient2()
        this.knowledgeSelected = this.knowledgeSelected.slice(0, index)
        this.active.knowledge = _.last(this.knowledgeSelected) || {}
        this.getKnowledgeCatalogListFn(this.active.knowledge.idStr)
        this.$emit('change', this.active)
      }
     
    },
    getKnowledgeCatalogListFn(id){ // 获取知识体系
      id=id?id:'0'  
      getKnowledgeCatalogList({id:id}).then((res)=>{
        //如果为空对象  会报错
        // if(Object.prototype.toString.call(res) === '[object Object]'){
        //   res = []
        // }
        this.knowledgeList = res
        if (!this.selected.length) {
          this.knowledgeList.unshift({ name: '全部', id: '0' })
        }        
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.category {
  color: rgba($primaryFontColor, 0.85);
  line-height: 22px;  
  &__selected {
    display: flex;
    margin-bottom: 16px;
    &--wrap {
      background: #f5f5f6;
      font-size: 12px;
      height: 24px;
      display: block;
      padding: 0 8px;
      line-height: 24px;
      border-radius: 4px;
      background-color: #f0f9ff;
    }
    &--title {
      color: rgba($primaryFontColor, 0.45);
    }
    &--label {
      color: $primaryColor;
    }
    ul {
      display: inline;
      li {
        display: inline;
        line-height: 24px;

        i.close {
          color: #8c9195;
          font-size: 8px;
          margin-left: 4px;
          cursor: pointer;
        }
        i.arrow {
          margin: 0 8px;
          color: rgba($primaryFontColor, 0.45);
        }
      }
    }
  }
  &__list {
    margin-bottom: 12px;
    ul {
      display: inline;
      li {
        cursor: pointer;
        display: inline-block;
        margin-right: 16px;
        margin-bottom: 8px;
      }
    }
  }
}
.moreBtn {
  font-size: 12px;
  color: $primaryColor;
  .moreBtn_box {
    border: 1px solid #ccc;
    height: 24px;
    line-height: 24px;
    width: 64px;
    padding-left: 10px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    color: rgba(0, 11, 21, 0.85);
    &:hover {
      color: #2875d4;
    }
  }
  .text {
    margin-right: 12px;
  }
}
.category__label{display: block;float: left;width: 70px;margin-right: 5px;}
.selectedCla{flex: 1;}
.hidde {
  overflow: hidden;
  height: 22px;
}
._line {
  color: #ccc;
  margin: 0 24px 0 12px;
}
</style>
