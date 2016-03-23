var registerBackToTop = function () {
    var THRESHOLD = 50;
    var $top = $('.back-to-top');

    $(window).on('scroll', function () {
      $top.toggleClass('back-to-top-on', window.pageYOffset > THRESHOLD);
    });

    $top.on('click', function () {
      $('body').velocity('scroll');
    });
};

registerBackToTop();

