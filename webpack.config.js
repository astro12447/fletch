const path = require('path');

module.exports = {
  mode: 'development', // или 'production' в зависимости от цели сборки
  devtool: 'source-map', // включение карт источников для отладки
  entry: path.resolve(__dirname, 'src', 'index.ts'), // использование path для точки входа
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist') // использование path для выходного каталога
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  }
};