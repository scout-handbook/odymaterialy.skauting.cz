<?php declare(strict_types=1);

@_API_EXEC === 1 or die('Restricted access.');

stream_context_set_default(['ssl' => ['verify_peer' => false, 'verify_peer_name' => false]]);

$CONFIG = (object)[
		'basepath' => $_SERVER['DOCUMENT_ROOT'] . '/API',
		'imagepath' => $_SERVER['DOCUMENT_ROOT'] . '/images',
		'cookieuri' => 'odymaterialy.skauting.cz',
		'baseuri' => 'https://odymaterialy.skauting.cz',
		'apiuri' => 'https://odymaterialy.skauting.cz/API/v0.9'
	];
