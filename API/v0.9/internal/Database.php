<?php declare(strict_types=1);
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
		self::$db = new \mysqli(DB_SERVER, DB_USER, DB_PASSWORD, DB_DBNAME);
		if(self::$db->connect_error)
		{
			throw new ConnectionException(self::$db);
		}
		self::$db->set_charset('utf8');
		self::$instanceCount = self::$instanceCount + 1;
	}

	public function prepare(string $SQL) : void
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

	public function bind_param(string $type, ...$vars) : void
	{
		$this->statement->bind_param($type, ...$vars);
	}

	public function execute(string $resourceName = "") : void
	{
		if(!$this->statement->execute())
		{
			if($this->statement->errno == 1452) // Foreign key constraint fail
			{
				throw new NotFoundException($resourceName);
			}
			throw new ExecutionException($this->SQL, $this->statement);
		}
	}

	public function bind_result(&...$vars) : void
	{
		$this->statement->store_result();
		$this->statement->bind_result(...$vars);
	}

	public function fetch() : ?bool // Nullable return type
	{
		return $this->statement->fetch();
	}

	public function fetch_require(string $resourceName) : void
	{
		if(!$this->fetch())
		{
			throw new NotFoundException($resourceName);
		}
	}

	public function fetch_all() : array
	{
		return $this->statement->get_result()->fetch_all(MYSQLI_ASSOC);
	}

	public function start_transaction() : void
	{
		self::$db->autocommit(false);
	}

	public function finish_transaction() : void
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
		}
	}
}
