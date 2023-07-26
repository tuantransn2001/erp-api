require("dotenv").config();
const path = require("path");
const CleanPlugin = require("clean-webpack-plugin");
const nodeExternals = require("webpack-node-externals");
const FileManagerPlugin = require("filemanager-webpack-plugin");

const _v = process.env.APP_VERSION;

module.exports = {
  target: "node",
  mode: "development",
  watch: true,
<<<<<<< HEAD
  entry: ["./src/app.ts", "./src/api/v1/models/index.ts"],
=======
  entry: [`./src/api/v${_v}/server.ts`, `./src/api/v${_v}/models/index.ts`],
>>>>>>> dev/api-v2
  devServer: {
    static: [
      {
        directory: path.join(__dirname),
      },
    ],
  },
  output: {
    filename: "server.js",
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
<<<<<<< HEAD
              source: "./src/api/v1/models/*.ts*",
              destination: "./build/development/models/",
=======
              source: `./src/api/v${_v}/models/*.ts*`,
              destination: `./build/development/models/`,
>>>>>>> dev/api-v2
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
