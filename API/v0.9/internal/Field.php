<?php declare(strict_types = 1);
namespace HandbookAPI;

@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/api-config.php');
require_once($CONFIG->basepath . '/vendor/autoload.php');
require_once($CONFIG->basepath . '/v0.9/internal/Helper.php');
require_once($CONFIG->basepath . '/v0.9/internal/LessonContainer.php');

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
		return ['id' => \Ramsey\Uuid\Uuid::fromBytes($this->id), 'name' => $this->name, 'lessons' => $this->lessons];
	}
}
