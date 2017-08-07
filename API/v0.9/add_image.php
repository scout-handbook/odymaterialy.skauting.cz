<?php
const _API_EXEC = 1;

require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/skautisTry.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/APIException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/ArgumentException.php');

use Ramsey\Uuid\Uuid;

function addImage()
{
	if(!isset($_FILES['image']))
	{
		throw new OdyMaterialyAPI\ArgumentException(OdyMaterialyAPI\ArgumentException::POST, 'image');
	}
	if(!getimagesize($_FILES['image']['tmp_name']))
	{
		throw new OdyMaterialyAPI\APIException('File is not an image.');
	}
	if(!in_array(strtolower(pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION)), ['jpg', 'jpeg', 'png']))
	{
		throw new OdyMaterialyAPI\APIException('Invalid image type. Use PNG or JPEG files.');
	}
	$uuid = Uuid::uuid4()->__toString();
	$orig = $_SERVER['DOCUMENT_ROOT'] . '/images/original/' . $uuid . '.jpg';
	if(!move_uploaded_file($_FILES['image']['tmp_name'], $orig))
	{
		throw new OdyMaterialyAPI\APIException('File upload failed.');
	}
	$web = $_SERVER['DOCUMENT_ROOT'] . '/images/web/' . $uuid . '.jpg';
	$thumbnail = $_SERVER['DOCUMENT_ROOT'] . '/images/thumbnail/' . $uuid . '.jpg';

	$webmagick = new Imagick($orig);
	$webmagick->thumbnailImage(770, 1400, true);
	$webmagick->setImageCompressionQuality(60);
	$webmagick->setFormat('JPEG');
	$webmagick->writeImage($web);

	$thumbmagick = new Imagick($orig);
	$thumbmagick->thumbnailImage(256, 256, true);
	$thumbmagick->setImageCompressionQuality(60);
	$thumbmagick->setFormat('JPEG');
	$thumbmagick->writeImage($thumbnail);
}

try
{
	OdyMaterialyAPI\editorTry('addImage', true);
	echo(json_encode(array('success' => true)));
}
catch(OdyMaterialyAPI\APIException $e)
{
	echo($e);
}
