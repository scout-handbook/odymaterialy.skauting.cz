<?php declare(strict_types=1);
@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Database.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Endpoint.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Helper.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Role.php');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/exceptions/Exception.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/exceptions/InvalidArgumentTypeException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/exceptions/MissingArgumentException.php');

use Ramsey\Uuid\Uuid;

$imageEndpoint = new OdyMaterialyAPI\Endpoint();

function applyRotation(Imagick $image) : void
{
	switch($image->getImageOrientation())
	{
		case Imagick::ORIENTATION_TOPRIGHT:
			$image->flopImage();
			break;
		case Imagick::ORIENTATION_BOTTOMRIGHT:
			$image->rotateImage("#000", 180);
			break;
		case Imagick::ORIENTATION_BOTTOMLEFT:
			$image->flopImage();
			$image->rotateImage("#000", 180);
			break;
		case Imagick::ORIENTATION_LEFTTOP:
			$image->flopImage();
			$image->rotateImage("#000", -90);
			break;
		case Imagick::ORIENTATION_RIGHTTOP:
			$image->rotateImage("#000", 90);
			break;
		case Imagick::ORIENTATION_RIGHTBOTTOM:
			$image->flopImage();
			$image->rotateImage("#000", 90);
			break;
		case Imagick::ORIENTATION_LEFTBOTTOM:
			$image->rotateImage("#000", -90);
			break;
		default:
			break;
	}
	$image->setImageOrientation(Imagick::ORIENTATION_TOPLEFT);
}

$listImages = function(Skautis\Skautis $skautis, array $data, OdyMaterialyAPI\Endpoint $endpoint) : array
{
	$SQL = <<<SQL
SELECT id
FROM images
ORDER BY time DESC;
SQL;

	$db = new OdyMaterialyAPI\Database();
	$db->prepare($SQL);
	$db->execute();
	$id = '';
	$db->bind_result($id);
	$images = [];
	while($db->fetch())
	{
		$images[] = Uuid::fromBytes(strval($id))->__toString();
	}
	return ['status' => 200, 'response' => $images];
};
$imageEndpoint->setListMethod(new OdyMaterialyAPI\Role('editor'), $listImages);

$getImage = function(Skautis\Skautis $skautis, array $data, OdyMaterialyAPI\Endpoint $endpoint) : void
{
	$id = OdyMaterialyAPI\Helper::parseUuid($data['id'], 'image')->__toString();
	$quality = "web";
	if(isset($data['quality']) and in_array($data['quality'], ['original', 'web', 'thumbnail']))
	{
		$quality = $data['quality'];
	}

	$file = $_SERVER['DOCUMENT_ROOT'] . '/images/' . $quality . '/' . $id . '.jpg';

	if(!file_exists($file))
	{
		throw new OdyMaterialyAPI\NotFoundException('image');
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
$imageEndpoint->setGetMethod(new OdyMaterialyAPI\Role('guest'), $getImage);

$addImage = function(Skautis\Skautis $skautis, array $data, OdyMaterialyAPI\Endpoint $endpoint) : array
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
	$tmp = $_SERVER['DOCUMENT_ROOT'] . '/images/tmp/' . $uuid->__toString() . '.jpg';
	if(!move_uploaded_file($_FILES['image']['tmp_name'], $tmp))
	{
		throw new OdyMaterialyAPI\Exception('File upload failed.');
	}

	$db = new OdyMaterialyAPI\Database();
	$db->start_transaction();
	$db->prepare($SQL);
	$uuidBin = $uuid->getBytes();
	$db->bind_param('s', $uuidBin);
	$db->execute();

	$orig = $_SERVER['DOCUMENT_ROOT'] . '/images/original/' . $uuid->__toString() . '.jpg';
	$web = $_SERVER['DOCUMENT_ROOT'] . '/images/web/' . $uuid->__toString() . '.jpg';
	$thumbnail = $_SERVER['DOCUMENT_ROOT'] . '/images/thumbnail/' . $uuid->__toString() . '.jpg';

	$origMagick = new Imagick($tmp);
	$ICCProfile = $origMagick->getImageProfiles("icc", true);
	applyRotation($origMagick);
	$origMagick->stripImage();
	if(!empty($ICCProfile))
	{
		$origMagick->profileImage("icc", $ICCProfile['icc']);
	}
	$origMagick->writeImage($orig);
	chmod($orig, 0444);
	unlink($tmp);

	$webMagick = new Imagick($orig);
	$webMagick->thumbnailImage(770, 1400, true);
	$webMagick->setImageCompressionQuality(60);
	$webMagick->setFormat('JPEG');
	$webMagick->writeImage($web);
	chmod($web, 0444);

	$thumbMagick = new Imagick($orig);
	$thumbMagick->thumbnailImage(256, 256, true);
	$thumbMagick->setImageCompressionQuality(60);
	$thumbMagick->setFormat('JPEG');
	$thumbMagick->writeImage($thumbnail);
	chmod($thumbnail, 0444);

	$db->finish_transaction();
	return ['status' => 201];
};
$imageEndpoint->setAddMethod(new OdyMaterialyAPI\Role('editor'), $addImage);

$deleteImage = function(Skautis\Skautis $skautis, array $data, OdyMaterialyAPI\Endpoint $endpoint) : array
{
	$SQL = <<<SQL
DELETE FROM images
WHERE id = ?
LIMIT 1;
SQL;
	$countSQL = <<<SQL
SELECT ROW_COUNT();
SQL;

	$id = OdyMaterialyAPI\Helper::parseUuid($data['id'], 'image');

	$db = new OdyMaterialyAPI\Database();
	$db->start_transaction();

	$db->prepare($SQL);
	$uuidBin = $id->getBytes();
	$db->bind_param('s', $uuidBin);
	$db->execute();

	$db->prepare($countSQL);
	$db->execute();
	$count = 0;
	$db->bind_result($count);
	$db->fetch_require('image');
	if($count != 1)
	{
		throw new OdyMaterialyAPI\NotFoundException("image");
	}

	$db->finish_transaction();

	unlink($_SERVER['DOCUMENT_ROOT'] . '/images/original/' . $id->__toString() . '.jpg');
	unlink($_SERVER['DOCUMENT_ROOT'] . '/images/web/' . $id->__toString() . '.jpg');
	unlink($_SERVER['DOCUMENT_ROOT'] . '/images/thumbnail/' . $id->__toString() . '.jpg');

	return ['status' => 200];
};
$imageEndpoint->setDeleteMethod(new OdyMaterialyAPI\Role('administrator'), $deleteImage);
