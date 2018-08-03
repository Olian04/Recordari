
/**
  Defines a Record for the majority of the webpack.config.js spec
*/
const RWebpackConfig = R('webpack.config.js', {
  mode: R.String.Either(["production", "development", "none"]),
  entry: R.or([
    R.String,
    R.Array.Each.String,
    R.Object.Values.Each.or([
      R.String,
      R.Array.Each.String
    ])
  ]),
  output: {
    path: R.String,
    filename: R.String,
    publicPath: R.String,
    library: R.String,
    libraryTarget: R.String.Either([
      'umd', 'umd2', 'commonjs2', 'commonjs',
      'amd', 'this', 'var', 'assign', 
      'window', 'global', 'jsonp'
    ])
  },
  module: {
    rules: R.Array.Each.Object.Like({
      test: R.Regex,
      include: R.Array.Each.String,
      exclude: R.optional.Array.Each.String,
      enforce: R.optional.String,
      enforce: R.optional.String,
      loader: R.String,
      options: R.optional.Object.Like({
        presets: R.Array.String
      })
    })
  },
  resolve: {
    modules: R.Array.Each.String,
    extensions: R.Array.Each.String,
    alias: R.optional.and([
      R.Object.Keys.Each.String,
      R.Object.Values.Each.String
    ]),
  },
  performance: {
    hints: R.or([
      R.String.Either(["warning", "error"]),
      R.Boolean.False
    ]),
    maxEntrypointSize: R.Number.Natural,
    assetFilter: R.and([
      R.Function.Arguments.Length.Exact(1),
      R.Function.Test('demo').String
    ])
  },
  devtool: R.String.Either([
    "source-map", "inline-source-map", "eval-source-map",
    "hidden-source-map", "cheap-source-map", 
    "cheap-module-source-map", "eval"
  ]),
  context: R.String,
  target: R.or([
    R.String.Either([
      "web", "webworker", "node",
      "async-node", "node-webkit",
      "electron-main", "electron-renderer"
    ]),
    R.Function.Arguments.Length.Exact(1)
  ]),
  externals: R.or([
    R.Array.Each.or([
      R.String, R.Regex
    ]),
    R.String,
    R.Regex,
    R.Object.Keys.Each.or([
      R.String,
      R.Object
    ]),
    R.and([
      R.Function.Arguments.Length.Exact(1),
      R.Function.Test('demo').String
    ])
  ]),
  serve: {
    port: R.Number,
    content: R.String
  },
  stats: R.or([
    R.String,
    R.Object.Keys.Each.Boolean
  ]),
  devServer: R.Object,
  plugins: R.Array
}
