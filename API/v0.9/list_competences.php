<?php
const _API_EXEC = 1; // Required by includes

header('content-type:application/json; charset=utf-8');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/database.secret.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/Competence.php');

// Prepared statements where ? will be replaced later

$sql = <<<SQL
SELECT id, number, name, description FROM competences ORDER BY number;
SQL;

// Open database connection

$db = new mysqli(OdyMaterialyAPI\DB_SERVER, OdyMaterialyAPI\DB_USER, OdyMaterialyAPI\DB_PASSWORD, OdyMaterialyAPI\DB_DBNAME);

if ($db->connect_error)
{
	throw new Exception('Failed to connect to the database. Error: ' . $db->connect_error);
}

// Select all the fields in the database

$statement = $db->prepare($sql);
if ($statement === false)
{
	throw new Exception('Invalid SQL: "' . $sql . '". Error: ' . $db->error);
}
$statement->execute();

$statement->store_result();
$id = '';
$number = '';
$name = '';
$description = '';
$statement->bind_result($id, $number, $name, $description);
$competences = array();
while ($statement->fetch())
{
	$competences[] = new OdyMaterialyAPI\Competence($id, $number, $name, $description); // Create a new field
}
$statement->close();
$db->close();

echo(json_encode($competences, JSON_UNESCAPED_UNICODE));
