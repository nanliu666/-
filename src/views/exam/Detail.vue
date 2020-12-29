<template>
  <div>
    <common-breadcrumb ref="breadcrumb" />
    <el-card>
      <div slot="header"></div>
      <div></div>
    </el-card>
  </div>
</template>

<script>
import CommonBreadcrumb from '@/components/common-breadcrumb/Breadcrumb'
export default {
  components: {
    CommonBreadcrumb
  },
  data() {
    return {}
  },
  created() {},
  methods: {}
}
</script>

<style scoped lang="scss"></style>
