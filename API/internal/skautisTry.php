<?php
namespace OdyMaterialyAPI;

@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/Role.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/skautis.secret.php');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/exceptions/AuthenticationException.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/exceptions/RoleException.php');

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

function roleTry($success, $hardCheck, $requiredRole)
{
	if(Role_cmp($requiredRole, new Role('user')) === 0)
	{
		return skautisTry($success, $hardCheck);
	}
	$safeCallback = function($skautis) use ($success, $requiredRole)
	{
		$role = new Role(getRole($skautis->UserManagement->UserDetail()->ID_Person));
		if(Role_cmp($role, $requiredRole) >= 0)
		{
			return $success($skautis);
		}
		else
		{
			throw new RoleException();
		}
	};
	return skautisTry($safeCallback, $hardCheck);
}

function userTry($success, $hardCheck = true)
{
	return roleTry($success, $hardCheck, new Role('user'));
}

function editorTry($success, $hardCheck = true)
{
	return roleTry($success, $hardCheck, new Role('editor'));
}

function administratorTry($success, $hardCheck = true)
{
	return roleTry($success, $hardCheck, new Role('administrator'));
}
function superuserTry($success, $hardCheck = true)
{
	return roleTry($success, $hardCheck, new Role('superuser'));
}
