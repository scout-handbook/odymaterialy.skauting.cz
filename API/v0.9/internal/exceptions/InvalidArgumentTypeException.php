<?php declare(strict_types = 1);
namespace HandbookAPI;

@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/api-config.php');
require_once($CONFIG->basepath . '/v0.9/internal/exceptions/Exception.php');

class InvalidArgumentTypeException extends Exception
{
	const TYPE = 'InvalidArgumentTypeException';
	const STATUS = 415;

	public function __construct(string $name, array $types)
	{
		$typesString = '';
		$first = true;
		foreach($types as $type)
		{
			if(!$first)
			{
				$typesString .= ', ';
			}
			$typesString .= $type;
			$first = false;
		}
		parent::__construct('Argument "' . $name . '" must be of type ' . $typesString . '.');
	}
}
