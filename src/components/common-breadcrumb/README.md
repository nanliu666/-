# common-breadcrumb

基于 elementUI breadcrumb组件 封装的面包屑 
- 现在只支持2级面包屑
- 注意router/index.js内的一级面包屑需要加title，二级面包屑需要加 meta: {title: '知识库'}
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

| 参数   | 说明       | 类型  | 默认值 |
| :----- | :--------- | :---: | :----: |
| config | 面包屑配置 | Array |   -    |

### config Attributes 字段配置

除此之外支持所有FormItem组件的属性，另外，此字段传的除以下和FormItem属性以外的其他参数将会全部传递给表单组件

| 参数  | 说明             | 是否必填 |  类型  | 默认值 |
| :---- | :--------------- | :------: | :----: | :----: |
| title | 面包屑的文本     |    是    | String |   -    |
| path  | 面包写的路由路径 |    是    | String |   -    |
