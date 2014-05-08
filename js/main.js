

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

var canvas = $('.huffpost-card .back .canvasWrapper canvas')[0],
    ctx = canvas.getContext("2d"),
    painting = false,
    lastX = 0,
    lastY = 0,
    lineThickness = 1;
 	canvasPosition = $('.huffpost-card .back .canvasWrapper canvas').offset();
// canvas.width = canvas.height = 600;
// ctx.fillRect(0, 0, 600, 600);

canvas.onmousedown = function(e) {
    painting = true;
    ctx.fillStyle = "#431f26";
    lastX = e.layerX * 900 / 562;
    lastY = e.layerY * 900 / 562;
};

canvas.onmouseup = function(e){
    painting = false;
}

canvas.onmousemove = function(e) {
    if (painting) {
        mouseX = e.layerX * 900 / 562;
        mouseY = e.layerY * 900 / 562;
        // mouseX = e.pageX - this.offsetLeft;
        // mouseY = e.pageY - this.offsetTop;

        // find all points between        
        var x1 = mouseX,
            x2 = lastX,
            y1 = mouseY,
            y2 = lastY;


        var steep = (Math.abs(y2 - y1) > Math.abs(x2 - x1));
        if (steep){
            var x = x1;
            x1 = y1;
            y1 = x;

            var y = y2;
            y2 = x2;
            x2 = y;
        }
        if (x1 > x2) {
            var x = x1;
            x1 = x2;
            x2 = x;

            var y = y1;
            y1 = y2;
            y2 = y;
        }

        var dx = x2 - x1,
            dy = Math.abs(y2 - y1),
            error = 0,
            de = dy / dx,
            yStep = -1,
            y = y1;
        
        if (y1 < y2) {
            yStep = 1;
        }
       
        lineThickness = 5 - Math.sqrt((x2 - x1) *(x2-x1) + (y2 - y1) * (y2-y1))/10;
        if(lineThickness < 1){
            lineThickness = 1;   
        }

        for (var x = x1; x < x2; x++) {
            if (steep) {
                ctx.fillRect(y, x, lineThickness , lineThickness );
            } else {
                ctx.fillRect(x, y, lineThickness , lineThickness );
            }
            
            error += de;
            if (error >= 0.5) {
                y += yStep;
                error -= 1.0;
            }
        }

        lastX = mouseX;
        lastY = mouseY;

    }
}

		  },
		  useCORS: true
		});
		setTimeout(function() {
			$('.huffpost-card').addClass('flip');
		}, 500);

	})
})
