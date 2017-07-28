<?php
namespace OdyMaterialyAPI;

@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/Role.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/skautis.secret.php');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/AuthenticationException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/RoleException.php');

function skautisTry($callback, $hardCheck = true)
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
				return $callback($skautis);
			}
			catch(\Skautis\Exception $e)
			{
				throw new AuthenticationException();
			}
		}
	}
	throw new AuthenticationException();
}

function roleTry($success, $hardCheck = true, $requiredRole = Role::USER)
{
	if($requiredRole === Role::USER)
	{
		skautisTry($success, $hardCheck);
		return;
	}
	$safeCallback = function($skautis) use ($success, $requiredRole)
	{
		$role = Role::parse(getRole($skautis->UserManagement->UserDetail()->ID_Person));
		if($role >= $requiredRole)
		{
			$success($skautis);
		}
		else
		{
			throw new RoleException();
		}
	};
	skautisTry($safeCallback, $hardCheck);
}

function userTry($success, $hardCheck = true)
{
	roleTry($success, $hardCheck, Role::USER);
}

function editorTry($success, $hardCheck = true)
{
	roleTry($success, $hardCheck, Role::EDITOR);
}

function administratorTry($success, $hardCheck = true)
{
	roleTry($success, $hardCheck, Role::ADMINISTRATOR);
}
function superuserTry($success, $hardCheck = true)
{
	roleTry($success, $hardCheck, Role::SUPERUSER);
}
