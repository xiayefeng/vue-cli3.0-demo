
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const path = require('path')
const isProd = process.env.NODE_ENV === 'production'
const cdn = require('./cdn.js')

let isOpenMock = false
isProd && (isOpenMock = false)

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: '/',
  productionSourceMap: false,
  lintOnSave: !isProd,
  // 启用并行化 默认并发运行数： os.cups().length -1 并行化可以显著加速构建
  parallel: require('os').cpus().length > 1,
  // ouputDir: 'dist',

  configureWebpack: config => {
    const plugins = []
    if (isProd) {
      plugins.push(
        new CompressionPlugin({
          test: /\.js$|\.html$|\.css$/, // 匹配的文件名
          threshold: 8192, // 对 超过8K的数据进行压缩
          deleteOriginalAssets: false, // 是否删除源文件
          minRatio: 0.8 // 压缩率 只有压缩率比这个值小的资源才会被处理
        })
      )

      plugins.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              drop_debugger: true,
              drop_console: true
            }
          },
          sourceMap: false,
          // 多进程并行运行 提高打包速度
          parallel: true
        })
      )
    }
    return {
      plugins
    }
  },

  chainWebpack: config => {
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    types.forEach(type => addStyleResource(config.module.rule('scss').oneOf(type)))

    // svg
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .include
      .add(resolve('src/assets/svg-icons/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'ph-[name]'
      })
      .end()

    config.plugin('html')
      .tap(args => {
        if (isProd) {
          args[0].cdn = cdn.prod
        } else if (process.env.NODE_ENV === 'development') {
          args[0].cdn = cdn.dev
        }
        return args
      })

    config
      // 开发环境
      .when(process.env.NODE_ENV === 'development',
        // sourcemap不包含列信息
        config => config.devtool('cheap-source-map')
      ).when(isProd, config => {
        if (process.env.npm_config_report) {
          config.plugin('webpack-bundle-analyzer')
            .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
            .end()
        }
      })

    // image exclude
    const imagesRule = config.module.rule('images')
    imagesRule
      .test(/\.(png|jpe?g|gif|webp|svg)(\?.*)?$/)
      .exclude
      .add(resolve('src/assets/svg-icons/icons'))
      .end()

    // 代码分割
    config.optimization.splitChunks({
      chunks: 'all'
    })

    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('utils', resolve('src/utils'))
      .set('plugin', resolve('src/plugin'))
      .set('components', resolve('src/components'))

    const entry = config.entry('app')
    if (isOpenMock) {
      entry
        .add('@/mock')
        .end()
    }

    config.externals(cdn.externals)
  },

  devServer: {
    port: 8081,
    compress: false,
    proxy: {
      '/api': {
        target: 'url',
        ws: true,
        changeOrigin: true, // 是否允许跨域
        pathRewrite: { '^/api': '/' }
      }
    }
  },
  /*  css: {
    extract: true,
    sourceMap: false,
    loaderOptins: {
      sass: {
        data: `@import "@/style/_variables.scss"`
      }
    },
    modules: false
  }, */

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: []
    }
  }
}

function addStyleResource (rule) {
  rule.use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        path.resolve(__dirname, './src/style/_variables.scss'),
        path.resolve(__dirname, './src/style/mixin.scss')
      ]
    })
}
