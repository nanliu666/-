<template>
  <el-tooltip class="item" effect="dark" content="Bottom Center 提示文字" placement="top">
    <p v-if="item.planTime.length > 0" class="department">
      <span>{{ item.lecturerName }} |</span>
      <span>
        {{ item.planTime[0].split('~')[0].replaceAll('-', '/') }}
      </span>
      <span v-if="item.cycleInfo.cycleMode == 'day'">
        <span>每天 </span>
      </span>
      <span v-if="item.cycleInfo.cycleMode == 'week'">
        <span>每周 </span>
        <span v-for="(item, index) in item.cycleInfo.cycleTime.split(',')" :key="index">{{ index === 0 ? '' : '/' }}周{{ item === 7 ? '天' : item }}</span>
      </span>
      <span v-if="item.cycleInfo.cycleMode == 'month'">
        <span>每月 </span>
        <span v-for="(item, index) in item.cycleInfo.cycleTime.split(',')" :key="index">{{ item }}号/</span>
      </span>
    </p>
    <p v-else class="department" style="padding: 10px 14px; height: 96px">
      <span> &nbsp; </span>
    </p>

    <div slot="content">
      <div v-if="item.batchDeclare == 'single'">
        <p v-for="(i, index) in item.planTime" :key="index">
          {{ i.replaceAll('-', '/') }}
        </p>
      </div>
      <p v-if="item.cycleInfo.cycleMode == 'day'">每天</p>
      <p v-if="item.cycleInfo.cycleMode == 'week'">
        每周
        <span v-for="(item, index) in item.cycleInfo.cycleTime.split(',')" :key="index">{{ index === 0 ? '' : '/' }}周{{ item === '7' ? '天' : item }}</span>
      </p>
      <p v-if="item.cycleInfo.cycleMode == 'month'">
        每月
        <span v-for="(item, index) in item.cycleInfo.cycleTime.split(',')" :key="index">{{ index === 0 ? '' : '/' }}{{ item }}号</span>
      </p>
      <div v-if="item.batchDeclare === 'plural'">
        <p v-for="(i, index) in item.planTime" :key="index">
          第{{ index + 1 }}次：{{ i.replaceAll('-', '/') }}
        </p>
      </div>
      <div v-if="item.batchDeclare == 'cycle'">
        <p v-for="(i, index) in item.planTime" :key="index">
          第{{ index + 1 }}次：{{ i.replaceAll('-', '/') }}
        </p>
      </div>
    </div>
  </el-tooltip>
</template>
<script>
export default {
  name: 'LiveTimeTips',
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  }
}
</script>
<style scoped lang="scss">
.department {
  color: #ccc;
  font-size: 12px;
  margin: 5px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
