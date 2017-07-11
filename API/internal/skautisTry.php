<?php
namespace OdyMaterialyAPI;

@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/skautis.secret.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/database.secret.php');

function getRole($idPerson)
{
	$getRoleSQL = <<<SQL
SELECT role FROM users WHERE id = ?;
SQL;

	$db = new \mysqli(DB_SERVER, DB_USER, DB_PASSWORD, DB_DBNAME);
	if ($db->connect_error)
	{
		throw new \Exception('Failed to connect to the database. Error: ' . $db->connect_error);
	}
	$statement = $db->prepare($getRoleSQL);
	if($statement === false)
	{
		throw new \Exception('Invalid SQL: "' . $getRoleSQL . '". Error: ' . $db->error);
	}
	$statement->bind_param('i', $idPerson);
	$statement->execute();
	$statement->store_result();
	$role = '';
	$statement->bind_result($role);
	if(!$statement->fetch())
	{
		throw new \Exception('Error: User not in database even though they are logged in.');
		return 0;
	}
	return $role;
}

function skautisTry($success, $failure, $hardCheck = true)
{
	$skautis = \Skautis\Skautis::getInstance(SKAUTIS_APP_ID, SKAUTIS_TEST_MODE);
	if(isset($_COOKIE['skautis_token']) and isset($_COOKIE['skautis_timeout']))
	{
		$reconstructedPost = array(
			'skautIS_Token' => $_COOKIE['skautis_token'],
			'skautIS_IDRole' => '',
			'skautIS_IDUnit' => '',
			'skautIS_DateLogout' => \DateTime::createFromFormat('U', $_COOKIE['skautis_timeout'])
				->setTimezone(new \DateTimeZone('Europe/Prague'))->format('j. n. Y H:i:s'));
		$skautis->setLoginData($reconstructedPost);
		if($skautis->getUser()->isLoggedIn($hardCheck))
		{
			try
			{
				return $success($skautis);
			}
			catch(\Skautis\Exception $e)
			{
				return $failure($skautis);
			}
		}
		return $failure($skautis);
	}
	return $failure($skautis);
}

function editorTry($success, $failure, $hardCheck = true)
{
	$safeCallback = function($skautis) use ($success, $failure)
	{
		$role = getRole($skautis->UserManagement->UserDetail()->ID_Person);
		if($role === "editor" or $role === "administrator" or $role === "superuser")
		{
			$success($skautis);
		}
		else
		{
			$failure($skautis);
		}
	};
	skautisTry($safeCallback, $failure, $hardCheck);
}
