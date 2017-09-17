const path = require("path");

/* Configure HTMLWebpack plugin */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
    template: __dirname + '/src/index.html',
    filename: 'index.html',
    inject: 'body'
});

const Dashboard = require('webpack-dashboard');
const DashboardPlugin = require('webpack-dashboard/plugin');

/* Export configuration */
module.exports = {
    devtool: 'inline-source-map', // Needed for webpack-dev-server to not break sourcemaps on reload
    devServer: {
        compress: true,
        inline: true,
        open: true,
        historyApiFallback: true,
        hot: true,
        quiet: true
    },
    entry: [
        './src/main.ts'
    ],
    output: {
        path: path.join(__dirname, './dist'),
        filename: 'index.js'
    },
    resolve: {
        alias: {
            'three-examples': path.join(__dirname, './node_modules/three/examples/js')
        },
        extensions: [".web.ts", ".web.js", ".ts", ".js"]
    },
    module: {
        rules: [
            {
                test: /three\/examples\/js.*/,
                use: ['ts-loader', 'imports-loader?THREE=three']
            },
            {
                test: /\.ts$/,
                loader: 'ts-loader'
            }
        ]
    },
    plugins: [HTMLWebpackPluginConfig, new DashboardPlugin({handler: new Dashboard().setData})]
};
