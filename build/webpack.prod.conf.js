const TerserPlugin = require('terser-webpack-plugin')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')

module.exports = merge(baseWebpackConfig, {
  entry: './src/index.ts',
  output: {
    filename: 'vue-music-play.js',
    library: 'vueMusicPlay',
    libraryTarget: 'umd',
    globalObject: 'typeof self !== \'undefined\' ? self : this'
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        sourceMap: false
      })
    ]
  }
})
