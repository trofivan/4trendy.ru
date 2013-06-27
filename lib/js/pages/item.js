//После зугрузки страницы
$(document).ready(function() {

	/* Инициализировали галлерею FancyBox */
	$(".gallery a").fancybox({
		'nextEffect' : 'elastic',
		'prevEffect' : 'fade'
	});
	
	/* Табы на странице компании */
	$("ul#tabs li a").click(function() {
		$("ul#tabs li").removeClass("active");
		$(this).parent().addClass("active");
		$("#content .tabs_content").hide();
		$("#content .tabs_content:eq(" + $(this).parent().index() + ")").show();
		return false;
	});
	/* END Табы на странице компании */

});
