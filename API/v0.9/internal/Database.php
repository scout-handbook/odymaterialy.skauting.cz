<?php
namespace OdyMaterialyAPI;

@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/database.secret.php');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/exceptions/ConnectionException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/exceptions/ExecutionException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/exceptions/NotFoundException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/exceptions/QueryException.php');

class Database
{
	private static $db;
	private static $instanceCount;
	private $SQL;
	private $statement;

	public function __construct()
	{
		if(!isset(self::$db))
		{
			self::$db = new \mysqli(DB_SERVER, DB_USER, DB_PASSWORD, DB_DBNAME);
			if(self::$db->connect_error)
			{
				throw new ConnectionException(self::$db);
			}
		}
		self::$instanceCount = self::$instanceCount + 1;
	}

	public function prepare($SQL)
	{
		$this->SQL = $SQL;
		if(isset($this->statement))
		{
			$this->statement->close();
		}
		$this->statement = self::$db->prepare($this->SQL);
		if(!$this->statement)
		{
			throw new QueryException($this->SQL, self::$db);
		}
	}

	public function bind_param($type, ...$vars)
	{
		$this->statement->bind_param($type, ...$vars);
	}

	public function execute($resource_name = "")
	{
		if(!$this->statement->execute())
		{
			if($this->statement->errno == 1452) // Foreign key constraint fail
			{
				throw new NotFoundException($resource_name);
			}
			throw new ExecutionException($this->SQL, $this->statement);
		}
	}

	public function bind_result(&...$vars)
	{
		$this->statement->store_result();
		$this->statement->bind_result(...$vars);
	}

	public function fetch()
	{
		return $this->statement->fetch();
	}

	public function fetch_require($resource_name)
	{
		if(!$this->fetch())
		{
			throw new NotFoundException($resource_name);
		}
	}

	public function fetch_all()
	{
		return $this->statement->get_result()->fetch_all(MYSQLI_ASSOC);
	}

	public function start_transaction()
	{
		self::$db->autocommit(false);
	}

	public function finish_transaction()
	{
		self::$db->commit();
		self::$db->autocommit(true);
	}

	public function __destruct()
	{
		if(isset($this->statement))
		{
			$this->statement->close();
		}
		self::$instanceCount = self::$instanceCount - 1;
		if(self::$instanceCount === 0)
		{
			self::$db->close();
			self::$db = null;
		}
	}
}
