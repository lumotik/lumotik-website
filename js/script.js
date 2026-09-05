function goTop() {
  var btn = $("#goTop");
  $(window).on("scroll", function () {
    if ($(window).scrollTop() > 300) {
      btn.addClass("show");
    } else {
      btn.removeClass("show");
    }
  });
  btn.on("click", function (e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

function openNav() {
  $("#mobileNavDrawer").addClass("active");
  $(".mobile-nav-overlay").addClass("active");
  $("body").addClass("nav-open");
}

function closeNav() {
  $("#mobileNavDrawer").removeClass("active");
  $(".mobile-nav-overlay").removeClass("active");
  $("body").removeClass("nav-open");
}

$(document).ready(function () {
  AOS.init();
  if ($("#onePageNav").length) {
    $("#onePageNav").onePageNav({
      currentClass: "active",
      changeHash: false,
      headerSelector: ".header",
      offsetAdjustment: 10,
      scrollThreshold: 0.3,
    });
  }
  if ($("#mobileOnePageNav").length) {
    $("#mobileOnePageNav").onePageNav({
      currentClass: "active",
      changeHash: false,
      headerSelector: ".header",
      offsetAdjustment: 10,
      scrollThreshold: 0.3,
    });
  }
  goTop();

  // Smooth scroll for all on-page hash links (e.g., CTA buttons)
  $('a[href^="#"]:not([data-bs-toggle])').on("click", function (e) {
    var href = $(this).attr("href");
    if (href && href !== "#" && $(href).length) {
      var header = document.querySelector(".header");
      var offset = header ? header.offsetHeight + 10 : 70;
      var targetTop = $(href).offset().top - offset;
      
      e.preventDefault();
      closeNav();
      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: "smooth",
      });
    }
  });

  $(".navbar-toggler").on("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    openNav();
  });

  // Interactive Project Media Gallery & Video Controls
  function initProjectMediaGallery() {
    $(".project-showcase").each(function () {
      var $showcase = $(this);
      var $video = $showcase.find("video.main-video");
      var $img = $showcase.find("img.main-img");
      var $toggleBtn = $showcase.find(".media-btn-toggle");
      var $muteBtn = $showcase.find(".media-btn-mute");
      var $controls = $showcase.find(".media-playback-controls");
      var videoSrc = $video.data("video-src");
      var userManuallySelectedMedia = false;
      var videoBlobUrl = null;
      var isVideoActive = false;

      function isSlowNetwork() {
        if (navigator.connection) {
          if (navigator.connection.saveData) return true;
          var type = navigator.connection.effectiveType;
          if (type === "slow-2g" || type === "2g" || type === "3g") return true;
        }
        return false;
      }

      // Load video as the very LAST thing after the website is completely loaded
      function loadVideoLast() {
        if (!videoSrc || !$video.length || isSlowNetwork()) {
          // Slow connection or no video: keep showing high-res images only
          return;
        }

        var controller = window.AbortController ? new AbortController() : null;
        var timeoutId = setTimeout(function () {
          if (controller) controller.abort();
        }, 8000); // 8 second download timeout

        // Fetch video in background without blocking initial page load or triggering tab loading bar
        fetch(videoSrc, { signal: controller ? controller.signal : undefined })
          .then(function (res) {
            if (!res.ok) throw new Error("Video load failed");
            return res.blob();
          })
          .then(function (blob) {
            clearTimeout(timeoutId);
            videoBlobUrl = URL.createObjectURL(blob);

            var videoEl = $video[0];
            videoEl.src = videoBlobUrl;

            // When video is ready to play and user hasn't clicked another thumbnail, preview it smoothly
            videoEl.oncanplay = function () {
              if (!userManuallySelectedMedia) {
                var activeThumb = $showcase.find(".gallery-thumb.active");
                if (!activeThumb.length || activeThumb.data("media-type") === "video") {
                  $img.addClass("d-none");
                  $video.removeClass("d-none");
                  $controls.fadeIn(300);
                  isVideoActive = true;
                  var p = videoEl.play();
                  if (p !== undefined) {
                    p.catch(function () {});
                  }
                  $toggleBtn.find("i").removeClass("fa-play").addClass("fa-pause");
                }
              }
            };
            videoEl.load();
          })
          .catch(function () {
            // If download was aborted (slow internet) or failed, keep showing the images seamlessly
            clearTimeout(timeoutId);
          });
      }

      // Schedule video load as the LAST thing after full window load
      if (document.readyState === "complete") {
        setTimeout(loadVideoLast, 1000);
      } else {
        $(window).on("load", function () {
          setTimeout(loadVideoLast, 1000);
        });
      }

      // Gallery thumbnail click
      $showcase.find(".gallery-thumb").on("click", function () {
        userManuallySelectedMedia = true;
        var $thumb = $(this);
        var mediaType = $thumb.data("media-type");
        var mediaSrc = $thumb.data("media-src");
        var mediaPoster = $thumb.data("media-poster");
        var mediaTitle = $thumb.data("title") || $thumb.attr("title");

        $showcase.find(".gallery-thumb").removeClass("active");
        $thumb.addClass("active");

        if (mediaType === "video") {
          if ($video.length) {
            var videoEl = $video[0];
            $img.addClass("d-none");
            $video.removeClass("d-none");
            $controls.fadeIn(200);
            isVideoActive = true;

            var targetSrc = videoBlobUrl || mediaSrc;
            if ($video.attr("src") !== targetSrc) {
              $video.attr("src", targetSrc);
              if (mediaPoster) $video.attr("poster", mediaPoster);
              videoEl.load();
            }

            var playPromise = videoEl.play();
            if (playPromise !== undefined) {
              playPromise.catch(function () {
                $toggleBtn.find("i").removeClass("fa-pause").addClass("fa-play");
              });
            }
            $toggleBtn.find("i").removeClass("fa-play").addClass("fa-pause");
          }
        } else {
          // Switch to Image
          if ($video.length) {
            $video[0].pause();
            $video.addClass("d-none");
            isVideoActive = false;
          }
          $controls.fadeOut(200);
          $img.removeClass("d-none")
            .attr("src", mediaSrc)
            .attr("alt", mediaTitle || "Imperium Group Showcase");
        }
      });

      // Video Play/Pause toggle
      $toggleBtn.on("click", function (e) {
        e.stopPropagation();
        if ($video.length) {
          var videoEl = $video[0];
          if (videoEl.paused) {
            videoEl.play();
            $toggleBtn.find("i").removeClass("fa-play").addClass("fa-pause");
          } else {
            videoEl.pause();
            $toggleBtn.find("i").removeClass("fa-pause").addClass("fa-play");
          }
        }
      });

      // Video Mute/Unmute toggle
      $muteBtn.on("click", function (e) {
        e.stopPropagation();
        if ($video.length) {
          var videoEl = $video[0];
          videoEl.muted = !videoEl.muted;
          if (videoEl.muted) {
            $muteBtn.find("i").removeClass("fa-volume-high").addClass("fa-volume-xmark");
          } else {
            $muteBtn.find("i").removeClass("fa-volume-xmark").addClass("fa-volume-high");
          }
        }
      });
    });

    // Pause videos when switching tabs
    $('button[data-bs-toggle="tab"]').on("hide.bs.tab", function () {
      $(".project-showcase video.main-video").each(function () {
        this.pause();
      });
    });
  }

  $(".mobile-drawer__close").on("click", function (e) {
    e.preventDefault();
    closeNav();
  });
  $(".mobile-nav-overlay").on("click", function (e) {
    e.preventDefault();
    closeNav();
  });

  // Close nav on Escape key
  $(document).on("keydown", function (e) {
    if (e.key === "Escape") {
      closeNav();
    }
  });

  // Ensure all links inside mobile nav close the nav when tapped
  $("#mobileNavDrawer a").on("click", function () {
    closeNav();
  });

  // Counter Animation
  const statsSection = document.querySelector(".stats");
  if (statsSection) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll(
              ".stats__card-number"
            );
            counters.forEach((counter) => {
              const target = +counter.getAttribute("data-target");
              const duration = 2000; // 2 seconds
              const increment = target / (duration / 16); // 60fps

              let current = 0;
              const updateCount = () => {
                current += increment;
                if (current < target) {
                  counter.innerText = Math.ceil(current);
                  setTimeout(updateCount, 16);
                } else {
                  counter.innerText = target;
                }
              };
              updateCount();
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(statsSection);
  }

  initProjectMediaGallery();
});


