'use strict';
require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
var _mm             = require('util/mm.js');
var _product        = require('service/product-service.js');
var templateIndex   = require('./index.string');
var Pagination      = require('util/Pagination/index.js');

var page={
   data:{
      listParam:{
         keyword     : _mm.getUrlParam('keyword')||'',
         categoryId  : _mm.getUrlParam('categoryId')||'',
         orderBy     : _mm.getUrlParam('orderBy')||'default',
         pageNum     : _mm.getUrlParam('pageNum')||1,
         pageSize    : _mm.getUrlParam('pageSize')||5
      }
   },
   init:function () {
      this.onLoad();
      this.bindEvent();
   },
   onLoad:function () {
      this.loadList();
   },
   bindEvent:function () {
      var _this=this;
      $('.sort-item').click(function () {
         _this.data.listParam.pageNum=1;
         var $this=$(this);
         //点击默认排序
         if($this.data('type')==='default'){
            //如果是active状态
            if($this.hasClass('active')){
               return;
            }else{
               $this.addClass('active').siblings('.sort-item')
                  .removeClass('active');
               _this.data.listParam.orderBy='default';
            }
         }
         //点击进行价格排序
         else if($this.data('type')==='price'){
            $this.addClass('active').siblings('.sort-item')
               .removeClass('active up down');
            //点击进行升序排序
            if(!$this.hasClass('up')){
               $this.addClass('up').removeClass('down');
               _this.data.listParam.orderBy='price_asc';
            }else{
               $this.addClass('down').removeClass('up');
               _this.data.listParam.orderBy='price_desc';
            }
         }
         //重新加载列表
         _this.loadList();
      });
   },
   //加载list数据
   loadList:function () {
      var _this=this,
         listHtml='',
         $pListCon=$('.p-list-con'),
         listParam=this.data.listParam;
      $pListCon.html('<div class="loading"></div>');
      //删除参数中不必要的字段
      listParam.categoryId?(delete listParam.keyword):
         (delete listParam.categoryId);
      //请求接口
      _product.getProductList(listParam, function(res){
         listHtml = _mm.renderHtml(templateIndex, {
            list :  res.list
         });
         $pListCon.html(listHtml);
         _this.loadPagination({
            hasPreviousPage : res.hasPreviousPage,
            prePage         : res.prePage,
            hasNextPage     : res.hasNextPage,
            nextPage        : res.nextPage,
            pageNum         : res.pageNum,
            pages           : res.pages
         });
      }, function(errMsg){
         _mm.errorTip(errMsg);
      });
   },
   //加载分页信息
   loadPagination : function(pageInfo){
      var _this = this;
      this.pagination ? '' : (this.pagination = new Pagination());
      this.pagination.render($.extend({}, pageInfo, {
         container : $('.pagination'),
         onSelectPage : function(pageNum){
            _this.data.listParam.pageNum = pageNum;
            _this.loadList();
         }
      }));
   }
};
$(function(){
   page.init();
})
