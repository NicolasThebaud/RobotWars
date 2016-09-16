var webpack = require("webpack");

module.exports = {
    entry: {
        application: "./src/application"
    },
    output: {
        path: __dirname + "/build",
        filename: "[name].js"
    },
    module: {
        loaders: [
            {
                test: /src\/.*\.js$/,
                loader: 'babel',
                query: {
                    presets: ['es2015'],
                    plugins: ['transform-object-rest-spread']
                }
            }
        ]
    },
    plugins: []
}
