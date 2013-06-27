/**
 * Листает вверх-вниз новости
 * =========================
 * @param current_top - int - номер самого верхнего элемента (>=0)
 */
function sliderNews(current_top) {
	//Сдвинули
	$("section#news section#list div#arrows ul").animate({
		'margin-top' : -45 * current_top
	}, 300);
	//Добавили текущему верхнему .current_top
	$("section#news section#list div#arrows ul li").removeClass("current_top");
	$("section#news section#list div#arrows ul li:eq(" + current_top + ")").addClass("current_top");
}

/**
 * Отображает новость и подсвечивает нужную новость (блок новости)
 * =============================================
 */
function mainPageNewsActive(current) {
	//Отобразили нужное превью новости
	$("section#news section#articles article").addClass("dn");
	$("section#news section#articles article:eq(" + current + ")").removeClass("dn");

	//Подсветили нужную стрелку
	$("section#news section#list #arrows ul li a").removeClass("active");
	$("section#news section#list #arrows ul li:eq(" + current + ") a").addClass("active");
}

$(document).ready(function() {
	
	//Клик по новости на главной
	$("section#news section#list #arrows ul li a").click(function() {
		current = $(this).parent().index();

		//Если уже активное то переходим по ссылке
		if (!$(this).hasClass("active")) {
			mainPageNewsActive(current);
			return false;
		}
	});

	/* Нажатие на стрелки вверх-вниз(листалка новостей) */
	$("section#news #navigation a").mousedown(function() {
		if ($(this).hasClass("bottom")) {
			$(this).css('background-position', 'left center');
		} else if ($(this).hasClass("top")) {
			$(this).css('background-position', 'right center');
		}
	});
	$("section#news #navigation a").mouseup(function() {
		if ($(this).hasClass("bottom")) {
			$(this).css('background-position', 'left top');
		} else if ($(this).hasClass("top")) {
			$(this).css('background-position', 'right top');
		}
	});
	$("section#news #navigation a").click(function() {

		var count_news = $("section#news section#list div#arrows ul li").length;
		var max_top = count_news - 5;
		var current_top = $("section#news section#list div#arrows ul li.current_top").index();

		if ($(this).hasClass("bottom")) {
			if (current_top < max_top) {
				$("section#news #navigation a").removeClass("stop");
				sliderNews(current_top + 1);
				if (current_top == (max_top - 1)) {
					$(this).addClass("stop");
				}
			}
		} else if ($(this).hasClass("top")) {
			if (current_top > 0) {
				$("section#news #navigation a").removeClass("stop");
				sliderNews(current_top - 1);
				if (current_top == 1) {
					$(this).addClass("stop");
				}
			}
		}

		return false;
	});
	/* END Нажатие на стрелки вверх-вниз(листалка новостей) */
}); 