<template>
  <el-card
    shadow="never"
    style="border: 0"
  >
    <div class="empty-class">
      <el-image
        class="empty-image"
        :src="emptyOption.src"
        fit="fill"
      />
      <div v-text="emptyOption.text" />
    </div>
  </el-card>
</template>

<script>
import nodata from '@/assets/images/nodata.png'
export default {
  name: 'CommonEmpty',
  props: {
    emptyOption: {
      type: Object,
      default: function() {
        return {
          visibile: true,
          src: nodata,
          text: '暂无数据~'
        }
      }
    }
  },
  data() {
    return {
      emptyHeight: ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
.empty-class {
  background-color: #fff;
  height: 100%;
  min-height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-size: 18px;
  color: #718199;
  box-sizing: border-box;
  // .empty-image {
  //   // max-width: 80%;
  //   img {
  //     max-width: 300px;
  //     height: 300px;
  //   }
  // }
}
</style>
