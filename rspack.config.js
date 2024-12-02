import path from "path";
import pkg from "@rspack/core"; // 使用默认导入
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename); // 获取当前目录

export default {
  entry: {
    background: "./src/background/index.ts",
    popup: "./src/popup/index.ts",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new pkg.CopyRspackPlugin({
      // 使用默认导入
      patterns: [{ from: "public", to: "." }],
    }),
  ],
};
