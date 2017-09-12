<?php
@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/Database.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/Endpoint.php');

$accountEndpoint = new OdyMaterialyAPI\Endpoint('user');

$listAccount = function($skautis, $data, $endpoint)
{
	$getAccount = function($skautis)
	{
		$response = [];
		$idPerson = $skautis->UserManagement->UserDetail()->ID_Person;
		$response['name'] = $skautis->OrganizationUnit->PersonDetail(array('ID' => $idPerson))->DisplayName;
		$response['role'] = OdyMaterialyAPI\getRole($idPerson);
		return ['status' => 200, 'response' => $response];
	};

	try
	{
		return OdyMaterialyAPI\skautisTry($getAccount, false);
	}
	catch(OdyMaterialyAPI\AuthenticationException $e)
	{
		header('WWW-Authenticate: SkautIS');
		return ['status' => 401];
	}
};
$accountEndpoint->setListMethod(new OdymaterialyAPI\Role('guest'), $listAccount);

$updateAccount = function($skautis, $data, $endpoint)
{
	$SQL = <<<SQL
INSERT INTO users (id, name)
VALUES (?, ?)
ON DUPLICATE KEY UPDATE name = VALUES(name)
LIMIT 1;
SQL;

	$idPerson = $skautis->UserManagement->UserDetail()->ID_Person;
	$namePerson = $skautis->OrganizationUnit->PersonDetail(['ID' => $idPerson])->DisplayName;

	$db = new OdymaterialyAPI\Database();
	$db->prepare($SQL);
	$db->bind_param('is', $idPerson, $namePerson);
	$db->execute();
};
$accountEndpoint->setUpdateMethod(new OdymaterialyAPI\Role('guest'), $listAccount);
