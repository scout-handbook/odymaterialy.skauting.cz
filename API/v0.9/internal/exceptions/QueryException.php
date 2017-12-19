<?php
namespace OdyMaterialyAPI;

@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/exceptions/Exception.php');

class QueryException extends Exception
{
	const TYPE = 'QueryException';
	const STATUS = 500;

	public function __construct($query, $db)
	{
		parent::__construct('Invalid query: "' . $query . '". Error message: "' . $db->error . '".');
	}
}
