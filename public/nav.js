$(document).ready(function () {
    $(".nav-toggle").click(function () {
      $("#navbar").toggleClass("opened");
    });
    $(".nav-menu").click(function () {
      $("#navbar").removeClass("opened");
    });
  });