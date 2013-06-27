(function($) {

	function isEmpty(obj) {
		for (var key in obj) {
			return false;
			// если цикл хоть раз сработал, то объект не пустой => false
		}
		// дошли до этой строки - значит цикл не нашёл ни одного свойства => true
		return true;
	}

	var defaults = {
		'url' : '/',
		'title' : '{ title : заголовок }',
		'name' : '{ name : заголовок }',
		'actionChange' : function(){
			console.log('actionChange');
		}
	};

	var methods = {

		//Инициализируем и вешаем все обработчики событий
		init : function(params) {

			var selector = $(this),
				// актуальные настройки, будут индивидуальными при каждом запуске
				options = $.extend({}, defaults, params);

			// инициализируем один раз
			var init = $(this).data('dropdown');

			if (init) {
				return this;
			} else {

				selector.data('dropdown', true);

				//Украсили всё
				selector.addClass('dropdown');
				$("<a/>", {
					'text' : options.title,
					'name' : options.name,
					'class' : 'das'
				}).appendTo($(this));

				//Добавили UL
				$("<ul/>").appendTo($(this));

				//Заполнили нулевой уровень
				selector.dropdown('getJSON', 0, options.url, function(dataJSON) {
						selector.dropdown('appendList', 0, dataJSON);
				});

				selector.on("click", "a", function() {
					//Отобразить выпадающий список и оверлей
					selector.dropdown('show');
				});

				$(document).on('click', '.dropdown-overlay', function(){
					//Скрыть выпадающий список и удалить оверлей
					selector.dropdown('hide');
				});
				
				//Клик по пункту меню
				$(this).on('click', 'li', function(data) {
					
					var data_id = $(this).data('id');

					selector.dropdown('getJSON', $(this).data('id'), options.url, function(dataJSON) {
						if (isEmpty(dataJSON)) {
							//Скрыли выпадающее меню
							selector.dropdown('hide');

						} else {
							selector.dropdown('appendList', data_id, dataJSON);							
						}
					});

					//Записали текст в <a/>
					if ($(this).data('id') == 0) {
						var text = options.title;
					} else {
						var text = $(this).text();
					}
					selector.find("a").text(text).attr('data-id', $(this).data('id'));

					//Выполняем при клике на пункт меню.
					options.actionChange();

				});
								
				return this;

			}
		},
		//Получает JSON с сервера
		getJSON : function(id, url, callback) {

			selector = $(this);

			$.ajax({
				type : 'POST',
				dataType : 'JSON',
				url : url,
				data : {
					id : id
				}
			}).done(function(data) {
				callback && callback(data);
				
			}).fail(function(jqXHR, textStatus) {
				$.error("Ошибка загрузки: " + textStatus);
			});

			return this;
			
		},
		appendList : function(id, dataJSON){

			//Почистили <ul/>
			selector.find("ul").html('');

			//Если не нулевой уровень то добавили кнопку НАЗАД
			if(id != 0){
				$("<li/>", {
					'data-id' : 0,
					'class' : 'red',
					'html' : '&larr; назад'
				}).appendTo(selector.find("ul"));
			};

			//Заполнили JSON
			$.each(dataJSON, function(key, val) {
				$("<li/>", {
					'data-id' : key,
					text : val
				}).appendTo(selector.find("ul"))
			});

			return this;

		},
		//Показать/скрыть выпадающий список
		show : function() {
			$(this).find("ul").show();
			$("<div/>", {
				'class' : 'dropdown-overlay'
			}).appendTo("html");
		},
		//Скрыть выпадающий список
		hide : function() {
			$(this).find("ul").hide();
			$("div.dropdown-overlay").remove();
		}
	};

	$.fn.dropdown = function(method) {
		
		if (this.length > 1) {
			$.error('Плагин можно применить только к одному элементу!');
			return this;
		}

		if (methods[method]) {
			// если запрашиваемый метод существует, мы его вызываем
			// все параметры, кроме имени метода прийдут в метод
			// this так же перекочует в метод
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if ( typeof method === 'object' || !method) {
			// если первым параметром идет объект, либо совсем пусто
			// выполняем метод init
			return methods.init.apply(this, arguments);
		} else {
			// если ничего не получилось
			$.error('Метод "' + method + '" не найден в плагине jQuery.dropdown');
		}

	};
})(jQuery);
