<?php
namespace OdyMaterialyAPI;

@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/exceptions/Exception.php');

class QueryException extends Exception
{
	const TYPE = 'QueryException';

	public function __construct($SQL, $db)
	{
		parent::__construct('Invalid query: "' . $SQL . '". Error message: "' . $db->error . '".');
	}
}
