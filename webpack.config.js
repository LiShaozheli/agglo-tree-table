const { ModuleFederationPlugin } = require("webpack").container;
const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "webpack-bundle.js",
    publicPath: "auto",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "agglo_tree_table",
      filename: "remoteEntry.js",
      exposes: {
        "./agglo-tree-table": "./src/index.ts",
      },
      shared: {
        react: { singleton: true, requiredVersion: "^16.0.0 || ^17.0.0 || ^18.0.0" },
        "react-dom": { singleton: true, requiredVersion: "^16.0.0 || ^17.0.0 || ^18.0.0" },
      },
    }),
  ],
};