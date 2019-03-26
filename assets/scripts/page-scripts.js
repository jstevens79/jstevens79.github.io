$(window).scroll(function() {
  //console.log(window.pageYOffset);

})

$('.logo').click(function(){
  $('html, body').animate({
    scrollTop: 0,
  }, 1600, "swing");
})




$('.navigationLink').click(function(event) {
  event.preventDefault();
  $('html, body').animate({
    scrollTop: ($('#' + $(this).data('target')).offset().top),
  }, 700, "swing");
})

