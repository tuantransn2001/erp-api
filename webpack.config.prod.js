require("dotenv").config();
const path = require("path");
const CleanPlugin = require("clean-webpack-plugin");
const nodeExternals = require("webpack-node-externals");
const FileManagerPlugin = require("filemanager-webpack-plugin");

const _v = process.env.APP_VERSION;

module.exports = {
  target: "node",
  mode: "production",
  watch: true,
  entry: [`./src/api/v${_v}/server.ts`, `./src/api/v${_v}/models/index.ts`],
  devServer: {
    static: [
      {
        directory: path.join(__dirname),
      },
    ],
  },
  output: {
    filename: "server.js",
    path: path.resolve(__dirname, `build/production/`),
>>>>>>> dev/api-v2
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
<<<<<<< HEAD
              source: "./src/api/v1/models/*.ts*",
              destination: "./build/production/v1/models/",
              globOptions: {
                ignore: "./src/api/v1/models/index.ts",
=======
              source: `./src/api/v${_v}/models/*.ts*`,
              destination: `./build/production/models/`,
              globOptions: {
                ignore: `./src/api/v${_v}/models/index.ts`,
>>>>>>> dev/api-v2
              },
            },
          ],
        },
      },
    }),
  ],
};
