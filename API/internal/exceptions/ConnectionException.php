<?php
namespace OdyMaterialyAPI;

@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/exceptions/APIException.php');

class ConnectionException extends APIException
{
	const TYPE = 'ConnectionException';

	public function __construct($db)
	{
		parent::__construct('Database connection request failed. Error message: "' . $db->connect_error . '".');
	}
}
