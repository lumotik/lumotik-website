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
    $("html, body").animate(
      {
        scrollTop: 0,
      },
      "300"
    );
  });
}

function closeNav() {
  $(".navbar-nav.collapsed-mobile").removeClass("active");
}

$(document).ready(function () {
  AOS.init();
  $("#onePageNav").onePageNav({
    currentClass: "active",
    changeHash: false,
    scrollSpeed: 500,
    scrollThreshold: 0.2,
    filter: "",
    easing: "swing",
  });
  goTop();

  $(".navbar-toggler").click(function () {
    $(".navbar-nav.collapsed-mobile").addClass("active");
  });

  $(".navbar-nav.collapsed-mobile .close__btn").click(closeNav);
  $(".navbar .overlay").click(closeNav);

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
});
