<?php
@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Endpoint.php');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/exceptions/InvalidArgumentTypeException.php');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/endpoints/accountEndpoint.php');

$loginEndpoint = new OdyMaterialyAPI\Endpoint('user');

$loginUser = function($skautis, $data, $endpoint) use ($accountEndpoint)
{
	$startsWith = function($haystack, $needle)
	{
		return (substr($haystack, 0, strlen($needle)) === $needle);
	};

	$localPrefix = 'https://odymaterialy.skauting.cz';
	$ISprefix = 'https://test-is.skaut.cz/Login'; // TODO: Live SkautIS

	if(isset($data['return-uri']))
	{
		$redirect = $skautis->getLoginUrl($data['return-uri']);
	}
	else if($startsWith($_SERVER['HTTP_REFERER'], $localPrefix))
	{
		$redirect = $skautis->getLoginUrl(substr($_SERVER['HTTP_REFERER'], strlen($localPrefix)));
	}
	else if($startsWith($_SERVER['HTTP_REFERER'], $ISprefix)) // Back from login
	{
		$redirect = $_GET['ReturnUrl'];
		if($startsWith($redirect, 'http://'))
		{
			$redirect = 'https://' . substr($redirect, 7);
		}
		elseif(!$startsWith($redirect, 'https://'))
		{
			if(!$startsWith($redirect, '/'))
			{
				$redirect = '/' . $redirect;
			}
			$redirect = $localPrefix . $redirect;
		}
		$token = $data['skautIS_Token'];
		$timeout = DateTime::createFromFormat('j. n. Y H:i:s', $data['skautIS_DateLogout'])->format('U');

		setcookie('skautis_token', $token, intval($timeout), "/", "odymaterialy.skauting.cz", true, true);
		setcookie('skautis_timeout', $timeout, intval($timeout), "/", "odymaterialy.skauting.cz", true, true);
		$_COOKIE['skautis_token'] = $token;
		$_COOKIE['skautis_timeout'] = $timeout;

		$accountEndpoint->call('POST', []);
	}
	else
	{
		$redirect = $skautis->getLoginUrl();
	}
	header('Location: ' . $redirect);
	die();
};
$loginEndpoint->setListMethod(new OdymaterialyAPI\Role('guest'), $loginUser);
$loginEndpoint->setAddMethod(new OdymaterialyAPI\Role('guest'), $loginUser);
