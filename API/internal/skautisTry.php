<?php
namespace OdyMaterialyAPI;

@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/Role.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/skautis.secret.php');

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
	}
	return $failure($skautis);
}

function roleTry($success, $failure, $hardCheck = true, $requiredRole = Role::USER)
{
	if($requiredRole === Role::USER)
	{
		skautisTry($success, $failure, $hardCheck);
		return;
	}
	$safeCallback = function($skautis) use ($success, $failure, $requiredRole)
	{
		$role = Role::parse(getRole($skautis->UserManagement->UserDetail()->ID_Person));
		if($role >= $requiredRole)
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

function editorTry($success, $failure, $hardCheck = true)
{
	roleTry($success, $failure, $hardCheck, Role::EDITOR);
}

function administratorTry($success, $failure, $hardCheck = true)
{
	roleTry($success, $failure, $hardCheck, Role::ADMINISTRATOR);
}
function superuserTry($success, $failure, $hardCheck = true)
{
	roleTry($success, $failure, $hardCheck, Role::SUPERUSER);
}
