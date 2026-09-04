/**
 * Ultra-Smooth High Performance One Page Navigation Plugin
 * Native smooth scrolling with zero delay & active scrollspy
 */
(function ($, window, document) {
  'use strict';

  var OnePageNav = function (elem, options) {
    this.elem = elem;
    this.$elem = $(elem);
    this.options = $.extend(
      {
        navItems: 'a[href^="#"]',
        currentClass: 'active',
        changeHash: false,
        headerSelector: '.header',
        offsetAdjustment: 12,
        scrollThreshold: 0.35,
      },
      options
    );
    this.ticking = false;
    this.init();
  };

  OnePageNav.prototype = {
    init: function () {
      var self = this;
      this.$links = this.$elem.find(this.options.navItems);

      // Handle clicks with instant smooth scroll
      this.$elem.on('click', this.options.navItems, function (e) {
        var href = $(this).attr('href');
        if (!href || href === '#' || href.charAt(0) !== '#') return;

        var $target = $(href);
        if ($target.length) {
          e.preventDefault();
          self.scrollToTarget($target, $(this));
        }
      });

      // Passive scroll listener for scrollspy
      window.addEventListener(
        'scroll',
        function () {
          if (!self.ticking) {
            window.requestAnimationFrame(function () {
              self.updateActiveOnScroll();
              self.ticking = false;
            });
            self.ticking = true;
          }
        },
        { passive: true }
      );

      // Initial check
      setTimeout(function () {
        self.updateActiveOnScroll();
      }, 100);
    },

    getHeaderHeight: function () {
      var $header = $(this.options.headerSelector);
      return $header.length ? $header.outerHeight() : 70;
    },

    scrollToTarget: function ($target, $link) {
      var headerHeight = this.getHeaderHeight();
      var targetTop = $target.offset().top - headerHeight - this.options.offsetAdjustment;

      // Close mobile navigation drawer immediately if open
      $('.navbar-nav.collapsed-mobile').removeClass('active');

      // Update active nav class immediately for instant visual feedback
      this.$elem.find('.' + this.options.currentClass).removeClass(this.options.currentClass);
      if ($link && $link.length) {
        $link.closest('li').addClass(this.options.currentClass);
      }

      // Native GPU-accelerated smooth scrolling with 0ms delay
      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: 'smooth',
      });

      if (this.options.changeHash && history.pushState) {
        history.pushState(null, null, $target.attr('id') ? '#' + $target.attr('id') : '');
      }
    },

    updateActiveOnScroll: function () {
      var scrollPos = $(window).scrollTop();
      var headerHeight = this.getHeaderHeight();
      var checkPoint = scrollPos + headerHeight + (window.innerHeight * this.options.scrollThreshold);
      var currentId = null;

      this.$links.each(function () {
        var href = $(this).attr('href');
        if (!href || href === '#' || href.charAt(0) !== '#') return;

        var $target = $(href);
        if ($target.length) {
          var top = $target.offset().top;
          var height = $target.outerHeight();
          if (checkPoint >= top && checkPoint < top + height) {
            currentId = href;
          }
        }
      });

      // Edge case: at very bottom of document
      if ($(window).scrollTop() + window.innerHeight >= $(document).height() - 50) {
        var lastHref = this.$links.last().attr('href');
        if (lastHref && lastHref.charAt(0) === '#') {
          currentId = lastHref;
        }
      }

      if (currentId) {
        var $activeLink = this.$elem.find('a[href="' + currentId + '"]');
        if ($activeLink.length && !$activeLink.closest('li').hasClass(this.options.currentClass)) {
          this.$elem.find('.' + this.options.currentClass).removeClass(this.options.currentClass);
          $activeLink.closest('li').addClass(this.options.currentClass);
        }
      }
    },
  };

  $.fn.onePageNav = function (options) {
    return this.each(function () {
      if (!$.data(this, 'plugin_onePageNav')) {
        $.data(this, 'plugin_onePageNav', new OnePageNav(this, options));
      }
    });
  };
})(jQuery, window, document);
