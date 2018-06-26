import webpack from 'webpack'
import UglifyJsPlugin from 'uglifyjs-webpack-plugin'
import path from 'path'


const { NODE_ENV } = process.env

const plugins = [
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.EnvironmentPlugin(['NODE_ENV']),
]

const filename = `redux-execue${NODE_ENV === 'production' ? '.min' : ''}.js`

if (NODE_ENV === 'production') {
  plugins.push(new UglifyJsPlugin({
    uglifyOptions: {
      compressor: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        screw_ie8: true,
        warnings: false,
      },
    },
  }))
}

export default {
  mode: NODE_ENV === 'production' ? 'production' : 'development',
  context: path.resolve(__dirname, 'src'),
  entry: './index.js',

  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
    ],
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename,
    library: 'ReduxExecue',
    libraryTarget: 'umd',
  },

  plugins,
}
