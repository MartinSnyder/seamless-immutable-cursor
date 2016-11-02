const webpack = require('webpack');

module.exports = {
    entry:  './src/index.jsx',
    devtool: 'cheap-source-map',
    output: {
        path:       '/',
        publicPath: 'http://localhost:8080/',
        filename:   'bundle.js'
    },
    resolve: {
        // Needed to require .jsx files without specifying the suffix
        // http://discuss.babeljs.io/t/es6-import-jsx-without-suffix/172/2
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [{
            test: /.jsx?$/,
            loader: 'babel',
            exclude: /node_modules/,
            query: {
                presets: 'es2015'
            }
        },
        {
            test: /.jsx?$/,
            loader: 'babel',
            exclude: /node_modules/,
            query: {
                // Needed to handle 'npm link'ed modules
                // http://stackoverflow.com/questions/34574403/how-to-set-resolve-for-babel-loader-presets/
                presets: ['babel-preset-es2015', 'babel-preset-react', 'babel-preset-react-hmre'].map(require.resolve)
            }
        }]
    }
};
