'use strict';
require('./index.css');
var _mm     = require('util/mm.js');
var _user   =require('service/user-service.js');

var nav={
   init:function () {
      this.bindEvent();
      this.loadUserInfo();
      return this;
   },
   bindEvent:function () {
      //登录点击事件
      $(".js-login").click(function () {
         _mm.doLogin();
      });
      //注册点击事件
      $('.js-register').click(function () {
         window.location.href='./user-register.html';
      });
      //退出点击事件
      $(".js-logout").click(function () {
         _user.logout(function (res) {
            window.location.reload();
         },function (errMsg) {
            _mm.errorTip(errMsg);
         });
      });
   },
   // 加载用户信息
   loadUserInfo : function(){
      _user.checkLogin(function(res){
         $('.user.not-login').hide().siblings('.user.login').show()
            .find('.username').text(res.username);
      }, function(errMsg){
         // 什么也不做
      });
   },
};
module.exports=nav.init();