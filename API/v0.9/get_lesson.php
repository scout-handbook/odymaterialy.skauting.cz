<?php
const _API_EXEC = 1;

header('content-type:text/markdown; charset=utf-8');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/database.secret.php');

if(!isset($_GET['id']))
{
	throw new Exception('GET argument "id" must be provided.');
}

$id = $_GET['id'];

$db = new mysqli(OdyMaterialyAPI\DB_SERVER, OdyMaterialyAPI\DB_USER, OdyMaterialyAPI\DB_PASSWORD, OdyMaterialyAPI\DB_DBNAME);

if ($db->connect_error)
{
	throw new Exception('Failed to connect to the database. Error: ' . $db->connect_error);
}

$sql = <<<SQL
SELECT body FROM lessons WHERE id = ?;
SQL;

$statement = $db->prepare($sql);
if ($statement === false)
{
	throw new Exception('Invalid SQL: "' . $sql . '". Error: ' . $db->error);
}
$statement->bind_param('i', $id);
$statement->execute();

$statement->store_result();
$body = '';
$statement->bind_result($body);
if (!$statement->fetch())
{
	throw new Exception('No lesson with the id "' . $id . '" found.');
}
$result = $body;
$statement->close();
$db->close();

echo $result;
