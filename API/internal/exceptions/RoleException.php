<?php
namespace OdyMaterialyAPI;

@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/exceptions/Exception.php');

class RoleException extends Exception
{
	const TYPE = 'RoleException';
	const STATUS = 403;

	public function __construct()
	{
		parent::__construct('You don\'t have permission for this action.');
	}
}
