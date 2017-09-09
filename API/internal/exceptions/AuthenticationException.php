<?php
namespace OdyMaterialyAPI;

@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/exceptions/Exception.php');

class AuthenticationException extends Exception
{
	const TYPE = 'AuthenticationException';

	public function __construct()
	{
		parent::__construct('Authentication failed.');
	}
}
