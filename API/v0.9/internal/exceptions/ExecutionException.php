<?php
namespace OdyMaterialyAPI;

@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/exceptions/Exception.php');

class ExecutionException extends Exception
{
	const TYPE = 'ExecutionException';
	const STATUS = 500;

	public function __construct($SQL, $statement)
	{
		parent::__construct('Query "' . $SQL . '" has failed. Error message: "' . $statement->error . '".');
	}
}
