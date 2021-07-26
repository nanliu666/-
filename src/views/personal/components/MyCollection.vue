<template>
  <div class="MyCollection">
    <ul class="tabs">
      <li
        v-for="(item, index) in listData"
        :key="index"
        :class="{ pitch: pitch === index }"
        @click="showBtn(index)"
      >
        {{ item.title }}
      </li>
    </ul>

    <div class="content">
      <Course  v-if="pitch === 0" ></Course>
      <Train   v-if="pitch === 1"></Train>
      <Live v-if="pitch === 2"></Live>
      <Knowledge  v-if="pitch === 3"></Knowledge>
      
    </div>
  </div>
</template>

<script>
export default {
  components: {
    Course: () => import('../MyCollectionComponents/Course'), //课程
    Train: () => import('../MyCollectionComponents/Train'), //培训
    Live: () => import('../MyCollectionComponents/Live'), // 直播
    Knowledge: () => import('../MyCollectionComponents/Knowledge') //知识库
  },
  data() {
    return {
      pitch: 0,
      listData: [{ title: '课程' }, { title: '培训' }, { title: '直播' }, { title: '知识库' }]
    }
  },
  methods: {
    showBtn(i) {
      this.pitch = i
    }
  }
}
</script>

<style lang="scss" scoped>
.MyCollection {
  .tabs {
    background-color: #fff;
    box-shadow: 0 2px 8px 0 rgba(0, 63, 161, 0.06);
    display: flex;
    padding-left: 30px;
    li {
      margin-right: 50px;
      padding: 20px 0;
      cursor: pointer;
    }
    .pitch {
      border-bottom: 2px solid #1677ff;
      color: #2875D4;
    }
  }
  .content {
  
  }
}
</style>
