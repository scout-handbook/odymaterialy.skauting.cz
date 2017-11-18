<?php
@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Database.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Endpoint.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Role.php');

use Ramsey\Uuid\Uuid;

$accountEndpoint = new OdyMaterialyAPI\Endpoint('user');

$listAccount = function($skautis, $data, $endpoint)
{
	$getAccount = function($skautis) use ($data)
	{
		$SQL = <<<SQL
SELECT users_in_groups.group_id
FROM users_in_groups
LEFT JOIN users ON users_in_groups.user_id = users.id
WHERE users.id = ?;
SQL;

		$response = [];
		$loginDetail = $skautis->UserManagement->LoginDetail();
		$response['name'] = $loginDetail->Person;
		$response['role'] = OdyMaterialyAPI\getRole($loginDetail->ID_Person);
		$response['groups'] = [];

		$db = new OdymaterialyAPI\Database();
		$db->prepare($SQL);
		$db->bind_param('s', $loginDetail->ID_Person);
		$db->execute();
		$uuid = '';
		$db->bind_result($uuid);
		while($db->fetch())
		{
			$response['groups'][] = Uuid::fromBytes($uuid)->toString();
		}

		if(!isset($data['no-avatar']) or $data['no-avatar'] == 'false')
		{
			$ISphotoResponse = $skautis->OrganizationUnit->PersonPhoto([
				'ID' => $loginDetail->ID_Person,
				'Size' => 'small']);
			if(isset($ISphotoResponse->PhotoContent) and $ISphotoResponse->PhotoContent != '')
			{
				$response['avatar'] = base64_encode($ISphotoResponse->PhotoContent);
			}
		}
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
