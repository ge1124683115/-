'use strict';
require('./index.css');
require('page/common/nav-simple/index.js');
var _user=require('service/user-service.js');
var _mm=require('util/mm.js');

//表单的错误提示
var formError={
   show:function (errMsg) {
      $('.error-item').show().find('.err-msg').text(errMsg);
   },
   hide:function () {
      $('.error-item').hide().find('.err-msg').text('');
   }
};

var page={
   data:{
      username:'',
      question:'',
      answer  :'',
      token   :''
   },
   init:function () {
      this.bindEvent();
      this.onLoad();
   },
   onLoad:function () {
      this.loadStepUsername();
   },
   bindEvent:function () {
      var _this=this;
      //进行找回密码的第一步
      $("#submit-username").click(function () {
         var username=$.trim($("#username").val());
         if(username){
            _user.getQuestion(username,function (res) {
               _this.data.username=username;
               _this.data.question=res;
               _this.loadStepQuestion();
            },function (errMsg) {
               formError.show(errMsg);
            });
         }else{
            formError.show('请输入用户名');
         }
      });
      //找回密码的第二步
      $("#submit-question").click(function () {
         var answer=$.trim($("#answer").val());
         if(answer){
            //对密码提示问题的答案进行检查
            _user.checkAnswer({
               username:_this.data.username,
               question:_this.data.question,
               answer  :_this.data.answer
            },function (res) {
               _this.data.answer=answer;
               _this.data.token =res;
               _this.loadStepPassword();
            },function (errMsg) {
               formError.show(errMsg);
            });
         }else{
            formError.show('请输入密码提示问题的答案');
         }
      });
      //找回密码的第三步
      $('#submit-password').click(function () {
         var password=$.trim($("#password").val());
         if(password&&password.length>=6){
            //对密码进行重置
            _user.resetPassword({
               username    :_this.data.username,
               passwordNew :password,
               forgetToken :_this.data.token
            },function (res) {
               window.location.href='./result.html?type=pass-reset';
            },function (errMsg) {
               formError.show(errMsg);
            });
         }else{
            formError.show('请至少输入6位数的密码');
         }
      });
   },
   //找回密码的第一步
   loadStepUsername:function () {
      $('.step-username').show();
   },
   //找回密码的第二步
   loadStepQuestion:function () {
      // 清除错误提示
      formError.hide();
      $('.step-username').hide().siblings('.step-question').show()
         .find('.question').text(this.data.question);
   },
   //找回密码的第三步
   loadStepPassword:function () {
      //清除错误提示
      formError.hide();
      //对容器进行切换
      $('.step-question').hide().siblings('.step-password').show();
   }
};

$(function () {
   page.init();
});