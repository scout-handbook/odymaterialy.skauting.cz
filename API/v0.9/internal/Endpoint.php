<?php
namespace OdyMaterialyAPI;

@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/skautisTry.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Role.php');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/exceptions/Exception.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/exceptions/MissingArgumentException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/exceptions/NotFoundException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/exceptions/NotImplementedException.php');

class Endpoint
{
	private $resourceName;
	private $subEndpoints;
	private $parentEndpoint;

	private $listFunction;
	private $listRole;
	
	private $getFunction;
	private $getRole;

	private $updateFunction;
	private $updateRole;

	private $addFunction;
	private $addRole;

	private $deleteFunction;
	private $deleteRole;

	public function __construct($resourceName)
	{
		$this->resourceName = $resourceName;
		$this->subEndpoints = [];

		$this->listFunction = function($skautis, $data, $endpoint)
		{
			throw new NotImplementedException();
		};
		$this->listRole = new Role('guest');

		$this->getFunction = function($skautis, $data, $endpoint)
		{
			throw new NotImplementedException();
		};
		$this->getRole = new Role('guest');

		$this->updateFunction = function($skautis, $data, $endpoint)
		{
			throw new NotImplementedException();
		};
		$this->updateRole = new Role('guest');

		$this->addFunction = function($skautis, $data, $endpoint)
		{
			throw new NotImplementedException();
		};
		$this->addRole = new Role('guest');

		$this->deleteFunction = function($skautis, $data, $endpoint)
		{
			throw new NotImplementedException();
		};
		$this->deleteRole = new Role('guest');
	}

	public function addSubEndpoint($name, $endpoint)
	{
		$this->subEndpoints[$name] = $endpoint;
		$this->subEndpoints[$name]->parentEndpoint = $this;
	}

	public function getParent()
	{
		return $this->parentEndpoint;
	}

	public function setListMethod($minimalRole, $callback)
	{
		$this->listRole = $minimalRole;
		$this->listFunction = $callback;
	}

	public function setGetMethod($minimalRole, $callback)
	{
		$this->getRole = $minimalRole;
		$this->getFunction = $callback;
	}

	public function setUpdateMethod($minimalRole, $callback)
	{
		$this->updateRole = $minimalRole;
		$this->updateFunction = $callback;
	}

	public function setAddMethod($minimalRole, $callback)
	{
		$this->addRole = $minimalRole;
		$this->addFunction = $callback;
	}

	public function setDeleteMethod($minimalRole, $callback)
	{
		$this->deleteRole = $minimalRole;
		$this->deleteFunction = $callback;
	}

	public function parseUuid($id)
	{
		try
		{
			return \Ramsey\Uuid\Uuid::fromString($id);
		}
		catch(\Ramsey\Uuid\Exception\InvalidUuidStringException $e)
		{
			throw new NotFoundException($this->resourceName);
		}
	}

	public function xssSanitize($input)
	{
		return htmlspecialchars($input, ENT_QUOTES | ENT_HTML5, 'UTF-8');
	}

	public function call($method, $role, $data)
	{
		switch($method)
		{
		case 'PUT':
			if(isset($data['id']) or isset($data['parent-id']))
			{
				$func = $this->updateFunction;
			}
			else
			{
				throw new MissingArgumentException(MissingArgumentException::POST, 'id');
			}
			break;
		case 'POST':
			$func = $this->addFunction;
			break;
		case 'DELETE':
			if(isset($data['id']) or isset($data['parent-id']))
			{
				$func = $this->deleteFunction;
			}
			else
			{
				throw new MissingArgumentException(MissingArgumentException::GET, 'id');
			}
			break;
		case 'GET':
		default:
			if(isset($data['id']))
			{
				$func = $this->getFunction;
			}
			else
			{
				$func = $this->listFunction;
			}
			break;
		}
		$self = $this;
		$wrapper = function($skautis) use ($data, $func, $self)
		{
			return $func($skautis, $data, $self);
		};
		$hardCheck = (Role_cmp($role, new Role('user')) > 0);
		$ret = roleTry($wrapper, $hardCheck, $role);
		if(isset($ret))
		{
			return $ret;
		}
	}

	public function handle_self($method, $data)
	{
		unset($data['sub-id']);
		unset($data['sub-resource']);
		switch($method)
		{
		case 'PUT':
			$role = $this->updateRole;
			break;
		case 'POST':
			$role = $this->addRole;
			break;
		case 'DELETE':
			$role = $this->deleteRole;
			break;
		case 'GET':
		default:
			if(isset($data['id']))
			{
				$role = $this->getRole;
			}
			else
			{
				$role = $this->listRole;
			}
			break;
		}
		try
		{
			header('content-type: application/json; charset=utf-8');
			$ret = $this->call($method, $role, $data);
		}
		catch(Exception $e)
		{
			header('content-type:application/json; charset=utf-8');
			$ret = $e->handle();
		}
		if(isset($ret))
		{
			http_response_code($ret['status']);
			echo(json_encode($ret, JSON_UNESCAPED_UNICODE));
		}
	}

	public function handle()
	{
		$method = $_SERVER['REQUEST_METHOD'];
		switch($method)
		{
			case 'PUT':
				parse_str(file_get_contents("php://input"), $data);
				break;
			case 'POST':
				$data = $_POST;
				break;
			case 'GET':
			case 'DELETE':
			default:
				$data = $_GET;
				break;
		}
		if(isset($_GET['id']) and $_GET['id'] !== '')
		{
			$data['id'] = $_GET['id'];
		}
		elseif(!isset($_POST['id']))
		{
			unset($data['id']);
		}

		if(isset($data['id']) and isset($_GET['sub-resource']) and $_GET['sub-resource'] !== '')
		{
		   	if(isset($this->subEndpoints[$_GET['sub-resource']]))
			{
				$data['parent-id'] = $data['id'];
				if(isset($_GET['sub-id']) and $_GET['sub-id'] !== '')
				{
					$data['id'] = $_GET['sub-id'];
				}
				else
				{
					unset($data['id']);
				}
				$this->subEndpoints[$_GET['sub-resource']]->handle_self($method, $data);
			}
			else
			{
				http_response_code(404);
				include_once($_SERVER['DOCUMENT_ROOT'] . '/error/404.html');
				die();
			}
		}
		else
		{
			$this->handle_self($method, $data);
		}
	}
}
