

$(function(){

	$('.huffpost-card-share').click(function(){
		//$('.huffpost-card .front img').css('visibility', '');
		$('.huffpost-card-share').hide();
		html2canvas($('.huffpost-card .front')[0], {
		  onrendered: function(canvas) {
		    $('.huffpost-card .back .canvasWrapper')[0].appendChild(canvas);
		    var canvas = $('.huffpost-card .back .canvasWrapper canvas')[0];
		    var canvasBase = canvas.toDataURL();
			// var ctx = canvas.getContext("2d");
			// ctx.drawImage(canvasBase, 0, 0);
		    // $('.huffpost-card .back .canvasWrapper canvas').sketch({defaultColor: "#ff0"});
		  },
		  useCORS: true
		});
		setTimeout(function() {
			$('.huffpost-card').addClass('flip');
		}, 500);

	})
})