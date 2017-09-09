<?php
namespace OdyMaterialyAPI;

@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/database.secret.php');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/exceptions/ConnectionException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/exceptions/ExecutionException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/exceptions/NotFoundException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/exceptions/QueryException.php');

class Database
{
	private static $db;
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

	public function execute()
	{
		if(!$this->statement->execute())
		{
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

	public function __destruct()
	{
		if(isset($this->statement))
		{
			$this->statement->close();
		}
	}
}
