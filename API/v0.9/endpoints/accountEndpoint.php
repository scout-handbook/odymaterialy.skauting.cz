<?php declare(strict_types=1);
@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/settings.php');
require_once($BASEPATH . '/vendor/autoload.php');
require_once($BASEPATH . '/v0.9/internal/Database.php');
require_once($BASEPATH . '/v0.9/internal/Endpoint.php');
require_once($BASEPATH . '/v0.9/internal/Role.php');

require_once($BASEPATH . '/v0.9/endpoints/userEndpoint.php');

use Ramsey\Uuid\Uuid;

$accountEndpoint = new HandbookAPI\Endpoint();

$listAccount = function(Skautis\Skautis $skautis, array $data, HandbookAPI\Endpoint $endpoint) : array
{
	$getAccount = function(Skautis\Skautis $skautis) use ($data) : array
	{
		$SQL = <<<SQL
SELECT users_in_groups.group_id
FROM users_in_groups
LEFT JOIN users ON users_in_groups.user_id = users.id
WHERE users.id = :id;
SQL;

		$response = [];
		$loginDetail = $skautis->UserManagement->LoginDetail();
		$response['name'] = $loginDetail->Person;
		$response['role'] = HandbookAPI\getRole($loginDetail->ID_Person);
		$response['groups'] = [];

		$db = new HandbookAPI\Database();
		$db->prepare($SQL);
		$db->bindParam(':id', $loginDetail->ID_Person, PDO::PARAM_INT);
		$db->execute();
		$uuid = '';
		$db->bindColumn('group_id', $uuid);
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
		return HandbookAPI\skautisTry($getAccount, false);
	}
	catch(HandbookAPI\AuthenticationException $e)
	{
		header('WWW-Authenticate: SkautIS');
		return ['status' => 401];
	}
};
$accountEndpoint->setListMethod(new HandbookAPI\Role('guest'), $listAccount);

$addAccount = function(Skautis\Skautis $skautis, array $data, HandbookAPI\Endpoint $endpoint) : array
{
	global $userEndpoint;
	$id = $skautis->UserManagement->LoginDetail()->ID_Person;
	$loginDetail = $skautis->UserManagement->LoginDetail();
	$userData = ['id' => $loginDetail->ID_Person, 'name' => $loginDetail->Person];
	$userEndpoint->call('POST', new HandbookAPI\Role('user'), $userData);
	return ['status' => 200];
};
$accountEndpoint->setAddMethod(new HandbookAPI\Role('user'), $addAccount);
