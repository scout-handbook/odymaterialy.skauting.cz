<?php declare(strict_types=1);
namespace HandbookAPI;

@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Helper.php');

class Competence implements \JsonSerializable
{
	public $id;
	public $number;
	public $name;
	public $description;

	public function __construct(string $id, int $number, string $name, string $description)
	{
		$this->id = $id;
		$this->number = $number;
		$this->name = Helper::xssSanitize($name);
		$this->description = Helper::xssSanitize($description);
	}

	public function jsonSerialize() : array
	{
		return ['id' => \Ramsey\Uuid\Uuid::fromBytes($this->id), 'number' => $this->number, 'name' => $this->name, 'description' => $this->description];
	}
}
