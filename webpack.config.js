var glob = require('glob'),
	path = require('path'),
	htmlWebpackPlugin = require('html-webpack-plugin'),
	autoprefixer = require('autoprefixer'),
	plugins = [],
	webpack = require('webpack'),
	conf = {
		entry: getEntry('./app/module/**/*.js'),
		output: {
			path: __dirname + '/dist',
			filename: '[name].js'
		},
		plugins: [
			// js压缩
			new webpack.optimize.UglifyJsPlugin()
		],
		devServer: {
			contentBase: "./dist",//本地服务器所加载的页面所在的目录
		    historyApiFallback: true,//不跳转
		    inline: true//实时刷新
		},
		module: {
			rules: [
				{
					test: /\.js/,
        			loader: 'babel-loader',
        			exclude: /node_modules/
				},
				{
					test: /\.css/,
					use: [
						{
							loader: 'style-loader'
						},{
							loader: 'css-loader'
						},{
							// postcss来为CSS代码自动添加适应不同浏览器的CSS前缀。autoprefixer自动添加前缀
							loader: "postcss-loader",
							options: {
			                	sourceMap: true,
				                plugins: () => [autoprefixer({ browsers: ['iOS >= 7', 'Android >= 4.1'] })],
				            },
						}
					]
				}
			]
		},
		resolve: {
			alias: {
				'@': path.join(__dirname, 'app')
			}
		}
	}

// var pages = getEntry('./app/module/**/*.html')
// console.log("page:", pages)
// 生成html
glob.sync('./app/module/**/*.html').forEach(function(e) {
	var basename = path.dirname(e)
	basename = basename.split('/')
	basename.splice(0, 2)
	basename = basename.join('/')
	var filename = path.basename(e, path.extname(e))
	filename = basename + '/' + filename
	conf.plugins.push(new htmlWebpackPlugin({
		// 输出文件夹
		path: __dirname + '/dist',
		// 文件名
		filename: filename + '.html',
		// 模版文件
		template: e,
		// 
		inject: true,
		minify: { //传递 html-minifier 选项给 minify 输出
	      removeComments: true
	    },
		chunks: [filename]
	}))
})

module.exports = conf

// 多入口配置
function getEntry(globPath){
  	var entries = {},
    	basename, 
    	tmp, 
    	pathname;
	glob.sync(globPath).forEach(function (entry) {
		basename = path.basename(entry, path.extname(entry))
	    tmp = entry.split('/').splice(-3)
	    tmp.splice(tmp.length-1, 1)
	    // console.log(tmp)
	    pathname = tmp.join('/') + '/' + basename // 正确输出js和html的路径
	    // console.log(pathname)
	    entries[pathname] = entry
	});
	console.log("entrys:",entries)
	return entries
}
