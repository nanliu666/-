## 依赖

* 主要依赖：vue vuex vue-router element-ui 

* css动画库 [animate css](https://daneden.github.io/animate.css/)

* MockJS [参考](https://juejin.im/post/5cf726b5e51d454fbf5409bc),[官方示例](http://mockjs.com/examples.html)


## 开发注意事项

* axios已封装，`/src/router/axios.js`中提供了get/put/post/del方法，接口调用成功后只返回接口数据的response字段，其他字段仅做全局使用

* 字典组调用已在vuex写好，使用时请调用dispatch CommonDict,传对应的字典组名,将返回一个Promise对象，代码示例如下
  ```js
    this.$store.dispatch('CommonDict', 'WorkProperty').then((res) => {
        this.workPropertyList = res
    })
  ```


## 启动

* npm目前安装依赖会报错无法运行，请使用yarn作为包管理器，yarn命令使用更简洁，依赖加载速度更快

* 执行`yarn pre`安装依赖,本地启动使用`yarn serve`,打包使用`yarn build`

## lint相关

* 项目添加eslint+commitLint，eslint用于提高代码质量，commitLint用于限制commit消息格式

* git commit消息格式按照 `.commitlintrc.js`文件中的关键词＋＇:＇＋提交信息，否则将无法提交代码，请仔细看一下`.commitlintrc.js`中的注释，使用正确的关键词

* 项目加了commit触发的格式化工作流，每次提交前会检查并格式化所有提交的代码，遇到报错请解决掉对应的问题再提交代码

## 主要代码结构

```
├── vue.config.js // Vue配置文件
├── public 静态文件
└── src
    ├──api // 接口定义
    ├──components // 公共组件 (多个模块都会用到的组件)
    │    ├──treeSelect // 下拉树选择
    │    ├──common-form // 通用表单组件
    │    └──common-upload // 通用上传组件
    ├──directive // 自定义指令
    │    ├──loadmore.js //v-loadmore elementUI select选项滚动加载更多
    │    └──pcheck.js //v-p 权限校验，不通过则隐藏
    ├──mock // mock代码
    │    ├──index.js // mock总开关
    │    └──modules // 各模块接口对应的mock文件,每个模块应该建一个子文件夹
    ├──page // 基础布局组件
    ├──router // 路由
    │    ├──page // 基础路由，不鉴权路由
    │    └──axios.js // axios封装，请求拦截
    ├──store // vuex
    │    ├──modules 
    │    │   ├──dict.js // 字典组
    │    │   └──user.js // 用户信息
    │    └──getters.js
    ├──style // 全局样式
    │    ├──oa-custom // 自定义element-ui样式
    │    └──common.css // 全局样式
    ├──util // 工具
    │    ├──uploadQiniu.js // 上传到七牛云
    │    └──。。。 // 常用工具类
    ├──views // 业务页面
    │    ├──system // 系统管理
    │    ├──orgs // 组织机构
    │    └──personnel // 花名册
    └──main.js // 项目入口
```

## 注意事项

* 尽量使用ES6语法，[参考](https://es6.ruanyifeng.com/#docs/style)

* 开发vue相关要按照vue[官方代码规范](https://cn.vuejs.org/v2/style-guide/index.html)开发，js命名规范按照[AlloyTeam规范文档](http://alloyteam.github.io/CodeGuide/#js-variable-naming)

* 开发前看一下util文件夹下的函数，常用的校验正则，cookie,store等工具函数都有，不要自己造轮子

* Mock使用MockJS，注意看一下[文档](https://juejin.im/post/5cf726b5e51d454fbf5409bc) ，mock代码放在src/mock下