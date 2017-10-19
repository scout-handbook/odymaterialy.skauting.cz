<?php
@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Database.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Endpoint.php');

$accountEndpoint = new OdyMaterialyAPI\Endpoint('user');

$listAccount = function($skautis, $data, $endpoint)
{
	$getAccount = function($skautis)
	{
		$response = [];
		$loginDetail = $skautis->UserManagement->LoginDetail();
		$response['name'] = $loginDetail->Person;
		$response['role'] = OdyMaterialyAPI\getRole($loginDetail->ID_Person);
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

$addAccount = function($skautis, $data, $endpoint)
{
	$SQL = <<<SQL
INSERT INTO users (id, name)
VALUES (?, ?)
ON DUPLICATE KEY UPDATE name = VALUES(name);
SQL;

	$idPerson = $skautis->UserManagement->UserDetail()->ID_Person;
	$namePerson = $skautis->OrganizationUnit->PersonDetail(['ID' => $idPerson])->DisplayName;

	$db = new OdymaterialyAPI\Database();
	$db->prepare($SQL);
	$db->bind_param('is', $idPerson, $namePerson);
	$db->execute();
	return ['status' => 200];
};
$accountEndpoint->setAddMethod(new OdymaterialyAPI\Role('user'), $addAccount);
