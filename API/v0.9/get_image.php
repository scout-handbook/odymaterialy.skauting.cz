<?php
const _API_EXEC = 1;

require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/exceptions/Exception.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/exceptions/ArgumentException.php');

use Ramsey\Uuid\Uuid;

function getImage()
{
	if(!isset($_GET['id']))
	{
		throw new OdyMaterialyAPI\ArgumentException(OdyMaterialyAPI\ArgumentException::GET, 'id');
	}
	$id = Uuid::fromString($_GET['id'])->__toString();
	$quality = "web";
	if(isset($_GET['quality']) and in_array($_GET['quality'], ['original', 'web', 'thumbnail']))
	{
		$quality = $_GET['quality'];
	}

	$file = $_SERVER['DOCUMENT_ROOT'] . '/images/' . $quality . '/' . $id . '.jpg';

	if(!file_exists($file))
	{
		http_response_code(404);
		return;
	}

	header('content-type: ' . mime_content_type($file));
	header('content-length: ' . filesize($file));

	$modified = filemtime($file);
	if(isset($_SERVER['HTTP_IF_MODIFIED_SINCE']))
	{
		$ifMod = new DateTime($_SERVER['HTTP_IF_MODIFIED_SINCE']);
		if($ifMod->format('U') > $modified)
		{
			http_response_code(304);
			return;
		}
	}

	header('last-modified: ' . date('r', $modified));
	readfile($file);
}

try
{
	getImage();
}
catch(OdyMaterialyAPI\Exception $e)
{
	echo($e);
}
