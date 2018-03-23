<?php declare(strict_types = 1);
namespace HandbookAPI;

@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/settings.php');
require_once($BASEPATH . '/v0.9/internal/exceptions/Exception.php');

class RefusedException extends Exception
{
	const TYPE = 'RefusedException';
	const STATUS = 403;

	public function __construct()
	{
		parent::__construct('Operation has been refused by the server.');
	}
}
