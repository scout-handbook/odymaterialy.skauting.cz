<?php
namespace OdyMaterialyAPI;

@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/exceptions/Exception.php');

class NotFoundException extends Exception
{
	const TYPE = 'NotFoundException';
	const STATUS = 404;

	public function __construct($resourceName)
	{
		parent::__construct('No such ' . $resourceName . ' has been found.');
	}
}
