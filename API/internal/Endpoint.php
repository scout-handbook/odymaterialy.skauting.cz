<?php
namespace OdyMaterialyAPI;

@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/skautisTry.php');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/exceptions/Exception.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/exceptions/NotImplementedException.php');

class Endpoint
{
	private $resourceName;
	private $list;
	private $get;
	private $update;
	private $add;
	private $delete;

	public function __construct($resourceName)
	{
		$this->resourceName = $resourceName;
		$this->list = function() {throw new NotImplementedException();};
		$this->get = function() {throw new NotImplementedException();};
		$this->update = function() {throw new NotImplementedException();};
		$this->add = function() {throw new NotImplementedException();};
		$this->delete = function() {throw new NotImplementedException();};
	}

	public function setListMethod($minimalRole, $callback)
	{
		$this->list = function($data) use ($minimalRole, $callback)
		{
			$wrapper = function($skautis) use ($data, $callback)
			{
				return $callback($skautis, $data);
			};
			$hardCheck = (Role_cmp($minimalRole, new Role('user')) > 0);
			return roleTry($wrapper, $hardCheck, $minimalRole);
		};
	}

	public function setGetMethod($minimalRole, $callback)
	{
		$this->get = function($data) use ($minimalRole, $callback)
		{
			$wrapper = function($skautis) use ($data, $callback)
			{
				return $callback($skautis, $data);
			};
			$hardCheck = (Role_cmp($minimalRole, new Role('user')) > 0);
			return roleTry($wrapper, $hardCheck, $minimalRole);
		};
	}

	public function setUpdateMethod($minimalRole, $callback)
	{
		$this->update = function($data) use ($minimalRole, $callback)
		{
			$wrapper = function($skautis) use ($data)
			{
				return $callback($skautis, $data);
			};
			$hardCheck = (Role_cmp($minimalRole, new Role('user')) > 0);
			return roleTry($wrapper, $hardCheck, $minimalRole);
		};
	}

	public function setAddMethod($minimalRole, $callback)
	{
		$this->add = function($data) use ($minimalRole, $callback)
		{
			$wrapper = function($skautis) use ($data)
			{
				return $callback($skautis, $data);
			};
			$hardCheck = (Role_cmp($minimalRole, new Role('user')) > 0);
			return roleTry($wrapper, $hardCheck, $minimalRole);
		};
	}

	public function setDeleteMethod($minimalRole, $callback)
	{
		$this->delete = function($data) use ($minimalRole, $callback)
		{
			$wrapper = function($skautis) use ($data)
			{
				return $callback($skautis, $data);
			};
			$hardCheck = (Role_cmp($minimalRole, new Role('user')) > 0);
			return roleTry($wrapper, $hardCheck, $minimalRole);
		};
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
			case 'POST':
				$data = $_POST;
				break;
		}
		if(isset($data['id']) and $data['id'] == '')
		{
			unset($data['id']);
		}
		try
		{
			if(isset($data['id']))
			{
				switch($method)
				{
				case 'GET':
					$ret = ($this->get)($data);
					break;
				case 'PUT':
					$ret = ($this->update)($data);
					break;
				case 'POST':
					$ret = ($this->add)($data);
					break;
				case 'DELETE':
					$ret = ($this->delete)($data);
					break;
				}
			}
			else
			{
				switch($method)
				{
				case 'GET':
					$ret = ($this->list)($data);
					break;
				case 'PUT':
					$ret = ($this->update)($data);
					break;
				case 'POST':
					throw new ArgumentException(ArgumentException::POST, 'id');
					break;
				case 'DELETE':
					throw new ArgumentException(ArgumentException::GET, 'id');
					break;
				}
			}
		}
		catch(Exception $e)
		{
			$ret = $e->handle();
		}
		http_response_code($ret['status']);
		echo(json_encode($ret, JSON_UNESCAPED_UNICODE));
	}
}
