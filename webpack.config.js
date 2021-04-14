const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {
  VueLoaderPlugin
} = require('vue-loader')
module.exports = {
  entry: './src/index.js',
  mode: 'development',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [{
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.vue$/i,
        loader: 'vue-loader'
      }
    ],
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'subsvue',
      template: './src/index.html',
      inject: false
    }),
    new VueLoaderPlugin()
  ]
};
