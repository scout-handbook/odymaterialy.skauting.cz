<?php
@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/Database.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/Endpoint.php');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/exceptions/Exception.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/exceptions/InvalidArgumentTypeException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/exceptions/MissingArgumentException.php');

use Ramsey\Uuid\Uuid;

$imageEndpoint = new OdymaterialyAPI\Endpoint('image');

$listImages = function($skautis, $data)
{
	$SQL = <<<SQL
SELECT id
FROM images
ORDER BY time DESC;
SQL;

	$db = new OdymaterialyAPI\Database();
	$db->prepare($SQL);
	$db->execute();
	$id = '';
	$db->bind_result($id);
	$images = array();
	while($db->fetch())
	{
		$images[] = Uuid::fromBytes($id)->__toString();
	}
	return ['status' => 200, 'response' => $images];
};
$imageEndpoint->setListMethod(new OdymaterialyAPI\Role('editor'), $listImages);

$getImage = function($skautis, $data)
{
	$id = $data['id']->__toString();
	$quality = "web";
	if(isset($data['quality']) and in_array($data['quality'], ['original', 'web', 'thumbnail']))
	{
		$quality = $data['quality'];
	}

	$file = $_SERVER['DOCUMENT_ROOT'] . '/images/' . $quality . '/' . $id . '.jpg';

	if(!file_exists($file))
	{
		throw new OdymaterialyAPI\NotFoundException('image');
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
};
$imageEndpoint->setGetMethod(new OdymaterialyAPI\Role('guest'), $getImage);

$addImage = function($skautis, $data)
{
	$SQL = <<<SQL
INSERT INTO images (id)
VALUES (?);
SQL;

	if(!isset($_FILES['image']))
	{
		throw new OdyMaterialyAPI\MissingArgumentException(OdyMaterialyAPI\MissingArgumentException::FILE, 'image');
	}
	if(!getimagesize($_FILES['image']['tmp_name']))
	{
		throw new OdyMaterialyAPI\InvalidArgumentTypeException('image', ['image/jpeg', 'image/png']);
	}
	if(!in_array(strtolower(pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION)), ['jpg', 'jpeg', 'png']))
	{
		throw new OdyMaterialyAPI\InvalidArgumentTypeException('image', ['image/jpeg', 'image/png']);
	}
	$uuid = Uuid::uuid4();
	$orig = $_SERVER['DOCUMENT_ROOT'] . '/images/original/' . $uuid->__toString() . '.jpg';
	if(!move_uploaded_file($_FILES['image']['tmp_name'], $orig))
	{
		throw new OdyMaterialyAPI\Exception('File upload failed.');
	}

	$db = new OdymaterialyAPI\Database();
	$db->prepare($SQL);
	$uuidBin = $uuid->getBytes();
	$db->bind_param('s', $uuidBin);
	$db->execute();

	$web = $_SERVER['DOCUMENT_ROOT'] . '/images/web/' . $uuid->__toString() . '.jpg';
	$thumbnail = $_SERVER['DOCUMENT_ROOT'] . '/images/thumbnail/' . $uuid->__toString() . '.jpg';

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
	return ['status' => 201];
};
$imageEndpoint->setAddMethod(new OdymaterialyAPI\Role('editor'), $addImage);
