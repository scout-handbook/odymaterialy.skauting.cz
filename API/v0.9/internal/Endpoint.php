<?php declare(strict_types = 1);
namespace HandbookAPI;

@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/api-config.php');
require_once($CONFIG->basepath . '/v0.9/internal/skautisTry.php');
require_once($CONFIG->basepath . '/v0.9/internal/Role.php');

require_once($CONFIG->basepath . '/v0.9/internal/exceptions/Exception.php');
require_once($CONFIG->basepath . '/v0.9/internal/exceptions/MissingArgumentException.php');
require_once($CONFIG->basepath . '/v0.9/internal/exceptions/NotImplementedException.php');

class Endpoint
{
	private $parentEndpoint;
	private $subEndpoints;

	private $listFunction;
	private $getFunction;
	private $updateFunction;
	private $addFunction;
	private $deleteFunction;

	private $listRole;
	private $getRole;
	private $updateRole;
	private $addRole;
	private $deleteRole;

	public function __construct()
	{
		$this->subEndpoints = [];

		$this->listFunction = function() : void
		{
			throw new NotImplementedException();
		};
		$this->getFunction = function() : void
		{
			throw new NotImplementedException();
		};
		$this->updateFunction = function() : void
		{
			throw new NotImplementedException();
		};
		$this->addFunction = function() : void
		{
			throw new NotImplementedException();
		};
		$this->deleteFunction = function() : void
		{
			throw new NotImplementedException();
		};

		$this->listRole = new Role('guest');
		$this->getRole = new Role('guest');
		$this->updateRole = new Role('guest');
		$this->addRole = new Role('guest');
		$this->deleteRole = new Role('guest');
	}

	public function addSubEndpoint(string $name, Endpoint $endpoint) : void
	{
		$this->subEndpoints[$name] = $endpoint;
		$this->subEndpoints[$name]->parentEndpoint = $this;
	}

	public function getParent() : Endpoint
	{
		return $this->parentEndpoint;
	}

	public function setListMethod(Role $minimalRole, callable $callback) : void
	{
		$this->listRole = $minimalRole;
		$this->listFunction = $callback;
	}

	public function setGetMethod(Role $minimalRole, callable $callback) : void
	{
		$this->getRole = $minimalRole;
		$this->getFunction = $callback;
	}

	public function setUpdateMethod(Role $minimalRole, callable $callback) : void
	{
		$this->updateRole = $minimalRole;
		$this->updateFunction = $callback;
	}

	public function setAddMethod(Role $minimalRole, callable $callback) : void
	{
		$this->addRole = $minimalRole;
		$this->addFunction = $callback;
	}

	public function setDeleteMethod(Role $minimalRole, callable $callback) : void
	{
		$this->deleteRole = $minimalRole;
		$this->deleteFunction = $callback;
	}

	public function call(string $method, Role $role, array $data) : array
	{
		$func = $this->callFunctionHelper($method, $data);
		$self = $this;
		$wrapper = function(\Skautis\Skautis $skautis) use ($data, $func, $self) : array
		{
			return $func($skautis, $data, $self);
		};
		$hardCheck = (Role_cmp($role, new Role('user')) > 0);
		$ret = roleTry($wrapper, $hardCheck, $role);
		if(isset($ret))
		{
			return $ret;
		}
		return [];
	}

	private function callFunctionHelper(string $method, array $data) : callable
	{
		switch($method)
		{
			case 'PUT':
				if(isset($data['id']) or isset($data['parent-id']))
				{
					return $this->updateFunction;
				}
				else
				{
					throw new MissingArgumentException(MissingArgumentException::POST, 'id');
				}
				break;
			case 'POST':
				return $this->addFunction;
			case 'DELETE':
				if(isset($data['id']) or isset($data['parent-id']))
				{
					return $this->deleteFunction;
				}
				else
				{
					throw new MissingArgumentException(MissingArgumentException::GET, 'id');
				}
				break;
			case 'GET':
			default:
				return isset($data['id']) ? $this->getFunction : $this->listFunction;
		}
	}

	public function handleSelf(string $method, array $data) : void
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

	public function handle() : void
	{
		$method = $_SERVER['REQUEST_METHOD'];
		$data = $this->handleDataHelper($method);
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
				$this->subEndpoints[$_GET['sub-resource']]->handleSelf($method, $data);
			}
			else
			{
				http_response_code(404);
				header('content-type:application/json; charset=utf-8');
				echo(json_encode(['status' => 404], JSON_UNESCAPED_UNICODE));
			}
		}
		else
		{
			$this->handleSelf($method, $data);
		}
	}

	private function handleDataHelper(string $method) : array
	{
		$data = [];
		switch($method)
		{
			case 'PUT':
				mb_parse_str(file_get_contents("php://input"), $data);
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
		return $data;
	}
}
