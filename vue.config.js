// Vue.config.js 配置选项   配置参考:https://cli.vuejs.org/zh/config/
// const path = require('path');
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
