<?php declare(strict_types = 1);
namespace HandbookAPI;

@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/api-config.php');
require_once($CONFIG->basepath . '/vendor/autoload.php');
require_once($CONFIG->basepath . '/v0.9/internal/Role.php');

require_once($CONFIG->basepath . '/v0.9/internal/exceptions/AuthenticationException.php');
require_once($CONFIG->basepath . '/v0.9/internal/exceptions/RoleException.php');
require_once($CONFIG->basepath . '/v0.9/internal/exceptions/SkautISException.php');

function skautisTry(callable $callback, bool $hardCheck = true)
{
	$_API_SECRETS_EXEC = 1;
	$SECRETS = require($_SERVER['DOCUMENT_ROOT'] . '/api-secrets.php');
	$skautis = \Skautis\Skautis::getInstance($SECRETS->skautis_app_id, $SECRETS->skautis_test_mode);
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
				throw new SkautISException($e);
			}
		}
	}
	throw new AuthenticationException();
}

function roleTry(callable $callback, bool $hardCheck, Role $requiredRole)
{
	$_API_SECRETS_EXEC = 1;
	$SECRETS = require($_SERVER['DOCUMENT_ROOT'] . '/api-secrets.php');
	if(Role_cmp($requiredRole, new Role('guest')) === 0)
	{
		return $callback(\Skautis\Skautis::getInstance($SECRETS->skautis_app_id, $SECRETS->skautis_test_mode));
	}
	if(Role_cmp($requiredRole, new Role('user')) === 0)
	{
		return skautisTry($callback, $hardCheck);
	}
	$safeCallback = function(\Skautis\Skautis $skautis) use ($callback, $requiredRole)
	{
		$role = getRole($skautis->UserManagement->LoginDetail()->ID_Person);
		if(Role_cmp($role, $requiredRole) >= 0)
		{
			return $callback($skautis);
		}
		else
		{
			throw new RoleException();
		}
	};
	return skautisTry($safeCallback, $hardCheck);
}
