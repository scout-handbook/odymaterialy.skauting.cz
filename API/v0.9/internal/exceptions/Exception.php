<?php
namespace OdyMaterialyAPI;

@_API_EXEC === 1 or die('Restricted access.');

class Exception extends \Exception
{
	const TYPE = 'Exception';
	const STATUS = 500;

	public function handle()
	{
		return ['status' => static::STATUS, 'type' => static::TYPE, 'message' => $this->getMessage()];
	}
}
