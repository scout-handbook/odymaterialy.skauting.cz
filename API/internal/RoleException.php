<?php
namespace OdyMaterialyAPI;

@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/APIException.php');

class RoleException extends APIException
{
	const TYPE = 'RoleException';

	public function __construct()
	{
		parent::__construct('You don\'t have permission for this action.');
	}
}
