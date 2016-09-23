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
        preLoaders: [
            {
                test: /src\/bots\/.*\.js$/,
                loader: "eslint-loader"
            }
        ],
        loaders: [
            {
                test: /src\/.*\.js$/,
                loader: "babel",
                query: {
                    presets: ["es2015"],
                    plugins: ["transform-object-rest-spread"]
                }
            }
        ]
    },
    plugins: []
}
