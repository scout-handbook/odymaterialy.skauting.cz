<?php declare(strict_types=1);
namespace HandbookAPI;

@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Helper.php');

class Group implements \JsonSerializable
{
	public $id;
	public $name;
	public $count;

	public function __construct(string $id, string $name, int $count)
	{
		$this->id = $id;
		$this->name = Helper::xssSanitize($name);
		$this->count = $count;
	}

	public function jsonSerialize() : array
	{
		return ['id' => \Ramsey\Uuid\Uuid::fromBytes($this->id), 'name' => $this->name, 'count' => $this->count];
	}
}
