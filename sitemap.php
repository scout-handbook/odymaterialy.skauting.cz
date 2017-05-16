<?php

ob_start();
include('API/list_lessons.php');
$list = json_decode(ob_get_clean());

header('content-type:text/plain; charset=utf-8');

$baseUrl = 'https://odymaterialy.skauting.cz';

echo($baseUrl . "\n");
foreach($list as $field)
{
	foreach($field->lessons as $lesson)
	{
		echo($baseUrl . '/lesson/' . $lesson->id . '/' . rawurlencode($lesson->name) . "\n");
	}
}
