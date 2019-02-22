/**
   * jQeury Singular js
   *
   * Desciption
   *
   */

; (function ($, window, document, undefined) {

  var pluginName = 'singular',
    defaults = {
      section: '.singular-section',
      nav: '.singular-nav',
      prev: '.singular-prev',
      next: '.singular-next',
      navActiveClass: 'singular-active',
      scrollSpeed: 1000,
      easing: 'swing',
      mousewheel: false,
      scrollEnd: function () { }
    };

  function Plugin(element, options) {
    this.element = element;
    this.settings = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;

    this.init();
  }

  Plugin.prototype.init = function () {
    var self = this;

    self.$element = $(self.element);
    self.$sections = self.$element.find(self.settings.section);
    self.$nav = $(self.settings.nav);
    self.$prev = $(self.settings.prev);
    self.$next = $(self.settings.next);
    self.currentSecNum = 0;
    self.windowH = $(window).innerHeight();
    self.sectionsLen = self.$sections.length;
    self.moveFlg = false;
    self.useNav = (self.$nav.length > 0) ? true : false;
    self.usePrev = (self.$prev.length > 0) ? true : false;
    self.useNext = (self.$next.length > 0) ? true : false;

    self.$element.css('top', 0);

    if (self.useNav) {
      self.$nav.find('a').on('click keypress', function (e) {
        e.preventDefault();
        self.scrollSectionWithNav($(this));
      });
    }
    if (self.usePrev) {
      self.$prev.on('click keypress', function (e) {
        e.preventDefault();
        self.scrollSectionPrev();
      });
    }
    if (self.useNext) {
      self.$next.on('click keypress', function (e) {
        e.preventDefault();
        self.scrollSectionNext();
      });
    }
    if (self.settings.mousewheel) {
      self.$element.on('mousewheel', function (e, delta) {
        e.preventDefault();

        if (delta < -0.8) self.scrollSectionNext();
        if (delta > 0.8) self.scrollSectionPrev();
      });
    }
    $(window).on('load scroll', function () {
      self.changeNavActive(self.currentSecNum);
      self.adjustSectionSize();
    });
  }
  Plugin.prototype.adjustSectionSize = function () {
    var self = this;

    self.windowH = $(window).innerHeight();

    adjustSectionSize(self.$sections, self.windowH);
  }
  Plugin.prototype.scrollSectionNext = function () {
    var self = this;

    self.scrollSection(self.currentSecNum + 1);
  }
  Plugin.prototype.scrollSectionPrev = function () {
    var self = this;

    self.scrollSection(self.currentSecNum - 1);
  }
  Plugin.prototype.scrollSectionWithNav = function ($link) {
    var self = this;

    self.scrollSection($link.parent().index());
  }
  Plugin.prototype.scrollSection = function (toNum) {
    var self = this,
      distance;

    if (self.$element.is(':animated')) return false;
    if (toNum < 0) toNum = 0;
    if (toNum > self.sectionsLen - 1) toNum = self.sectionsLen - 1;
    if (toNum == self.currentSecNum) return false;

    distance = Math.abs(self.currentSecNum - toNum);
    if (self.currentSecNum < toNum) distance = -distance;

    distance = parseInt(self.$element.css('top'), 10) + (self.windowH * distance);

    self.$element.stop().animate({
      top: distance
    }, self.settings.scrollSpeed, self.settings.easing, function () {
      self.currentSecNum = toNum;
      self.changeNavActive(self.currentSecNum);
      self.settings.scrollEnd(self);
    });
  }
  Plugin.prototype.changeNavActive = function (num) {
    var self = this,
      $navChildren = self.$nav.children();

    $navChildren.removeClass(self.settings.navActiveClass);
    $navChildren.eq(num).addClass(self.settings.navActiveClass);
  }

  function adjustSectionSize($sections, windowH) {
    $sections.each(function () {
      $(this).height(windowH);
    });
  } // end of adjustSectionSize()

  $.fn[pluginName] = function (options) {
    this.each(function () {
      if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
      }
    });

    return this;
  }

})(jQuery, window, document, undefined);



$(function () {
  $('.js-singular').singular({
    section: '.mod-singular-section',
    nav: '.js-singular-nav',
    prev: '.js-singular-prev',
    next: '.js-singular-next',
    navActiveClass: 'js-singular-active',
    scrollSpeed: 1500,
    mousewheel: true, // required jQuery mousewheel plugin
    easing: 'easeInOutQuart', // requires jQuery easing plugin
    scrollEnd: function (elem) { // callback
      console.log('scrollEnd');
    }
  });
});

var myDataRef = new Firebase('https://brilliant-inferno-161.firebaseio.com/Attendance');
$('#transport').keypress(function (e) {
  if (e.keyCode == 13) {
    var name = $('#nameInput').val();
    var rsvp = $('#messageInput').val();
    var ride = $('#transport').val();
    myDataRef.push({ name: name, rsvp: rsvp, ride: ride });
    $('#messageInput').val('');
    $('#nameInput').val('');
    $('#transport').val('');
    $('.attendance').addClass('attAnim');
  }
});


