const webpack = require('webpack');

module.exports = {
    entry:  './src/index.js',
    devtool: 'cheap-source-map',
    output: {
        path:       '/',
        publicPath: 'http://localhost:8080/',
        filename:   'bundle.js'
    },
    module: {
        rules: [{
            test: /\.m?js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['babel-preset-env']
                }
            }
        }]
    }
};
