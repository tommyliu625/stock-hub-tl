const isDev = process.env.NODE_ENV === 'development'
const path = require('path')

// module.exports = {
//   entry: ['babel-polyfill', './client/index.js'],
//   output: {
//     path: __dirname,
//     filename: './public/bundle.js',
//   },
//   mode: 'development',
//   devtool: 'source-map',
//   module: {
//     rules: [
//       {
//         test: /\.jsx?$/,
//         include: [path.resolve(__dirname, 'client')],
//         loader: 'babel-loader',
//       },
//       {
//         test: /\.css$/,
//         use: ['style-loader', 'css-loader'],
//       },
//     ],
//   },
// }

module.exports = {
  mode: isDev ? 'development' : 'production',
  node: {
    fs: 'empty',
  },
  entry: [
    '@babel/polyfill', // enables async-await
    './client/index.js',
  ],
  output: {
    path: __dirname,
    filename: './public/bundle.js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devtool: 'source-map',
  watchOptions: {
    ignored: /node_modules/,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
}
