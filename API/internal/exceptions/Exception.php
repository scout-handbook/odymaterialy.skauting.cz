<?php
namespace OdyMaterialyAPI;

@_API_EXEC === 1 or die('Restricted access.');

class Exception extends \Exception implements \JsonSerializable
{
	const TYPE = 'Exception';

	public function handle()
	{
		return ['success' => false, 'type' => static::TYPE, 'message' => $this->getMessage()];
	}

	public function jsonSerialize() // TODO: Remove
	{
		return handle();
	}

	public function __toString() // TODO: Remove
	{
		return json_encode($this, JSON_UNESCAPED_UNICODE);
	}
}
