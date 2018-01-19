<?php declare(strict_types=1);
namespace HandbookAPI;

require_once($_SERVER['DOCUMENT_ROOT'] . '/settings.php');
require_once($BASEPATH . '/vendor/autoload.php');
require_once($BASEPATH . '/v0.9/internal/exceptions/NotFoundException.php');

@_API_EXEC === 1 or die('Restricted access.');

class Helper
{
	public static function parseUuid(string $id, string $resourceName) : \Ramsey\Uuid\UuidInterface
	{
		try
		{
			return \Ramsey\Uuid\Uuid::fromString($id);
		}
		catch(\Ramsey\Uuid\Exception\InvalidUuidStringException $e)
		{
			throw new NotFoundException($resourceName);
		}
	}

	public static function xssSanitize(string $input) : string
	{
		return htmlspecialchars($input, ENT_QUOTES | ENT_HTML5, 'UTF-8');
	}
}
