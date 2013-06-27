/**
 * Инициализация всех dropdown на странице
 * ====================
 */
function dropdownInit() {
	//Вставили нужные тэги для оформления списков
	$("div.dropdown a").prepend("<span class='left'></span><span class='right'></span>");
	$("div.dropdown ul li").prepend("<span class='left'></span><span class='right'></span>");
	$("div.dropdown ul").append("<li class='bottom_border'><span class='left'></span><span class='right'></span></li>");
	
	/*
	//Одинаковая ширина для кнопки и выпадающего списка
	for (var i=0; i < $("div.dropdown").length; i++) {
		//Реальная ширина button
		width_btn = $("div.dropdown:eq("+i+") button").width();
		
		//Реальная ширина выпадающего ul 
		width_ul = $("div.dropdown:eq("+i+") ul").width() - 15 - 28 - 10 ;
		
		if(width_btn > width_ul) {
			$("div.dropdown:eq("+i+") ul").width( '100%' );
		} else {
			$("div.dropdown:eq("+i+") button").width( width_ul );
		}
	};
	*/
}

$(document).ready(function() {
	
	//Инициализировали dropdown
	dropdownInit();

	// Нажали на button
	$("div.dropdown").hover(function(){
		$(this).children("ul").toggle();
		return false;
	});
	
	// Выбрали из списка
	$("div.dropdown ul li").click(function(){
		$(this).next("ul").toggle();
		return false;
	});
	/* END Обработка событий dropdown */
	
});