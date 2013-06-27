$(document).ready(function() {
	
	$("#service").dropdown({
		'url' : '/php/service.php',
		'title' : 'выбрать услугу салона',
		'name' : 'service'
	});
	
	/* Подборщик цены */

	var minValue = 0;
	var maxValue = 3000;
	var stepValue = 500;
	
	$("#pick #price").slider({
		animate : true,
		range : true,
		values : [minValue, maxValue],
		min : minValue,
		max : maxValue,
		create : function() {
			$(this).append("<span class='left_bg'></span><span class='right_bg'></span>");

			$("#pick #price .ui-slider-handle:first").append("<span>0 руб.</span>");
			$("#pick #price .ui-slider-handle:last").append("<span>" + maxValue + " руб.</span>");

			var scaleCount = maxValue / stepValue;
			var leftOne = ($("#pick .ui-slider").width() - 10) / scaleCount;
			for (var i = 0; i <= scaleCount; i++) {
				var currentNum = i * stepValue;
				var currentLeft = leftOne * i;

				if (i == 0 || i == scaleCount) {
					currentLeft = currentLeft - 4;
				} else {
					currentLeft = currentLeft - 8;
				}

				$("#price").append("<span class='scale' style='left:" + currentLeft + "px'>" + currentNum + "</span>");
			}
		},
		slide : function(event, ui) {
			$("#pick #price .ui-slider-handle:first span").text(ui.values[0] + " руб.");
			$("#pick #price .ui-slider-handle:last span").text(ui.values[1] + " руб.");
		}
	});
	
	//Показали подборщик цены
	$("#price-box").slideDown()
	/* END Подборщик цены */

	/* Салоны красоты на карте */
	$("a.salons-map").click(function() {
		$("div.salons-map").stop().slideToggle();
		return false;
	});
	/* END Салоны красоты на карте */
}); 