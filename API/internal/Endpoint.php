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
	private $put;
	private $post;
	private $delete;

	public function __construct($resourceName)
	{
		$this->resourceName = $resourceName;
		$this->list = function() {throw new NotImplementedException();};
		$this->get = function() {throw new NotImplementedException();};
		$this->put = function() {throw new NotImplementedException();};
		$this->post = function() {throw new NotImplementedException();};
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

	public function setPutMethod($minimalRole, $callback)
	{
		$this->put = function($data) use ($minimalRole, $callback)
			{
				$wrapper = function($skautis) use ($data)
					{
						return $callback($skautis, $data);
					};
				$hardCheck = (Role_cmp($minimalRole, new Role('user')) > 0);
				return roleTry($wrapper, $hardCheck, $minimalRole);
			};
	}

	public function setPostMethod($minimalRole, $callback)
	{
		$this->post = function($data) use ($minimalRole, $callback)
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
			switch($method)
			{
				case 'GET':
					if(isset($data['id']))
					{
						$ret = ($this->get)($data);
					}
					else
					{
						$ret = ($this->list)($data);
					}
					break;
				case 'PUT':
					$ret = ($this->put)($data);
					break;
				case 'POST':
					if(!isset($data['id']))
					{
						throw new ArgumentException(ArgumentException::GET, 'id');
					}
					$ret = ($this->post)($data);
					break;
				case 'DELETE':
					if(!isset($data['id']))
					{
						throw new ArgumentException(ArgumentException::GET, 'id');
					}
					$ret = ($this->delete)($data);
					break;
			}
		}
		catch(Exception $e)
		{
			$ret = $e->handle();
		}
		echo(json_encode($ret, JSON_UNESCAPED_UNICODE));
	}
}
