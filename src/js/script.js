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

      // Gallery thumbnail click
      $showcase.find(".gallery-thumb").on("click", function () {
        var $thumb = $(this);
        var mediaType = $thumb.data("media-type");
        var mediaSrc = $thumb.data("media-src");
        var mediaPoster = $thumb.data("media-poster");
        var mediaTitle = $thumb.data("title") || $thumb.attr("title");

        $showcase.find(".gallery-thumb").removeClass("active");
        $thumb.addClass("active");

        if (mediaType === "video") {
          $img.addClass("d-none");
          $video.removeClass("d-none");
          if ($video.length) {
            var videoEl = $video[0];
            if ($video.attr("src") !== mediaSrc) {
              $video.attr("src", mediaSrc);
              if (mediaPoster) $video.attr("poster", mediaPoster);
            }
            videoEl.play().catch(function () {});
            $toggleBtn.find("i").removeClass("fa-play").addClass("fa-pause");
          }
          $showcase.find(".media-playback-controls").fadeIn(200);
        } else {
          if ($video.length) {
            $video[0].pause();
            $video.addClass("d-none");
          }
          $img.removeClass("d-none")
            .attr("src", mediaSrc)
            .attr("alt", mediaTitle || "Imperium Group Showcase");
          $showcase.find(".media-playback-controls").fadeOut(200);
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


