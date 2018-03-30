<?php declare(strict_types = 1);
@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/api-config.php');
require_once($CONFIG->basepath . '/vendor/autoload.php');
require_once($CONFIG->basepath . '/v0.9/internal/Endpoint.php');
require_once($CONFIG->basepath . '/v0.9/internal/Role.php');

require_once($CONFIG->basepath . '/v0.9/endpoints/accountEndpoint.php');

$loginEndpoint = new HandbookAPI\Endpoint();

$loginUser = function(Skautis\Skautis $skautis, array $data) use ($CONFIG, $accountEndpoint) : void
{
	$_API_SECRETS_EXEC = 1;
	$SECRETS = require($_SERVER['DOCUMENT_ROOT'] . '/api-secrets.php');
	$startsWith = function(string $haystack, string $needle) : bool
	{
		return (mb_substr($haystack, 0, mb_strlen($needle)) === $needle);
	};

	$ISprefix = $SECRETS->skautis_test_mode ? 'https://test-is.skaut.cz/Login' : 'https://is.skaut.cz/Login';

	if(isset($data['return-uri']))
	{
		$redirect = $skautis->getLoginUrl($data['return-uri']);
	}
	elseif(isset($_SERVER['HTTP_REFERER']) and $startsWith($_SERVER['HTTP_REFERER'], $CONFIG->baseuri))
	{
		$redirect = $skautis->getLoginUrl(mb_substr($_SERVER['HTTP_REFERER'], mb_strlen($CONFIG->baseuri)));
	}
	elseif(isset($_SERVER['HTTP_REFERER']) and $startsWith($_SERVER['HTTP_REFERER'], $ISprefix)) // Back from login
	{
		$redirect = $_GET['ReturnUrl'] ?? $CONFIG->baseuri;
		if($startsWith($redirect, 'http://'))
		{
			$redirect = 'https://' . mb_substr($redirect, 7);
		}
		elseif(!$startsWith($redirect, 'https://'))
		{
			if(!$startsWith($redirect, '/'))
			{
				$redirect = '/' . $redirect;
			}
			$redirect = $CONFIG->baseuri . $redirect;
		}
		$token = $data['skautIS_Token'];
		$timeout = DateTime::createFromFormat('j. n. Y H:i:s', $data['skautIS_DateLogout'])->format('U');

		setcookie('skautis_token', $token, intval($timeout), "/", $CONFIG->cookieuri, true, true);
		setcookie('skautis_timeout', $timeout, intval($timeout), "/", $CONFIG->cookieuri, true, false);
		$_COOKIE['skautis_token'] = $token;
		$_COOKIE['skautis_timeout'] = $timeout;

		$accountEndpoint->call('POST', new HandbookAPI\Role('user'), []);
	}
	else
	{
		$redirect = $skautis->getLoginUrl();
	}
	header('Location: ' . $redirect);
	die();
};
$loginEndpoint->setListMethod(new HandbookAPI\Role('guest'), $loginUser);
$loginEndpoint->setAddMethod(new HandbookAPI\Role('guest'), $loginUser);
