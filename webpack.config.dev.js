require("dotenv").config();
const path = require("path");
const CleanPlugin = require("clean-webpack-plugin");
const nodeExternals = require("webpack-node-externals");
const FileManagerPlugin = require("filemanager-webpack-plugin");

const app_version = process.env.APP_VERSION;

module.exports = {
  target: "node",
  mode: "development",
  watch: true,
  entry: [
    `./src/api/v${app_version}/app.ts`,
    `./src/api/v${app_version}/models/index.ts`,
  ],
  devServer: {
    static: [
      {
        directory: path.join(__dirname),
      },
    ],
  },
  output: {
    filename: "app.js",
    path: path.resolve(__dirname, `build/development/`),
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  externals: [nodeExternals()],
  plugins: [
    new CleanPlugin.CleanWebpackPlugin(),
    new FileManagerPlugin({
      events: {
        onEnd: {
          copy: [
            {
              source: `./src/api/v${app_version}/models/*.ts*`,
              destination: `./build/development/models/`,
              globOptions: {
                ignore: `./src/api/v${_v}/models/index.ts`,
              },
            },
          ],
        },
      },
    }),
  ],
};
