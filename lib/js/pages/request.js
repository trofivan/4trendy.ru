/*
 * Преобразует порядковый номер месяца в название месяца
 * ================
 * @param int monthNumber - порядковый номер месяца
 * 
 * @return string - строка по русски  
 */
function stringMonth(monthNumber) {
	switch(Number(monthNumber)) {
		case 1:
			return 'января';
		break;
		case 2:
			return 'февраля';
		break;
		case 3:
			return 'марта';
		break;	
		case 4:
			return 'апреля';
		break;
		case 5:
			return 'мая';
		break;
		case 6:
			return 'июня';
		break;
		case 7:
			return 'июля';
		break;
		case 8:
			return 'августа';
		break;
		case 9:
			return 'сентября';
		break;
		case 10:
			return 'октября';
		break;
		case 11:
			return 'ноября';
		break;
		case 12:
			return 'декабря';
		break;
	};
}

$(document).ready(function() {
	
	/* Диалог оформления онлайн-заявки */

	// Подсветили нужные пункты в статусбаре
	//$("#online_statusbar div:lt(2)").addClass("active");

	
	
	// Скорость анимации
	var speed = 300;
	
	// При нажатии на кнопку "Следующий шаг" разворачиваем следующий блок
	$("#steps .step a.btn.next-step").click(function() {
		$("#steps .step:eq(" + ($(this).parent(".step").index() + 1) + ")").slideDown(speed);
		$(this).slideUp(speed);

		// Статусбар
		$("#online_statusbar div").removeClass("active");
		$("#online_statusbar div:lt( " + ($(this).parent(".step").index() + 1) * 2 + " )").addClass("active");

		// Скроллим страниу к следующему шагу
		var offset = $(this).offset();

		$("html, body").delay(speed).animate({
			scrollTop : offset.top
		}, speed);

		return false;
	});

	// Шаг 1: Выбор услуги
	$("#service").dropdown({
		'url' : '/php/service.php',
		'title' : 'Выберите услугу на которую хотите записаться',
		'name' : 'service',
		'actionChange' : function(){
			//Скрыли лишние блоки если они открыты
			$("#steps .step:gt(0)").slideUp(speed);

			// Кнопка "Следующий шаг"
			$("#steps .step-1 a.next-step").slideDown(speed);
		}
	});

	// Шаг 2: Выбор мастера
	$("#steps .step-2 a.master").click(function() {
		
		// Убрали подсветку всех мастеров
		$("#steps .step-2 a.master").removeClass('active');
		
		//Подсветили активного мастера
		$(this).addClass('active');

		//Скрыли лишние блоки если они открыты
		$("#steps .step:gt(1)").slideUp(speed);

		// Кнопка "Следующий шаг"
		$("#steps .step-2 a.next-step").slideDown(speed);

		return false;
	});

	// Шаг 3: Выбор даты и времени
	// Инициализировали календарь при нажатии "Далее" на шаге 2
	
	$("#steps .step-2 a.next-step").click(function(){
		//Если создан датапикер то убили его
		$("#calendar").datepicker("destroy");
		
		//Инициализировали календарь
		$("#calendar").datepicker({
			minDate : new Date(),
			defaultDate : +1,
			dateFormat: "yy-mm-dd",
			onSelect: function(dateText, inst){
				
				//Записали текущую дату в шапке выбора времени*/
				$("table#datetime #time .header").text( Number(dateText.split("-")[2]) + ' ' + stringMonth(Number(dateText.split("-")[1])) );
				
				//Скрыли лишние блоки если они открыты
				$("#steps .step:gt(2)").slideUp(speed);

				// Кнопка "Следующий шаг"
				$("#steps .step-3 a.next-step").slideDown(speed);

				/*Получили массив с временем на которое уже записаны и закрасили лишние
				$.getJSON(
					'php/request.php',
					{
						id : $("#steps .step-2 a.master.active").data('master-id'),
						date : dateText
					},
					function(data) {
						// Очистили блок с временем
						
						// Расставили время на выбранную дату
						if(data != null) {
							alert(data['working_time']);
							
							for(var i = 0; i < data.length; i++) {
								data['working_time']
							}
								
						}
						
					}
					
				);*/
			}
		});
	});
	
	// Шаг 4: Ввод контактов

	// Шаг 5: Подтверждение
	$("#steps .step-4 a.next-step").click(function(){
		//Скрыли лишние блоки и оставили только "БЛАГОДАРИМ ЗА ЗАПИСЬ"
		$("#steps .step:lt(4)").slideUp(speed);
		//$("#steps .step-3 a.next-step").slideDown(speed);
	});

	/* END Диалог оформления онлайн-заявки */
});
