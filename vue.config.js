/*
 * @Description: Vue.config.js 配置选项   配置参考:https://cli.vuejs.org/zh/config/
 * @Author: lxd
 * @Date: 2020-06-08 17:31:42
 * @LastEditTime: 2020-07-28 10:51:12
 */

const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: '/', // 基本路径 vue-cli3.3之后publicPath取代了baseUrl
  outputDir: 'dist', // 构建时的输出目录  可自定义
  assetsDir: 'static', // 放置静态资源的目录
  lintOnSave: process.env.NODE_ENV === 'development', // 是否在保存的时候使用 `eslint-loader` 进行检查
  productionSourceMap: false, // 是否为生产环境构建生成 source map
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/styles/global.scss";` // 配置全局变量
      }
    }
  },
  // 配置 webpack-dev-server 行为
  devServer: {
    port: 8080,
    overlay: {
      warnings: false,
      errors: true
    },
    configureWebpack: {
      // provide the app's title in webpack's name field, so that
      // it can be accessed in index.html to inject the correct title.
      name: name,
      resolve: {
        alias: {
          '@': resolve('src')
        }
      }
    },
    // 查阅 https://github.com/vuejs/vue-docs-zh-cn/blob/master/vue-cli/cli-service.md#配置代理
    proxy: {
      '/api': {
        target: 'http://app.rmsdmedia.com',
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}
