'use strict';
//引入模块
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
//引入插件
const NgAnnotatePlugin = require('ng-annotate-webpack-plugin'); //NG自动注入注解插件
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin'); // 删除插件
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

// 目录路径
const srcDir = path.resolve(process.cwd(), 'modules');
const distDir = path.resolve(process.cwd(), 'dist');

// 入口文件对象
let entries = (() => {
    let jsDir = path.resolve(srcDir, 'js');
    let entryFiles = glob.sync(jsDir + '/*.{js,jsx}');
    let map = {};

    entryFiles.forEach((filePath) => {
        let filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
    //热更新,只能监听js
        map[filename] = ['webpack-dev-server/client?http://dev-houtai.siruijk.com:80', filePath];
    })

    return map;
})()

// 自动生成入口html文件，入口js名必须和入口文件名相同
let generateHtmlplugins = (() => {
    // 获得所有页面
    let loginHtml = glob.sync(path.resolve(process.cwd(), 'login.html')).concat(glob.sync(path.resolve(process.cwd(), 'main.html')));
    let entryHtml = glob.sync(srcDir + '/**/*.html').concat(glob.sync(path.resolve(process.cwd(), 'component') + '/**/*.html')).concat(loginHtml);

    let generateHtml = [];

    entryHtml.forEach((filePath) => {
        let filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
        let conf = {
            template: filePath,
            filename: filename + '.html'
        };

        //打包对应js
        if (filename in entries) {
            conf.inject = 'body';
            conf.chunks = ['vendor', filename];
        } else {
            conf.inject = 'body';
            conf.chunks = [];
        }

        generateHtml.push(new HtmlWebpackPlugin(conf));
    });
    // 入口index页面不在同个目录下，独立处理
    generateHtml.push(new HtmlWebpackPlugin({
        template: __dirname + '/index.html',
        filename: 'index.html',
        inject: 'body',
        chunks: ['vendor', 'index']
    }));
    return generateHtml;
})();

module.exports = {
    // 生成Source Maps,生产环境要去除
    devtool: 'source-map',
    // 文件入口,vendor为公共类库
    entry: Object.assign({}, {
        index: ['webpack-dev-server/client?http://dev-houtai.siruijk.com:80', __dirname + '/main.js'],
        vendor: ["angular", 'angular-ui-router']
    }),
     // 多页应用，一个入口文件不能引用另一个入口文件
    // entry: Object.assign(entries, {
    //     // index: ['webpack-dev-server/client?http://127.0.0.1:8808', __dirname + '/main.js'],
    //     index: __dirname + '/main.js',
    //     vendor: [__dirname + '/libs/js/jquery/jquery', __dirname + '/libs/js/underscore/underscore']
    // }),
    // 文件出口
    output: {
        path: distDir,
        publicPath: '', //资源服务器路径
        filename: 'js/[name]-[chunkhash:8].js',
        chunkFilename: 'js/[name]-[chunkhash:8].js'
    },
    // 本地服务器配置
    devServer: {
        hot: true,
        host: "dev-houtai.siruijk.com",
        port: 80,
        colors: true,
        inline: true,
        progress: true,        
        historyApiFallback: true
    },

    // loaders
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel',
            query: {
                presets: ['es2015']
            }
        }, { //外链
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader!postcss-loader")
        }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract('style-loader', 'css-loader') //css文件单独生成到dist/css目录下
        }, {
            test: /\.html$/,
            loader: 'html-loader'
        }, {
            test: /\.(png|jpg|jpeg|gif)$/,
            loader: 'url-loader?limit=8192&name=/img/[name].[ext]' //图片拷贝到dist/img目录下
        }, { //字体加载器
            test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'url?limit=10000&mimetype=application/font-woff'
        }, {
            test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'url?limit=10000&mimetype=application/octet-stream'
        }, {
            test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'file'
        }, {
            test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
            loader: "url?limit=10000&mimetype=image/svg+xml"
        }, ]
    },
    postcss: function() {
        return [autoprefixer()];
    },
    // 插件
    plugins: [
        // 独立CSS
        new ExtractTextPlugin('css/[name]-[chunkhash:8].css', {
            allChunks: true
        }),
        // 独立类库js
        new CommonsChunkPlugin('vendor', '' + 'js/[name]-[hash].js', Infinity),
        new NgAnnotatePlugin({
            add: true
        }),
        // 打开浏览器
        new OpenBrowserPlugin({url: 'http://dev-houtai.siruijk.com'}),
        // 热更新
        new webpack.HotModuleReplacementPlugin()
    ].concat(generateHtmlplugins),
    // 配置babel
    babel: {
        "presets": ["es2015", 'stage-0'],
    },
    // 别名，扩展名
    resolve: {
        alias: {},
        extensions: ['', '.js', '.css', '.png', 'jpg']
    },
    // 外部类库,不在重复打包
    externals: {

    }
}
