<?php
defined(api_exec) or die('Restricted access.');

class db
{
	function __construct()
	{
		$this->connect();
	}

	function __destruct()
	{
		$this->close();
	}

	function connect()
	{
	}

	function close()
	{
	}
}
?>

