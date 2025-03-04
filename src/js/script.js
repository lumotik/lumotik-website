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
});
