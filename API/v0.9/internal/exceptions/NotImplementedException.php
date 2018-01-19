<?php declare(strict_types=1);
namespace HandbookAPI;

@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/settings.php');
require_once($BASEPATH . '/v0.9/internal/exceptions/Exception.php');

class NotImplementedException extends Exception
{
	const TYPE = 'NotImplementedException';
	const STATUS = 501;

	public function __construct()
	{
		parent::__construct('The requested feature has not been implemented.');
	}
}
