$(document).foundation();

$(window).scroll(function() {
    var top = $(window).scrollTop();
    if (top <= $(".hero").height())
        $(".hero .bg").css("top", -1 * top * 0.25);
});
