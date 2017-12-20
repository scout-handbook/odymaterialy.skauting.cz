<?php declare(strict_types=1);
namespace OdyMaterialyAPI;

@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/exceptions/Exception.php');

class ExecutionException extends Exception
{
	const TYPE = 'ExecutionException';
	const STATUS = 500;

	public function __construct(string $query, mysqli_stmt $statement)
	{
		parent::__construct('Query "' . $query . '" has failed. Error message: "' . $statement->error . '".');
	}
}
