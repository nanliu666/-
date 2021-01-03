<template>
  <el-breadcrumb
    v-if="!_.isEmpty(_configs)"
    :separator="separator"
    style="margin-top:24px; margin-bottom: 16px;"
  >
    <el-breadcrumb-item
      v-for="(item, index) in _configs"
      :key="index"
      :to="{ path: item.path }"
    >
      {{ item.title }}
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
      default: () => []
    }
  },
  data() {
    return {
      configs: []
    }
  },
  computed: {
    _configs: {
      get() {
        let target = _.isEmpty(this.routeList) ? this.configs : this.routeList
        return target
      },
      set() {}
    }
  },
  activated() {
    const formPath = `/${this.$route.fullPath.split('/')[1]}`
    const routes = this.$router.options.routes
    let form = this.findRoute(routes, formPath)
    let to = { path: this.$route.path, title: _.get(this.$route.meta, 'title', ' ') }
    this.configs = [form, to]
  },
  methods: {
    findRoute(source, target) {
      let targetRoute = {}
      const loop = function(routes) {
        _.each(routes, (item) => {
          if (item.path === target) {
            targetRoute = item
          } else {
            loop(item.children)
          }
        })
      }
      loop(source)
      return targetRoute
    },
    setBreadcrumbTitle(title, index = 1) {
      this.configs[index].title = title
    }
  }
}
</script>

<style scoped lang="scss"></style>
