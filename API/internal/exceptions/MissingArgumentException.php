<?php
namespace OdyMaterialyAPI;

@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/exceptions/Exception.php');

class MissingArgumentException extends Exception
{
	const TYPE = 'MissingArgumentException';
	const STATUS = 400;

	const GET = "GET";
	const POST = "POST";
	const FILE = "FILE";

	public function __construct($type, $name)
	{
		parent::__construct($type . ' argument "' . $name . '" must be provided.');
	}
}
