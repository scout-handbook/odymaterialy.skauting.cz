<?php
namespace OdyMaterialyAPI;

@_API_EXEC === 1 or die('Restricted access.');

class Exception extends \Exception implements \JsonSerializable
{
	const TYPE = 'Exception';
	const STATUS = 500;

	public function handle()
	{
		return ['status' => static::STATUS, 'type' => static::TYPE, 'message' => $this->getMessage()];
	}

	public function jsonSerialize() // TODO: Remove
	{
		return ['success' => false, 'type' => static::TYPE, 'message' => $this->getMessage()];
	}

	public function __toString() // TODO: Remove
	{
		return json_encode($this, JSON_UNESCAPED_UNICODE);
	}
}
