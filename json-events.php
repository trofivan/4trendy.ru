<?php

	$year = date('Y');
	$month = date('m');

	echo json_encode(array(
	
		array(
			'id' => 111,
			'title' => "Стрижка длинных волос",
			'start' => "$year-$month-10",
			'url' => "http://ya.ru"
		),
		
		array(
			'id' => 222,
			'title' => "Стрижка коротких волос",
			'start' => "$year-$month-20",
			'end' => "$year-$month-22",
			'url' => "http://google.com/"
		)
	
	));

?>
