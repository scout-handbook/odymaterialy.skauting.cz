<?php

ob_start();
include('API/v0.9/list_lessons.php');
$list = json_decode(ob_get_clean());

header('content-type:text/plain; charset=utf-8');

$baseUrl = 'https://odymaterialy.skauting.cz';

echo($baseUrl . "\n");
foreach($list as $field)
{
	if(isset($field->id))
	{
		echo($baseUrl . '/field/' . $field->id . '/' . rawurlencode($field->name) . "\n");
	}
	foreach($field->lessons as $lesson)
	{
		echo($baseUrl . '/lesson/' . $lesson->id . '/' . rawurlencode($lesson->name) . "\n");
	}
}
