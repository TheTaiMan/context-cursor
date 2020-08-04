const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackMd5Hash = require("webpack-md5-hash");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

const { prod_Path, src_Path, preview_Path } = require("./path");
const { selectedPreprocessor } = require("./loader");

module.exports = {
  entry: {
    main: "./" + preview_Path + "/test.ts",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    path: path.resolve(__dirname, prod_Path),
    filename: "[name].[chunkhash].js",
  },
  //devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: ["file-loader", "svg-transform-loader"],
      },
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: selectedPreprocessor.fileRegexp,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
          },
          {
            loader: "postcss-loader",
          },
          {
            loader: selectedPreprocessor.loaderName,
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(path.resolve(__dirname, prod_Path), {
      root: process.cwd(),
    }),
    new MiniCssExtractPlugin({
      filename: "style.css",
    }),
    new HtmlWebpackPlugin({
      inject: false,
      hash: true,
      template: "./" + preview_Path + "/index.html",
      filename: "../index.html",
    }),
    new WebpackMd5Hash(),
  ],
};
