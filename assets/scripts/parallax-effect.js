function startParallax() {
	window.addEventListener("scroll", function(event){
		var top = this.pageYOffset;
		var layers = $(".parallax");
    
    $.each(layers, function(idx, layer) {
      var speed = layer.getAttribute('data-speed');
      var yPos = -(top * speed / 100);
      layer.setAttribute('style', 'transform: translate3d(0px, ' + yPos + 'px, 0px)');
    })

	});
}

function dispelParallax() {
	$("#nonparallax").css('display','block');
	$("#parallax").css('display','none');
}

$(document).ready(function() {
  var platform = navigator.platform.toLowerCase();
	if ( platform.indexOf('ipad') != -1  ||  platform.indexOf('iphone') != -1 ) {
		dispelParallax();
	} else if (platform.indexOf('win32') != -1 || platform.indexOf('linux') != -1) {
		startParallax();
	} else {
		startParallax();
	}
}) 