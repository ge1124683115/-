'use strict';
//新版本的hogan的引入方式
var Hogan = require('hogan.js');
var conf={
   serverHost :''  //接口地址和当前的静态文件地址相同
}
var _mm={
   //网络请求
   request:function (param) {
      var _this=this;
      $.ajax({
         type       :param.method ||'get',
         url        :param.url    ||'',
         dataType   :param.type   ||'json',
         data       :param.data   ||'',
         success    :function (res) {
            //请求成功
            if(0===res.status){
               typeof param.success ==='function' &&param.success(res.data,res.msg);
            }
            //没有登录状态，需要进行强制登录
            else if(10===res.status){
               _this.doLogin();
            }
            //请求数据错误
            else if(1===res.status){
               typeof param.error==='function'&&param.error(res.msg);
            }
         },
         error      :function (err) {
            typeof param.error==='function'&&param.error(err.statusText);
         }
      });
   },
   //获取服务器地址
   getServerUrl:function (path) {
      return conf.serverHost+path;
   },
   //获取url参数
   getUrlParam:function (name) {
      //关键字前是空或者&，后面一直匹配多个不是&，以&结尾或者匹配结束
      var reg    =new RegExp('(^|&)'+name+'=([^&]*)(&|$)');
      var result =window.location.search.substr(1).match(reg);//将此字符串的问号去掉
      return result ? decodeURIComponent(result[2]):null;
   },
   //渲染html模版，作用是将传入的数据和模版进行拼接
   renderHtml : function(htmlTemplate, data){
      var template    = Hogan.compile(htmlTemplate),
         result      = template.render(data);
      return result;
   },
   //成功提示
   successTip :function (msg) {
      alert(msg||'操作成功');
   },
   errorTip :function (msg) {
      alert(msg||'操作失败');
   },
   //字段的验证，验证手机、邮箱等是否为空
   validate:function (value, type) {
      //将传入进来的数据的前后空格去掉，包括将传入的非字符串改成字符串
      var value=$.trim(value);
      if('require'===type){
         return !!value; //非空验证，将value的值强行转成boole
      }
      //手机号验证
      if('phone'===type){
         return /^1\d{10}$/.test(value);
      }
      //邮箱验证
      if('email'===type){
         return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value);
      }
   },
   //统一登录处理、统一跳转
   doLogin:function () {
      window.location.href='./user-login.html?redirect='+encodeURIComponent(window.location.href);
   },
   //跳转到主页
   goHome:function () {
      window.location.href='./index.html';
   }
}
module.exports=_mm;
