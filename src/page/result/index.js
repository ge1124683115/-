'use strict';
require('./index.css');
require('page/common/nav-simple/index.js');
var _mm=require('util/mm.js');
$(function () {
   var type=_mm.getUrlParam('type')||'default',
      $element=$('.'+type+'-success').show();
   if(type === 'payment'){
      var orderNumber = _mm.getUrlParam('orderNumber'),
         $orderNumber = $element.find('.order-number');
      $orderNumber.attr('href',$orderNumber.attr('href') + orderNumber);
   }
})
