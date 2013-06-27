/*
 * Анимация для верхнего меню
 * ==========================
 * @param current - номер раздела (0..5)
 */
function topMenu(current) {

	//Сдвигаем блок #slider_block
	$("#slider_block").animate({
		'margin-left' : -current * $("nav #sub #links").width()
	}, 300);

	//Сдвигаем стрелку к нужному пункту
	$("#arrow").animate({
		'left' : current * $("#arrow").width()
	}, 300);

	//Высота блока по высоте контента
	$("nav #sub #links").animate({
		'height' : $("nav #slider_block ul:eq(" + current + ")").height()
	}, 300);

}

$(document).ready(function(){
	
	//Подогнали высоту верхнего меню
	topMenu(0);
	
	//Клик по разделу верхнего меню
	$("nav menu li a").click(function() {
		topMenu($(this).parent().index());
		return false;
	});
	
	//PopUp окна авторизации
	$("a.auth").fancybox({
		type : 'inline'
		//width: 100
	});
});
