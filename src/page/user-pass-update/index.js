'use strict';
require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
var navSide         = require('page/common/nav-side/index.js');
var _mm             = require('util/mm.js');
var _user           = require('service/user-service.js');

//page 逻辑部分
var page = {
   init:function () {
      this.onLoad();
      this.bindEvent();
   },
   onLoad:function () {
      //对左侧导航菜单初始化
      navSide.init({
         name:'user-pass-update'
      });
   },
   bindEvent:function () {
      var _this=this;
      $(document).on('click','.btn-submit',function () {
         var userInfo={
               password          : $.trim($("#password").val()),
               passwordNew       : $.trim($("#password-new").val()),
               passwordConfirm   : $.trim($('#password-confirm').val())
            },
            validateResult=_this.validateForm(userInfo);
         if(validateResult.status){
            //对用户密码进行更改
            _user.updatePassword({
               passwordOld  : userInfo.password,
               passwordNew  : userInfo.passwordNew
            },function (res, msg) {
               _mm.successTip(msg);
            },function (errMsg) {
               _mm.errorTip(errMsg);
            });
         }else{
            _mm.errorTip(validateResult.msg);
         }
      });
   },
   // 验证字段信息
   validateForm : function(formData){
      var result = {
         status  : false,
         msg     : ''
      };
      // 验证原密码是否为空
      if(!_mm.validate(formData.password,'require')){
         result.msg = '请输入原密码';
         return result;
      }
      //验证新密码是否有足够的长度
      if(!formData.passwordNew||formData.passwordNew.length<6){
         result.msg = '请输入至少6位数的新密码';
         return result;
      }
      //验证新密码和原密码是否相同
      if(formData.passwordNew!==formData.passwordConfirm){
         result.msg='两次输入的密码不相同';
         return result;
      }
      // 通过验证，返回正确提示
      result.status   = true;
      result.msg      = '验证通过';
      return result;
   }
};
$(function(){
   page.init();
});
