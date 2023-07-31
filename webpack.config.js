const path = require("path");

module.exports = {
  entry: {
    1: path.resolve(__dirname, "src/1/index.js"),
    2: path.resolve(__dirname, "src/2/index.js"),
    3: path.resolve(__dirname, "src/3/index.js"),
  },

  output: {
    path: path.resolve(__dirname),
    filename: "src/[name]/bundle.js",
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "src"),
    },
    compress: true,
    port: 9000,
  },
};
