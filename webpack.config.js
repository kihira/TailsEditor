const path = require("path");

/* Configure HTMLWebpack plugin */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
    template: __dirname + '/src/index.html',
    filename: 'index.html',
    inject: 'body'
});

/* Configure BrowserSync */
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const BrowserSyncPluginConfig = new BrowserSyncPlugin({
    host: 'localhost',
    port: 3000,
}, config = {
    reload: false
});

/* Export configuration */
module.exports = {
    devtool: 'source-map',
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
    plugins: [HTMLWebpackPluginConfig, BrowserSyncPluginConfig]
};
