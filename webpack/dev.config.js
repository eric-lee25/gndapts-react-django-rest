const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    devtool: 'eval',

    entry: {
        app: [
                  'react-hot-loader/patch',

        ],
        vendor: [
            'font-awesome-webpack!./src/static/styles/font-awesome.config.js'
        ]
    },

    module: {
        loaders: [{
            test: /\.scss$/,
            loader: 'style-loader!css-loader?localIdentName=[path][name]--[local]!postcss-loader!sass-loader',
        }],
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"development"',
            },
            __DEVELOPMENT__: true,
        }),
        new ExtractTextPlugin('styles/[name].[contenthash].css'),
    ],
     devServer: {
         hot: true,
         contentBase: './src/static',
         proxy: {
               '/api': {
                   target: 'http://localhost:8000/',
                         }
         }

     }
};
