const path = require("path");

const isDev = process.env.NODE_ENV !== "production";

module.exports = {
    mode: isDev ? "development" : "production",
    entry: path.join(__dirname, "src", "Main.jsx"),
    watch: isDev,
    output: {
        path: path.join(__dirname, "dist", "js"),
        filename: "main.js"
    },
    stats: {
      all: false,
      assets: true,
      errors: true,
      colors: true
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    }
};