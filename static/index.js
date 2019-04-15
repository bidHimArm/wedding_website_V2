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

$(function () {
  var playerTrack = $("#player-track"), bgArtwork = $('#bg-artwork'), bgArtworkUrl, albumName = $('#album-name'), trackName = $('#track-name'), albumArt = $('#album-art'), sArea = $('#s-area'), seekBar = $('#seek-bar'), trackTime = $('#track-time'), insTime = $('#ins-time'), sHover = $('#s-hover'), playPauseButton = $("#play-pause-button"), i = playPauseButton.find('i'), tProgress = $('#current-time'), tTime = $('#track-length'), seekT, seekLoc, seekBarPos, cM, ctMinutes, ctSeconds, curMinutes, curSeconds, durMinutes, durSeconds, playProgress, bTime, nTime = 0, buffInterval = null, tFlag = false, albums = ['Mohammed El Kamal - Tik Tak', 'Mohammed Bentir - Scooter', 'Mazouni - Wine Ghadiya bel mini jupe', 'ABRANIS - Thassousmi', 'FREH KHODJA et LES FLAMMES - La Coladera'], trackNames = ['Mohammed El Kamal - Tik Tak', 'Mohammed Bentir - Scooter', 'Mazouni - Wine Ghadiya bel mini jupe', 'ABRANIS - Thassousmi', 'FREH KHODJA et LES FLAMMES - La Coladera'], albumArtworks = ['_1', '_2', '_3', '_4', '_5'], trackUrl = ['http://k007.kiwi6.com/hotlink/f5x7o57xrw/Mohammed_El_Kamal_-_Tik_Tak.mp3', 'http://k007.kiwi6.com/hotlink/y6l2qxbm4u/Mahieddine_Bentir-Scooter.mp3', 'http://k007.kiwi6.com/hotlink/ymasg282sk/Mazouni_-_Wine_Ghadiya_bel_mini_jupe.mp3', 'http://k007.kiwi6.com/hotlink/f8iculn5hr/ABRANIS_-_Thassousmi.mp3', 'http://k007.kiwi6.com/hotlink/6vkbhestn7/FREH_KHODJA_et_LES_FLAMMES_-_La_Coladera.mp3'], playPreviousTrackButton = $('#play-previous'), playNextTrackButton = $('#play-next'), currIndex = -1;

  function playPause() {
    setTimeout(function () {
      if (audio.paused) {
        playerTrack.addClass('active');
        albumArt.addClass('active');
        checkBuffering();
        i.attr('class', 'fas fa-pause');
        audio.play();
      }
      else {
        playerTrack.removeClass('active');
        albumArt.removeClass('active');
        clearInterval(buffInterval);
        albumArt.removeClass('buffering');
        i.attr('class', 'fas fa-play');
        audio.pause();
      }
    }, 300);
  }


  function showHover(event) {
    seekBarPos = sArea.offset();
    seekT = event.clientX - seekBarPos.left;
    seekLoc = audio.duration * (seekT / sArea.outerWidth());

    sHover.width(seekT);

    cM = seekLoc / 60;

    ctMinutes = Math.floor(cM);
    ctSeconds = Math.floor(seekLoc - ctMinutes * 60);

    if ((ctMinutes < 0) || (ctSeconds < 0))
      return;

    if ((ctMinutes < 0) || (ctSeconds < 0))
      return;

    if (ctMinutes < 10)
      ctMinutes = '0' + ctMinutes;
    if (ctSeconds < 10)
      ctSeconds = '0' + ctSeconds;

    if (isNaN(ctMinutes) || isNaN(ctSeconds))
      insTime.text('--:--');
    else
      insTime.text(ctMinutes + ':' + ctSeconds);

    insTime.css({ 'left': seekT, 'margin-left': '-21px' }).fadeIn(0);

  }

  function hideHover() {
    sHover.width(0);
    insTime.text('00:00').css({ 'left': '0px', 'margin-left': '0px' }).fadeOut(0);
  }

  function playFromClickedPos() {
    audio.currentTime = seekLoc;
    seekBar.width(seekT);
    hideHover();
  }

  function updateCurrTime() {
    nTime = new Date();
    nTime = nTime.getTime();

    if (!tFlag) {
      tFlag = true;
      trackTime.addClass('active');
    }

    curMinutes = Math.floor(audio.currentTime / 60);
    curSeconds = Math.floor(audio.currentTime - curMinutes * 60);

    durMinutes = Math.floor(audio.duration / 60);
    durSeconds = Math.floor(audio.duration - durMinutes * 60);

    playProgress = (audio.currentTime / audio.duration) * 100;

    if (curMinutes < 10)
      curMinutes = '0' + curMinutes;
    if (curSeconds < 10)
      curSeconds = '0' + curSeconds;

    if (durMinutes < 10)
      durMinutes = '0' + durMinutes;
    if (durSeconds < 10)
      durSeconds = '0' + durSeconds;

    if (isNaN(curMinutes) || isNaN(curSeconds))
      tProgress.text('00:00');
    else
      tProgress.text(curMinutes + ':' + curSeconds);

    if (isNaN(durMinutes) || isNaN(durSeconds))
      tTime.text('00:00');
    else
      tTime.text(durMinutes + ':' + durSeconds);

    if (isNaN(curMinutes) || isNaN(curSeconds) || isNaN(durMinutes) || isNaN(durSeconds))
      trackTime.removeClass('active');
    else
      trackTime.addClass('active');


    seekBar.width(playProgress + '%');

    if (playProgress == 100) {
      i.attr('class', 'fa fa-play');
      seekBar.width(0);
      tProgress.text('00:00');
      albumArt.removeClass('buffering').removeClass('active');
      clearInterval(buffInterval);
    }
  }

  function checkBuffering() {
    clearInterval(buffInterval);
    buffInterval = setInterval(function () {
      if ((nTime == 0) || (bTime - nTime) > 1000)
        albumArt.addClass('buffering');
      else
        albumArt.removeClass('buffering');

      bTime = new Date();
      bTime = bTime.getTime();

    }, 100);
  }

  function selectTrack(flag) {
    if (flag == 0 || flag == 1)
      ++currIndex;
    else
      --currIndex;

    if ((currIndex > -1) && (currIndex < albumArtworks.length)) {
      if (flag == 0)
        i.attr('class', 'fa fa-play');
      else {
        albumArt.removeClass('buffering');
        i.attr('class', 'fa fa-pause');
      }

      seekBar.width(0);
      trackTime.removeClass('active');
      tProgress.text('00:00');
      tTime.text('00:00');

      currAlbum = albums[currIndex];
      currTrackName = trackNames[currIndex];
      currArtwork = albumArtworks[currIndex];

      audio.src = trackUrl[currIndex];

      nTime = 0;
      bTime = new Date();
      bTime = bTime.getTime();

      if (flag != 0) {
        audio.play();
        playerTrack.addClass('active');
        albumArt.addClass('active');

        clearInterval(buffInterval);
        checkBuffering();
      }

      albumName.text(currAlbum);
      trackName.text(currTrackName);
      albumArt.find('img.active').removeClass('active');
      $('#' + currArtwork).addClass('active');

      bgArtworkUrl = $('#' + currArtwork).attr('src');

      bgArtwork.css({ 'background-image': 'url(' + bgArtworkUrl + ')' });
    }
    else {
      if (flag == 0 || flag == 1)
        --currIndex;
      else
        ++currIndex;
    }
  }

  function initPlayer() {
    audio = new Audio();

    selectTrack(0);

    audio.loop = false;

    playPauseButton.on('click', playPause);

    sArea.mousemove(function (event) { showHover(event); });

    sArea.mouseout(hideHover);

    sArea.on('click', playFromClickedPos);

    $(audio).on('timeupdate', updateCurrTime);

    playPreviousTrackButton.on('click', function () { selectTrack(-1); });
    playNextTrackButton.on('click', function () { selectTrack(1); });
  }

  initPlayer();
});
