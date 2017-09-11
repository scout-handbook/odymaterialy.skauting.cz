<?php
namespace OdyMaterialyAPI;

@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/skautisTry.php');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/exceptions/Exception.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/exceptions/NotImplementedException.php');

class Endpoint
{
	private $resourceName;

	private $listFunction;
	private $listRole;
	private $listType;
	
	private $getFunction;
	private $getRole;
	private $getType;

	private $updateFunction;
	private $updateRole;
	private $updateType;

	private $addFunction;
	private $addRole;
	private $addType;

	private $deleteFunction;
	private $deleteRole;
	private $deleteType;

	public function __construct($resourceName)
	{
		$this->resourceName = $resourceName;

		$this->listFunction = function() {throw new NotImplementedException();};
		$this->listRole = new Role('guest');
		$this->listType = 'application/json';

		$this->getFunction = function() {throw new NotImplementedException();};
		$this->getRole = new Role('guest');
		$this->listType = 'application/json';

		$this->updateFunction = function() {throw new NotImplementedException();};
		$this->updateRole = new Role('guest');
		$this->listType = 'application/json';

		$this->addFunction = function() {throw new NotImplementedException();};
		$this->addRole = new Role('guest');
		$this->listType = 'application/json';

		$this->deleteFunction = function() {throw new NotImplementedException();};
		$this->deleteRole = new Role('guest');
		$this->listType = 'application/json';
	}

	public function setListMethod($minimalRole, $callback, $type = 'application/json')
	{
		$this->listRole = $minimalRole;
		$this->listFunction = $callback;
		$this->listType = $type;
	}

	public function setGetMethod($minimalRole, $callback, $type = 'application/json')
	{
		$this->getRole = $minimalRole;
		$this->getFunction = $callback;
		$this->getType = $type;
	}

	public function setUpdateMethod($minimalRole, $callback, $type = 'application/json')
	{
		$this->updateRole = $minimalRole;
		$this->updateFunction = $callback;
		$this->updateType = $type;
	}

	public function setAddMethod($minimalRole, $callback, $type = 'application/json')
	{
		$this->addRole = $minimalRole;
		$this->addFunction = $callback;
		$this->addType = $type;
	}

	public function setDeleteMethod($minimalRole, $callback, $type = 'application/json')
	{
		$this->deleteRole = $minimalRole;
		$this->deleteFunction = $callback;
		$this->deleteType = $type;
	}

	public function handle()
	{
		$method = $_SERVER['REQUEST_METHOD'];
		switch($method)
		{
			case 'GET':
			case 'DELETE':
				$data = $_GET;
				break;
			case 'PUT':
				parse_str(file_get_contents("php://input"), $data);
				break;
			case 'POST':
				$data = $_POST;
				break;
		}
		if(isset($_GET['id']))
		{
			$data['id'] = $_GET['id'];
		}
		if(isset($data['id']) and $data['id'] == '')
		{
			unset($data['id']);
		}
		try
		{
			if(isset($data['id']))
			{
				try
				{
					$data['id'] = \Ramsey\Uuid\Uuid::fromString($data['id']);
				}
				catch(\Ramsey\Uuid\Exception\InvalidUuidStringException $e)
				{
					throw new NotFoundException("lesson");
				}

				switch($method)
				{
				case 'GET':
					$func = $this->getFunction;
					$role = $this->getRole;
					$type = $this->getType;
					break;
				case 'PUT':
					$func = $this->updateFunction;
					$role = $this->updateRole;
					$type = $this->updateType;
					break;
				case 'POST':
					$func = $this->addFunction;
					$role = $this->addRole;
					$type = $this->addType;
					break;
				case 'DELETE':
					$func = $this->deleteFunction;
					$role = $this->deleteRole;
					$type = $this->deleteType;
					break;
				}
			}
			else
			{
				switch($method)
				{
				case 'GET':
					$func = $this->listFunction;
					$role = $this->listRole;
					$type = $this->listType;
					break;
				case 'PUT':
					throw new ArgumentException(ArgumentException::POST, 'id');
					break;
				case 'POST':
					$func = $this->addFunction;
					$role = $this->addRole;
					$type = $this->addType;
					break;
				case 'DELETE':
					throw new ArgumentException(ArgumentException::GET, 'id');
					break;
				}
			}
			$wrapper = function($skautis) use ($data, $func)
			{
				return $func($skautis, $data);
			};
			$hardCheck = (Role_cmp($role, new Role('user')) > 0);
			$ret = roleTry($wrapper, $hardCheck, $role);
			header('content-type:' . $type . '; charset=utf-8');
		}
		catch(Exception $e)
		{
			$ret = $e->handle();
			header('content-type:application/json; charset=utf-8');
		}
		http_response_code($ret['status']);
		echo(json_encode($ret, JSON_UNESCAPED_UNICODE));
	}
}
