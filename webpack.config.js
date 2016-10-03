var webpack = require("webpack");

module.exports = {
    entry: {
        application: "./src/application"
    },
    output: {
        path: __dirname + "/build",
        filename: "[name].js"
    },
    eslint: {
        configFile: "bots.eslintrc"
    },
    module: {
        //preLoaders: [
        //    {
        //        test: /src\/bots\/.*\.js$/,
        //        loader: "eslint-loader"
        //    }
        //]
    },
    plugins: []
}
