# common-breadcrumb

基于 elementUI breadcrumb组件 封装的面包屑 
- 必须传入自定义routeList，传入完整的路径，示例参照直播详情（live/detail）入参
- 如果是默认2级的请注意router/index.js内的一级面包屑需要加title，二级面包屑需要加 meta: {title: '知识库'}
- F5刷新页面，面包屑不丢失
- 二级title需要自定义的话需要如下操作
- 开发的时候，热加载可能会丢失
```
  mounted() {
    this.$nextTick(() => {
      this.$refs.breadcrumb.setBreadcrumbTitle(this.konwledgeDetail.title)
    })
  },
```

### Attributes 配置

| 参数      | 说明                 |  类型  | 默认值 |
| :-------- | :------------------- | :----: | :----: |
| separator | 分隔符               | String |   /    |
| routeList | 当前的面包屑路由数组 | Array  |   []   |

### routeList Attributes 字段配置

| 参数  | 说明             | 是否必填 |  类型  | 默认值 |
| :---- | :--------------- | :------: | :----: | :----: |
| title | 面包屑的文本     |    是    | String |   -    |
| path  | 面包写的路由路径 |    是    | String |   -    |
### Events事件

| 事件名称           | 说明                 | 参数说明                                           |
| :----------------- | :------------------- | :------------------------------------------------- |
| setBreadcrumbTitle | 设置面包屑的中文名称 | title：需要设置的title名称，index：设置第几个title |

