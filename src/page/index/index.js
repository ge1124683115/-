'use strict';
var _mm = require('util/mm.js');
require('page/common/nav/index.js');
require('page/common/header/index.js');
require('./index.css');
require('util/slider/index.js');
var templateBanner = require('./index.string');

$(function() {
   var bannerHtml=_mm.renderHtml(templateBanner);
   $('.banner-con').html(bannerHtml);
   $('.banner').unslider({
      dots: true,
      delay:5000
   });
   var $slider=$('.banner').unslider();
   $('.banner-con .banner-arrow').click(function () {
      var forward=$(this).hasClass('prev')?'prev':'next';
      $slider.data('unslider')[forward]();
   })
});
