const isProduction = process.env.NODE_ENV === 'production'
// const isProduction = true
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}
const MomentLocalesPlugin = require('moment-locales-webpack-plugin')
const CompressWebpackPlugin = require('compress-webpack-plugin')

module.exports = {
  //路径前缀
  publicPath: '/',
  lintOnSave: true,
  productionSourceMap: false,
  chainWebpack: (config) => {
    const entry = config.entry('app')
    // const svgRule = config.module.rule('svg')
    entry.add('babel-polyfill').end()
    entry.add('classlist-polyfill').end()
    // svgRule.uses.clear() // 清除已有的loader, 如果不这样做会添加在此loader之后
    // svgRule.exclude.add(/node_modules/) // 正则匹配排除node_modules目录
    // svgRule // 添加svg新的loader处理
    //   .test(/\.svg$/)
    //   .use('svg-sprite-loader')
    //   .loader('svg-sprite-loader')
    //   .options({
    //     symbolId: 'icon-[name]'
    //   })
    // 修改images loader 添加svg处理
    // const imagesRule = config.module.rule('images')
    // imagesRule.exclude.add(resolve('src/assets/images/myTask'))
    // config.module.rule('images').test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
    //忽略的打包文件
    if (isProduction) {
      config.externals({
        vue: 'Vue',
        'vue-router': 'VueRouter',
        vuex: 'Vuex',
        axios: 'axios',
        'element-ui': 'ELEMENT'
      })
    } else {
      config.externals({
        axios: 'axios'
      })
    }
    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])

    config.plugin('html').tap((args) => {
      args[0].isProduction = isProduction
      // 指定打包的js注入到head标签
      // args[0].inject = 'head'
      return args /* 传递给 html-webpack-plugin's 构造函数的新参数 */
    })

    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete('prefetch')

    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config.when(isProduction, (config) => {
      config
        .plugin('ScriptExtHtmlWebpackPlugin')
        .after('html')
        .use('script-ext-html-webpack-plugin', [
          {
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/
          }
        ])
        .end()

      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial' // only package third parties that are initially dependent
          },
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      })
      // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
      config.optimization.runtimeChunk('single')
    })
  },
  devServer: {
    port: 5188,
    open: true,
    proxy: {
      '/api': {
        // 深圳
        // target: 'http://192.168.40.229/',
        // 广州
        // target: 'http://192.168.1.100/',
        // 本地环境
        // 开发环境
        // target: 'http://122.112.183.186/',
        // target: 'http://apidev.epro.com.cn/',

        // 测试环境
        target: 'http://139.159.141.248:8081',

        // 深圳本地开发环境1
        // target: 'http://172.16.4.55:7071',
        // 深圳本地开发环境2
        // target: 'https://172.16.4.55',

        // 辛桃发IP
        // target: 'http://192.168.40.134',
        // 浩敏
        // target: 'http://172.16.4.92',

        // 贺磊IP
        //target: 'http://10.134.5.206',

        // 殷云
        // target: 'http://192.168.40.110',

        // 春光
        // target: 'http://10.134.5.189',

        // 王佳
        // target: 'http://192.168.40.111',

        // saber远程演示服务地址
        // target: 'https://saber.bladex.vip/',
        ws: true,
        changeOrigin: true
      },
      '/eln': {
        // target: 'http://139.159.141.248:1888'
        target: 'http://139.9.41.27:1888'
      }
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        src: resolve('src')
      }
    },
    plugins: [
      new MomentLocalesPlugin({
        localesToKeep: ['zh-cn']
      }),
      new CompressWebpackPlugin({
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp('\\.(js|css)$'),
        threshold: 10240,
        minRatio: 0.8
      })
    ]
  },
  css: {
    loaderOptions: {
      scss: {
        data: '@import "~@/styles/variables.scss";'
      },
      sass: {
        data: '@import "~@/styles/variables.scss";'
      }
    }
  }
}
