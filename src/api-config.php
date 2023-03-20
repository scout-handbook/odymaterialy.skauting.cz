<?php declare(strict_types=1);

@_API_EXEC === 1 or die('Restricted access.');

$CONFIG = (object)[
		'basepath' => $_SERVER['DOCUMENT_ROOT'] . '/API/legacy',
		'imagepath' => $_SERVER['DOCUMENT_ROOT'] . '/images',
		'cookieuri' => 'odymaterialy.skauting.cz',
		'baseuri' => 'https://odymaterialy.skauting.cz',
		'apiuri' => 'https://odymaterialy.skauting.cz/API'
	];
