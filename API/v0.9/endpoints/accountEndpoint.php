<?php declare(strict_types=1);
@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Database.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Endpoint.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Role.php');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/endpoints/userEndpoint.php');

use Ramsey\Uuid\Uuid;

$accountEndpoint = new OdyMaterialyAPI\Endpoint();

$listAccount = function(Skautis\Skautis $skautis, array $data, OdyMaterialyAPI\Endpoint $endpoint) : array
{
	$getAccount = function(Skautis\Skautis $skautis) use ($data) : array
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

		$db = new OdyMaterialyAPI\Database();
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
$accountEndpoint->setListMethod(new OdyMaterialyAPI\Role('guest'), $listAccount);

$addAccount = function(Skautis\Skautis $skautis, array $data, OdyMaterialyAPI\Endpoint $endpoint) : array
{
	global $userEndpoint;
	$id = $skautis->UserManagement->LoginDetail()->ID_Person;
	$loginDetail = $skautis->UserManagement->LoginDetail();
	$userData = ['id' => $loginDetail->ID_Person, 'name' => $loginDetail->Person];
	$userEndpoint->call('POST', new OdyMaterialyAPI\Role('user'), $userData);
	return ['status' => 200];
};
$accountEndpoint->setAddMethod(new OdyMaterialyAPI\Role('user'), $addAccount);
