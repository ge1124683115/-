/*
* @Author: Administrator
* @Date:   2018-02-03 22:15:51
* @Last Modified by:   Administrator
* @Last Modified time: 2018-02-04 10:50:06
*/
const path            = require('path');
var webpack           = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require("html-webpack-plugin");
//环境变量的配置
var WEBPACK_ENV       = process.env.WEBPACK_ENV ||'dev';
console.log(WEBPACK_ENV);
//获取到html-webpack-plugin参数的方法
var getHtmlConfig = function (name,title) {
   return{
      template : './src/view/'+name+'.html',
      filename : 'view/'+name+'.html',
      title    : title,
      inject   : true,
      hash     : true,
      chunks   : ['common',name]
   };
};

var config = {
	entry: {
		'common'             : ['./src/page/common/index.js'],
		'index'              : ['./src/page/index/index.js'],
      'list'               : ['./src/page/list/index.js'],
      'detail'             : ['./src/page/detail/index.js'],
      'cart'               : ['./src/page/cart/index.js'],
      'order-confirm'      : ['./src/page/order-confirm/index.js'],
      'order-list'         : ['./src/page/order-list/index.js'],
      'order-detail'       : ['./src/page/order-detail/index.js'],
      'payment'            : ['./src/page/payment/index.js'],
		'user-login'         : ['./src/page/user-login/index.js'],
      'user-register'      : ['./src/page/user-register/index.js'],
      'user-pass-reset'    : ['./src/page/user-pass-reset/index.js'],
      'user-center'        : ['./src/page/user-center/index.js'],
      'user-center-update' : ['./src/page/user-center-update/index.js'],
      'user-pass-update'   : ['./src/page/user-pass-update/index.js'],
      'result'             : ['./src/page/result/index.js']
	},
	output: {
		filename: 'js/[name].js',
		path: path.resolve(__dirname, 'dist'),
      publicPath :'/dist'
	},
	externals: {
		'jquery':'window.jQuery'
	},
	module: {
	    loaders: [
	        {
	           test: /\.css$/,
              loader:  ExtractTextPlugin.extract({
                 fallback: 'style-loader',
                 use: 'css-loader'
              })
           },
           { test: /\.(gif|png|jpg|woff|svg|eot|ttf)\??.*$/, loader: 'url-loader?limit=100&name=resource/[name].[ext]' },
          {test:/\.string$/,loader:'html-loader'}
	    ]
	},
   resolve: {
	   alias : {
	      util         : __dirname +'/src/util',
         page         : __dirname +'/src/page',
         service      : __dirname +'/src/service',
         image        : __dirname +'/src/image',
         node_modules : __dirname +'/node_modules'
      }
   },
	plugins: [
	   //独立通用模块到js/base.js中
		new webpack.optimize.CommonsChunkPlugin({
			name: "common",
			filename: 'js/base.js'
		}),
      //把css单独打包到文件中
		new ExtractTextPlugin("css/[name].css"),
      //html模版的处理
      new HtmlWebpackPlugin(getHtmlConfig('index','首页')),
      new HtmlWebpackPlugin(getHtmlConfig('list','商品列表')),
      new HtmlWebpackPlugin(getHtmlConfig('detail','商品详情页')),
      new HtmlWebpackPlugin(getHtmlConfig('cart','购物车页面')),
      new HtmlWebpackPlugin(getHtmlConfig('order-confirm','订单确认')),
      new HtmlWebpackPlugin(getHtmlConfig('order-list','订单列表')),
      new HtmlWebpackPlugin(getHtmlConfig('order-detail','订单详情')),
      new HtmlWebpackPlugin(getHtmlConfig('payment','订单支付')),
      new HtmlWebpackPlugin(getHtmlConfig('user-login','用户登录')),
      new HtmlWebpackPlugin(getHtmlConfig('user-register','用户注册')),
      new HtmlWebpackPlugin(getHtmlConfig('user-pass-reset','密码找回')),
      new HtmlWebpackPlugin(getHtmlConfig('user-center','个人中心')),
      new HtmlWebpackPlugin(getHtmlConfig('user-center-update','个人中心信息更新')),
      new HtmlWebpackPlugin(getHtmlConfig('user-pass-update','更改密码')),
      new HtmlWebpackPlugin(getHtmlConfig('result','操作结果'))
	]
};
// if('dev' === WEBPACK_ENV){
//    config.entry.common.push('webpack-dev-server/client?http://localhost:8080/');
// }
module.exports = config;