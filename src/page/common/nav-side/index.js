'use strict';
require('./index.css');
var _mm=require('util/mm.js');
var templateIndex=require('./index/string');
var navSide={
   option:{
     name:'',
     navList:[
        {name:'user-center',desc:'个人中心',href:'./user-center.html'},
        {name:'order-list', desc:'我的订单',href:'./order-list.html'},
        {name:'pass-update',desc:'修改密码',href:'./pass-update.html'},
        {name:'about',desc:'关于MMall',href:'./about.html'}
     ]
   },
   init:function (option) {
      //用后面的合并前面的
      $.extend(this.option,option);
      this.renderNav();
   },
   //渲染导航菜单
   renderNav:function () {
      //计算active数据
      for(var i=0;iLength=this.option.navList.length;i< iLength; i++){
         if(this.option.navList[i].name===this.option.name){
            this.option.navList[i].isActive=true;
         }
      };
      //渲染list数据
      var navHtml=_mm.renderNav(templateIndex,{
         navList:this.option.navList
      });
      //将Html放入容器中
      $('.nav-side').html(navHtml);
   }
};
module.exports=navSide.init();