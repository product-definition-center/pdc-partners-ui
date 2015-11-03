var path = require('path');
var webpack = require('webpack');

var PRODUCTION = process.env.NODE_ENV === 'production';

if (PRODUCTION) {
  module.exports = {
    resolve: {
      extensions: ['', '.js', '.jsx']
    },
    entry: [
      './index'
    ],
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'bundle.js',
      publicPath: '/static/'
    },
    plugins: [
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin({sourceMap: false}),
      new webpack.NoErrorsPlugin(),
      new webpack.DefinePlugin({
        DEVELOPMENT: false,
      }),
    ],
    module: {
      loaders: [{
        test: /\.jsx?$/,
        loaders: ['babel'],
        exclude: /node_modules/,
        include: __dirname
      }, {
        test: /\.css?$/,
        loaders: ['style', 'raw'],
        include: __dirname
      }, {
        test: /\.woff$/,
        loaders: ['file-loader']
      }]
    }
  };

} else {

  module.exports = {
    devtool: 'cheap-module-eval-source-map',
    resolve: {
      extensions: ['', '.js', '.jsx']
    },
    entry: [
      'webpack-hot-middleware/client',
      './index'
    ],
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'bundle.js',
      publicPath: '/static/'
    },
    plugins: [
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
      new webpack.DefinePlugin({
        DEVELOPMENT: true,
      }),
    ],
    module: {
      loaders: [{
        test: /\.jsx?$/,
        loaders: ['babel'],
        exclude: /node_modules/,
        include: __dirname
      }, {
        test: /\.css?$/,
        loaders: ['style', 'raw'],
        include: __dirname
      }, {
        test: /\.woff$/,
        loaders: ['file-loader']
      }]
    }
  };
}
