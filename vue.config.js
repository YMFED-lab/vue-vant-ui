const IS_PROD = ['production', 'test'].includes(process.env.NODE_ENV)
module.exports = {
  // publicPath: '././',
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  outputDir: 'dist/static',
  assetsDir: 'static',
  productionSourceMap: false,
  transpileDependencies: ['vux'],
  devServer: {
    port: 8888, // 端口号
    host: '0.0.0.0',
    https: false, // https:{type:Boolean}
    open: false, // 配置自动启动浏览器
    // proxy: 'http://localhost:4000' // 配置跨域处理,只有一个代理
    proxy: {
      '/api': {
        target: 'http://10.1.150.75:29093',
        ws: true,
        changeOrigin: true
      }
    }
  },
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: IS_PROD,
    // 开启 CSS source maps?
    sourceMap: true,
    // css预设器配置项
    loaderOptions: {
      postcss: {
        // options here will be passed to postcss-loader
        plugins: [
          require('postcss-px2rem')({
            remUnit: 100
          })
        ]
      }
    },
    // 启用 CSS modules for all css / pre-processor files.
    modules: false
  },
  configureWebpack: config => {
    config.externals = {
      'AMap': 'AMap',
      'echarts': 'echarts'
    }
  }
}
