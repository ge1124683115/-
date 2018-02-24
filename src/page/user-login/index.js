/*
* @Author: Administrator
* @Date:   2018-02-03 22:39:40
* @Last Modified by:   Administrator
* @Last Modified time: 2018-02-04 10:23:19
*/
'use strict';
require('./index.css');
require('page/common/nav-simple/index.js');
var _user=require('service/user-service.js');
var _mm=require('util/mm.js');

//表单的错误提示
var formError={
   show : function (errMsg) {
      $('.error-item').show().find('.err-msg').text(errMsg);
   },
   hide : function () {
      $(".error-item").hide().find('.err-msg').text('');
   }
}
var page={
   init:function () {
      this.bindEvent();
   },
   bindEvent:function () {
      var _this=this;
      $(".btn-submit").click(function () {
         _this.submit();
      });
      $(".user-content").keyup(function (e) {
         if(e.keyCode===13){
            _this.submit();
         }
      })
   },
   //提交表单
   submit:function () {
      var formData={
         username:$.trim($('#username').val()),
         password:$.trim($("#password").val())
      },
         //表单验证结果
         validateResult=this.formValidate(formData);
      //验证成功
      if(validateResult.status){
         _user.login(formData,function (res) {
            window.location.href = _mm.getUrlParam('redirect')||'./demo.html';
         },function (errMsg) {
            formError.show(errMsg);
         });
      }else{
         formError.show(validateResult.msg);
      }
   },
   //表单字段的验证
   formValidate:function (formData) {
      var result={
         status:false,
         msg:''
      };
      if(!_mm.validate(formData.username,'require')){
         result.msg='用户名不能为空';
         return result;
      }
      if(!_mm.validate(formData.password,'require')){
         result.msg='密码不能为空';
         return result;
      }
      //通过验证，返回正确结果
      result.status = true;
      result.msg = '验证通过';
      return result;
   }
}
$(function () {
   page.init();
});

