<?php
const _API_EXEC = 1; // Required by includes

header('content-type:application/json; charset=utf-8');
require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/APIException.php');

use Ramsey\Uuid\Uuid;

function listImages()
{
	$files = scandir($_SERVER['DOCUMENT_ROOT'] . '/images/thumbnail/');
	$images = array();
	foreach($files as $file)
	{
		if($file == '.' or $file == '..')
		{
			continue;
		}
		$name = pathinfo($file, PATHINFO_FILENAME);
		try
		{
			$images[] = Uuid::fromString($name)->__toString();
		}
		catch(Ramsey\Uuid\Exception\InvalidUuidStringException $e) {}
	}
	echo(json_encode($images, JSON_UNESCAPED_UNICODE));
}

try
{
	listImages();
}
catch(OdymaterialyAPI\APIException $e)
{
	echo($e);
}
