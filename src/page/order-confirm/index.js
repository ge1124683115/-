'use strict';
require('./index.css');
require('page/common/header/index.js');
require('page/common/nav/index.js');
var _mm                  = require('util/mm.js');
var _order               = require('service/order-service.js');
var _address             = require('service/address-service.js');
var addressModal         = require('./address-modal.js');
var templateIndexAddress = require('./address-list.string');
var templateIndexProduct = require('./product-list.string');

var page = {
   data : {
      selectedAddressId : null
   },
   init : function () {
      this.onLoad();
      this.bindEvent();
   },
   onLoad : function () {
      this.getAddressList();
      this.loadProductList();
   },
   bindEvent : function () {
      var _this=this;
      //地址的选择
      $(document).on('click','.address-item',function () {
         $(this).addClass('active').siblings('.address-item').removeClass('active');
         _this.data.selectedAddressId = $(this).data('id');
      });
      //订单的提交
      $(document).on('click','.order-submit',function () {
         var shippingId = _this.data.selectedAddressId;
         if(shippingId){
            _order.createOrder({
               shippingId : shippingId
            },function (res) {
               window.location.href='./payment.html?orderNumber=' + res.orderNo;
            },function (errMsg) {
               _mm.errorTip(errMsg);
            })
         }
      });
      //添加新地址
      $(document).on('click','.address-add',function () {
         addressModal.show({
            isUpdate : false,
            onSuccess : function () {
               _this.getAddressList();
            }
         })
      });
      //地址的编辑
      $(document).on('click','.address-update',function (e) {
         e.stopPropagation();
         var shippingId = $(this).parents('.address-item').data('id');
         _address.getAddress(shippingId,function (res) {
            addressModal.show({
               isUpdate : true,
               data     : res,
               onSuccess: function () {
                  _this.getAddressList();
               }
            });
         },function (errMsg) {
            _mm.errorTip(errMsg);
         })
      });
      //删除地址
      $(document).on('click','.address-delete',function (e) {
         e.stopPropagation();
         var id = $(this).parents('.address-item').data('id');
         if(window.confirm('确认要删除该地址吗？')){
            _address.deleteAddress(id,function (res) {
               _this.getAddressList();
            },function (errMsg) {
               _mm.errorTip(errMsg);
            })
         }
      });
   },
   //加载地址列表
   getAddressList : function () {
      $('.address-con').html('<div class="loading"></div>')
      var _this = this;
      _address.getAddressList(function (res) {
         _this.addressFilter(res);
         var addressListHtml = _mm.renderHtml(templateIndexAddress,res);
         $('.address-con').html(addressListHtml);
      },function (errMsg) {
         $('.address-con').html('<p class="err-tip">地址加载失败，请重新加载</p>');
      })
   },
   //处理地址列表中的选中状态
   addressFilter : function (data) {
      if(this.data.selectedAddressId){
         var selectedAddressIdFlag = false;
         for(var i=0,length = data.list.length;i<length;i++){
            if(data.list[i].id ===this.data.selectedAddressId){
               data.list[i].isActive = true;
               selectedAddressIdFlag = true;
            }
         };
         //如果以前选中的地址不在列表中，将其删除
         if(!selectedAddressIdFlag){
            this.data.selectedAddressId = null;
         }
      }
   },
   //加载商品清单
   loadProductList : function () {
      $('.product-con').html('<div class="loading"></div>')
      var _this = this;
      _order.getProductList(function (res) {
         var productListHtml = _mm.renderHtml(templateIndexProduct,res);
         $(".product-con").html(productListHtml);
      },function (errMsg) {
         $('.product-con').html('<p class="err-tip">商品加载失败，请稍后重新加载</p>');
      })
   }
}
$(function () {
   page.init();
});