<?php
namespace OdyMaterialyAPI;

@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/exceptions/Exception.php');

class ArgumentException extends Exception
{
	const TYPE = 'ArgumentException';
	const STATUS = 400;

	const GET = "GET";
	const POST = "POST";

	public function __construct($type, $name)
	{
		parent::__construct($type . ' argument "' . $name . '" must be provided.');
	}
}
