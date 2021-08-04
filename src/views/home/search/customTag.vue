<template>
  <span v-if="!_.isEmpty(_.get(item, 'knowledgeSystemName'))">
    <el-tag
      v-if="_.size(_.get(item, 'knowledgeSystemName')) < 5"
      effect="plain"
      type="info"
      class="tag__class"
    >{{ _.get(item, 'knowledgeSystemName') }}</el-tag>
    <el-tooltip
      v-else
      class="item"
      effect="dark"
      :content="_.get(item, 'knowledgeSystemName')"
      placement="top-start"
    >
      <el-tag effect="plain" type="info" class="tag__class">{{
        _.get(item, 'knowledgeSystemName')
      }}</el-tag>
    </el-tooltip>
  </span>
</template>
<script>
export default {
  name: 'CustomTag',
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {}
  },
  created() {},
  methods: {}
}
</script>
<style scoped lang="scss">
.tag__class {
  width: 70px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
}
</style>
