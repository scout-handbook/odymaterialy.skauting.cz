<?php
const _API_EXEC = 1;

header('content-type:text/markdown; charset=utf-8');
require_once('database.secret.php');

if (!isset($_GET['name']))
{
	throw new Exception('GET argument "name" must be provided.');
}

$name = $_GET['name'];

$db = new mysqli(DB_SERVER, DB_USER, DB_PASSWORD, DB_DBNAME);

if ($db->connect_error)
{
	throw new Exception('Failed to connect to the database. Error: ' . $db->connect_error);
}

$sql = <<<SQL
SELECT body FROM lessons WHERE name = ?;
SQL;

$statement = $db->prepare($sql);
if ($statement === false)
{
	throw new Exception('Invalid SQL: "' . $sql . '". Error: ' . $db->error);
}
$statement->bind_param('s', $name);
$statement->execute();

$statement->store_result();
$body = "";
$statement->bind_result($body);
if (!$statement->fetch())
{
	throw new Exception('No lesson with the name "' . $name . '" found.');
}
$result = $body;
if ($statement->fetch())
{
	throw new Exception('More than one lesson with the name "' . $name . '" found. This should never happen.');
}
$statement->close();
$db->close();

echo $result;
