<?php declare(strict_types = 1);
namespace HandbookAPI;

@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/settings.php');
require_once($BASEPATH . '/v0.9/internal/exceptions/Exception.php');

class SkautISException extends Exception
{
	const TYPE = 'SkautISException';
	const STATUS = 403;

	public function __construct(\Skautis\Exception $e)
	{
		parent::__construct('SkautIS error: ' . $e->getMessage());
	}
}
