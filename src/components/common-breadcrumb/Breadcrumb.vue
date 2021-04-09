<template>
  <el-breadcrumb
    v-if="!_.isEmpty(routeList)"
    :separator="separator"
    style="margin-top:24px; margin-bottom: 16px;"
  >
    <el-breadcrumb-item v-for="(item, index) in routeList" :key="index">
      <a v-if="item.path" :href="`#${item.path}`">{{ item.title }}</a>
      <span v-else>{{ item.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: 'CommonBreadcrumb',
  props: {
    separator: {
      type: String,
      default: '/'
    },
    routeList: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data() {
    return {}
  },
  methods: {
    setBreadcrumbTitle(title, index = 1) {
      this.routeList[index].title = title
    }
  }
}
</script>

<style scoped lang="scss"></style>
