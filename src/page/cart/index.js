'use strict';
require('./index.css');
require('page/common/header/index.js');
var nav             = require('page/common/nav/index.js');
var _mm             = require('util/mm.js');
var _cart           = require('service/cart-service.js');
var templateIndex   = require('./index.string');

var page={
   data:{

   },
   init:function () {
      this.onLoad();
      this.bindEvent();
   },
   onLoad:function () {
      this.loadCart();
   },
   bindEvent : function(){
      var _this = this;
      //商品的选择|取消选择
      $(document).on('click','.cart-select',function () {
         var $this=$(this),
            productId=$this.parents('.cart-table').data('product-id');
         //选中
         if($this.is(':checked')){
            _cart.selectProduct(productId,function (res) {
               _this.renderCart(res);
            },function (errMsg) {
               _this.showCartError();
            });
         }
         //取消选中
         else{
            _cart.unselectProduct(productId,function (res) {
               _this.renderCart(res);
            },function (errMsg) {
               _this.showCartError();
            });
         }
      });
      //商品的全选|取消全选
      $(document).on('click','.cart-select-all',function () {
         var $this=$(this);
         //全选
         if($this.is(':checked')){
            _cart.selectAllProduct(function (res) {
               _this.renderCart(res);
            },function (errMsg) {
               _this.showCartError();
            })
         }
         //取消全选
         else{
            _cart.unselectAllProduct(function (res) {
               _this.renderCart(res);
            },function (errMsg) {
               _this.showCartError();
            })
         }
      });
      // //商品数量的变化
      $(document).on('click','.count-btn',function () {
         var $this    = $(this),
            $pCount   = $this.siblings('.count-input'),
            currCount = parseInt($pCount.val()),
            productId = $this.parents('.cart-table').data('product-id'),
            type      = $this.hasClass('plus')?'plus':'minus',
            minCount  = 1,
            maxCount  = parseInt($pCount.data('max')),
            newCount  = 0;
         if(type === 'plus'){
            if(currCount>=maxCount){
               _mm.errorTip('已达到所选商品数量的上限');
               return;
            }
            newCount = currCount+1;
         }else if(type === 'minus'){
            if(currCount <= minCount){
               return;
            }
            newCount = currCount-1;
         }
         //更新购物车中商品的数量
         _cart.updateProduct({
            productId : productId,
            count     : newCount
         },function (res) {
            _this.renderCart(res);
         },function (errMsg) {
            _this.showCartError();
         })
      });
      //删除单个商品
      $(document).on('click','.cart-delete',function () {
         if(window.confirm('确认要删除该商品吗')){
            var productId = $(this).parents('.cart-table').data('product-id');
            _this.deleteCartProduct(productId);
         }
      });
      //删除选中的商品
      $(document).on('click','.delete-selected',function () {
         if(window.confirm('确认要删除选中的商品吗')){
            var arrProductIds = [],
               $selectedItem  = $('.cart-select:checked');
            //循环查找porductId
            for(var i=0,iLength=$selectedItem.length;i<iLength;i++){
               arrProductIds.push($($selectedItem[i]).parents('.cart-table').data('product-id'));
            }
            if(arrProductIds.length){
               _this.deleteCartProduct(arrProductIds.join(','));
            }else{
               _mm.errorTip('请选中需要删除的商品');
            }
         }
      });
      //提交购物车
      $(document).on('click','.btn-submit',function () {
         if(_this.data.cartInfo&&_this.data.cartInfo.cartTotalPrice>0){
            window.location.href='./order-confirm.html';
         }else{
            _mm.errorTip('请选择提交的商品');
         }
      });
   },
   //加载购物车数据
   loadCart:function () {
      var _this=this;
      //获取购物车列表
      _cart.getCartList(function (res) {
         _this.renderCart(res);
      },function (errMsg) {
         _this.showCartError();
      })
   },
   //渲染购物车
   renderCart:function (data) {
      this.filter(data);
      //缓存购物车信息;
      this.data.cartInfo=data
      //生成html
      var cartHtml=_mm.renderHtml(templateIndex,data);
      $('.page-wrap').html(cartHtml);
      //通知导航栏更新购物车的数量
      nav.loadCartCount();
   },
   //删除单个商品，支持同一商品多件同时删除
   deleteCartProduct : function (productIds) {
      var _this = this;
      _cart.deleteProduct(productIds,function (res) {
         _this.renderCart(res);
      },function (errMsg) {
         _this.showCartError();
      })
   },
   // 数据匹配
   filter : function(data){
      data.notEmpty = !!data.cartProductVoList.length;
   },
   //显示错误信息
   showCartError:function () {
      $('.page-wrap').html('<p>哪里出错了，请重新刷新试试</p>');
   }
};
$(function () {
   page.init();
});