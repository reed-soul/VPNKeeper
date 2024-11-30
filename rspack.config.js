const path = require('path');
const rspack = require('@rspack/core');

module.exports = {
  entry: {
    background: './src/background/index.ts',
    popup: './src/popup/index.ts'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new rspack.CopyRspackPlugin({
      patterns: [{ from: 'public', to: '.' }],
    }),
  ],
};
