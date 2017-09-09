<?php
namespace OdyMaterialyAPI;

@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/exceptions/Exception.php');

class NotFoundException extends Exception
{
	const TYPE = 'NotFoundException';
	const STATUS = 404;

	public function __construct($resource_name)
	{
		parent::__construct('No such ' . $resource_name . ' has been found.');
	}
}
