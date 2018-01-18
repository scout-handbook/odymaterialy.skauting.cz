<?php declare(strict_types=1);
namespace HandbookAPI;

@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/exceptions/Exception.php');

class RoleException extends Exception
{
	const TYPE = 'RoleException';
	const STATUS = 403;

	public function __construct()
	{
		parent::__construct('You don\'t have permission for this action.');
	}
}
