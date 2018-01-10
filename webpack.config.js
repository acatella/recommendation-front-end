const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const resolveApp = (relativePath) => path.resolve(__dirname, relativePath);

module.exports = (env = "production") => {

  const config = {
    entry: resolveApp("src/index.js"),
    output: {
      filename: "[name].[chunkhash].js",
      path: resolveApp("dist"),
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: resolveApp("public/index.html"),
      }),
      new HtmlWebpackPlugin({
        template: resolveApp("public/about.html"),
        filename: "about/index.html",
      }),    
    ],
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          loader: "babel-loader",
        },
        {
          test: /\.(png|jpg|gif)$/,
          loader: "file-loader?name=images/[name].[hash].[ext]",
        },
        {
          test: /\.css$/,
          loader: "file-loader?name=styles/[name].[hash].[ext]",
        },
        {
          test: /\.html$/,
          loader: "html-loader?attrs=link:href img:src",
        },
      ],
    }
  };

  if (env === "development") {
    config.devtool = "inline-source-map";
    config.devServer = {
      contentBase: "./dist",
    };
  }

  return config;
};
