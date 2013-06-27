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
		'url' : '/php/services.php',
		'title' : 'Выберите услугу на которую хотите записаться',
		'name' : 'service',
		'actionChange' : function(){
			//Скрыли лишние блоки если они открыты
			$("#steps .step:gt(0)").slideUp(speed);

			// Скрыли кнопку "Следующий шаг" на всех этапах
			$("#steps a.next-step").slideUp(speed);
		},
		
		'actionClickLastLevel' : function(dataId){

			//Скрыли лишние блоки если они открыты
			$("#steps .step:gt(0)").slideUp(speed);

			// Отобразили кнопку "Следующий шаг" на данном шаге
			$("#steps .step-1 a.next-step").slideDown(speed);

			//Записали ID услуги в инпут формочки
			$("form#order input[name='service']").val(dataId);

			//Получили мастеров которые могут оказать выбранную услугу
			$.post(
				"/users.masters.html",
				{ 
					'service' : dataId,
					'salon' : $("form#order input[name=salon]").val()
				},
				function(data){

					//Очистили блок с мастерами на следующем шаге
					$("#masters").html('');
					
					//Заполнили мастерами
					$.each(data, function(key, master) {
						
						var masterHTML = 
						"<a class='master' data-master-id="+master.id+" href='#master_"+master.id+"'>"+
							"<span class='img'><img src="+master.img.medium+" alt="+master.title+"/></span>"+
							"<span class='name'>"+master.title+"</span>"+
							"<span class='post mini'>Парикмахер-стилист</span>"+
						"</a>";
						
						$(masterHTML).appendTo("#masters");
					
					});
				},
				"json"
			);
		}
	});

	// Шаг 2: Выбор мастера
	$("#steps .step-2 #masters").on("click", "a.master", function() {
		
		// Убрали подсветку всех мастеров
		$("#steps .step-2 a.master").removeClass('active');
		
		//Подсветили активного мастера
		$(this).addClass('active');

		//Записали ID-Мастера в инпут формочки
		$("form#order input[name=master]").val($(this).data('master-id'));

		//Скрыли лишние блоки если они открыты
		$("#steps .step:gt(1)").slideUp(speed);

		// Кнопка "Следующий шаг"
		$("#steps .step-2 a.next-step").slideDown(speed);

		return false;
	});

	// Шаг 3.1: Выбор даты
	// Инициализировали календарь при нажатии "Далее" на шаге 2
	
	$("#steps .step-2 a.next-step").click(function(){
		//Если создан датапикер то убили его
		$("#calendar").datepicker("destroy");

		//Удалили все времена которые отображены
		$("#time .selectTime").html("");

		//Скрыли блок с временем
		$("#time").hide();
		
		//Инициализировали календарь
		$("#calendar").datepicker({
			minDate : new Date(),
			defaultDate : +1,
			dateFormat: "yy-mm-dd",
			onSelect: function(dateText, inst){

				//Скрыли блок со временем и заполнили всё что там есть
				$("#time").slideUp(function(){
					//Записали текущую дату в шапке выбора времени
					$("table#datetime #time .header").text( Number(dateText.split("-")[2]) + ' ' + stringMonth(Number(dateText.split("-")[1])) );
					
					//Скрыли лишние блоки если они открыты
					$("#steps .step:gt(2)").slideUp(speed);

					//Скрыли кнопку следующий шаг
					$("#steps .step-3 a.next-step").slideUp(speed);

					//записали дату в формочку
					$("form#order input[name=date]").val(dateText);
					
					// Получаем время на которое можно и нельзя записаться /

					//Удалили все времена которые отображены
					$("#time .selectTime").html("");

					//Функция генерирует HTML на каждое время
					var htmlCurrentTime = function(val){

						if(val.active == true)
							return "<a href='#'>"+val.title.replace("-", ":")+"</a>\n";

						if(val.active == false)
							return "<span>"+val.title.replace("-", ":")+"</span>\n";
					};

					//Генерим URL с которого запрашиваем время
					var urlTime = String(window.location.href).replace("order", "time");
					var serviceId = $("form#order input[name='service']").val();
					$.post(
						urlTime,
						{ 
							'salon' : $("form#order input[name=salon]").val(),
							'date' : dateText,
							'master' : $("form#order input[name=master]").val()
						},
						function(data){
							//на основе полученного массива формируем html со временем и заполняем табличку
							$.each(data, function(key, val){
								//Утро (07:00 - 11:30)
								if(
									key == "07-00" || 
									key == "07-30" || 
									key == "08-00" || 
									key == "08-30" || 
									key == "09-00" || 
									key == "09-30" || 
									key == "10-00" || 
									key == "10-30" || 
									key == "11-00" ||
									key == "11-30"
								) $("#time td.morning").append(htmlCurrentTime(val));

								//День (12:00 - 17:30)
								if(
									key == "12-00" || 
									key == "12-30" || 
									key == "13-00" || 
									key == "13-30" || 
									key == "14-00" || 
									key == "14-30" || 
									key == "15-00" || 
									key == "15-30" || 
									key == "16-00" ||
									key == "16-30" ||
									key == "17-00" ||
									key == "17-30"
								) $("#time td.afternon").append(htmlCurrentTime(val));

								//Вечер (18:00 - 23:30)
								if(
									key == "18-00" || 
									key == "18-30" || 
									key == "19-00" || 
									key == "19-30" || 
									key == "20-00" || 
									key == "20-30" || 
									key == "21-00" || 
									key == "21-30" || 
									key == "22-00" ||
									key == "22-30" ||
									key == "23-00" ||
									key == "23-30"
								) $("#time td.evening").append(htmlCurrentTime(val));

								//Ночь (00:00 - 06:30)
								if(
									key == "00-00" || 
									key == "00-30" || 
									key == "01-00" || 
									key == "01-30" || 
									key == "02-00" || 
									key == "02-30" || 
									key == "03-00" || 
									key == "03-30" || 
									key == "04-00" ||
									key == "04-30" ||
									key == "05-00" ||
									key == "05-30" ||
									key == "06-00" ||
									key == "06-30"
								) $("#time td.night").append(htmlCurrentTime(val));
							});

							//Отобразили сгенерированый блок с временем
							$("#time").slideDown(time);

						},
						"json"
					);	
				});

			}
		});
	});

	//Шаг 3.1: Выбор времени
	$("#steps .step-3").on('click', 'div#time a', function(){

		//Скрыли лишние блоки если они открыты
		$("#steps .step:gt(2)").slideUp(speed);
		
		$("#steps .step-3 div#time a").removeClass("active");
		$(this).addClass("active");

		//записали время в формочку
		$("form#order input[name=time]").val($(this).text());

		// Кнопка "Следующий шаг"
		$("#steps .step-3 a.next-step").slideDown(speed);
		
		return false;
	});
	
	// Шаг 4: Ввод контактных данных
	$("#steps .step-4 input").keyup(function(){
		
		var currentPhone = $("#steps .step-4 input[name=phone]").val();
		var currentFio = $("#steps .step-4 input[name=fio]").val();
		
		if( (/^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/.test( currentPhone )) && (currentFio.length > 3) ) {
			$("#steps .step-4 a.next-step").slideDown(speed);
		} else {
			$("#steps .step-4 a.next-step").slideUp(speed);
		}
		
	});

	// Шаг 5: Подтверждение
	$("#steps .step-4 a.submit").click(function(){
		//Скрыли лишние блоки
		$("#steps .step").slideUp(speed);

		//Отобразили только "БЛАГОДАРИМ ЗА ЗАПИСЬ"
		$("#steps .step:eq(4)").hide().slideDown(speed, function(){
			//Отправили методом пост все собранные данные
			var serializeArray = $("form#order").serializeArray();
			var params = {};
			$.each(serializeArray, function(key, val){
				params[val.name] = val.value
			});

			//Выполняем post-запрос
			$.post('/orders.add.html', params, function(data) {

				//Скрыли прелоадер когда выполнился запрос
				$("#steps .step-5 .ajaxLoader").slideUp(speed, function(){
					//Генерим результирующее сообщение и выводим пользователю
					$("<h2/>", {
						'class' : 'ts',
						'text' : 'Благодарим за запись'
					}).appendTo("#steps .step-5");

					var resultArray = {
						'Услуга' : data.service.title,
						'Мастер' : data.master.title,
						'Дата и время записи' : Number(data.date.split("-")[2]) + ' ' + stringMonth(Number(data.date.split("-")[1])) + ' ' + data.date.split("-")[0] + ', ' + data.time,
						'Ф.И.О.' : data.fio,
						'Ваш телефон' : data.phone
					};

					var resultTr = '';
					$.each(resultArray, function(key, val){
						resultTr = resultTr+"<tr><td class='bold'>"+key+"</td><td>"+val+"</td></tr>";
					})
					$("<table/>", {
						'class' : 'tableStyle',
						'id' : 'orderResult',
						'style' : 'display:none',
						html : $("<tbody/>", {
							html: resultTr
						})
					}).appendTo("#steps .step-5").slideDown(speed);

					//Статусбар весь активный
					$("#online_statusbar div").addClass("active");
				});				
			});
		});		
	});


	/* END Диалог оформления онлайн-заявки */
});
