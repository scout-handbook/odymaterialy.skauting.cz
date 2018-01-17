<?php declare(strict_types=1);
namespace OdyMaterialyAPI;

@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Helper.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/LessonContainer.php');

use \Ramsey\Uuid\Uuid;

class Field extends LessonContainer implements \JsonSerializable
{
	public $id;
	public $name;

	public function __construct(string $id, string $name)
	{
		$this->id = $id;
		$this->name = Helper::xssSanitize($name);
	}

	public function jsonSerialize() : array
	{
		return ['id' => Uuid::fromBytes($this->id), 'name' => $this->name, 'lessons' => $this->lessons];
	}
}
