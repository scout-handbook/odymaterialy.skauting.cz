<?php
namespace OdyMaterialyAPI;

@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/exceptions/APIException.php');

class ArgumentException extends APIException
{
	const TYPE = 'ArgumentException';

	const GET = "GET";
	const POST = "POST";

	public function __construct($type, $name)
	{
		parent::__construct($type . ' argument "' . $name . '" must be provided.');
	}
}
