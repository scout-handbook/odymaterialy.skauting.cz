<?php declare(strict_types=1);
@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/settings.php');
require_once($BASEPATH . '/vendor/autoload.php');
require_once($BASEPATH . '/v0.9/internal/Endpoint.php');
require_once($BASEPATH . '/v0.9/internal/Role.php');
require_once($BASEPATH . '/v0.9/internal/skautis.secret.php');

require_once($BASEPATH . '/v0.9/endpoints/accountEndpoint.php');

$loginEndpoint = new HandbookAPI\Endpoint();

$loginUser = function(Skautis\Skautis $skautis, array $data, HandbookAPI\Endpoint $endpoint) use ($BASEURI, $COOKIEURI, $accountEndpoint) : void
{
	$startsWith = function(string $haystack, string $needle) : bool
	{
		return (substr($haystack, 0, strlen($needle)) === $needle);
	};

	$ISprefix = HandbookAPI\SKAUTIS_TEST_MODE ? 'https://test-is.skaut.cz/Login' : 'https://is.skaut.cz/Login';

	if(isset($data['return-uri']))
	{
		$redirect = $skautis->getLoginUrl($data['return-uri']);
	}
	elseif($startsWith($_SERVER['HTTP_REFERER'], $BASEURI))
	{
		$redirect = $skautis->getLoginUrl(substr($_SERVER['HTTP_REFERER'], strlen($BASEURI)));
	}
	elseif($startsWith($_SERVER['HTTP_REFERER'], $ISprefix)) // Back from login
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
			$redirect = $BASEURI . $redirect;
		}
		$token = $data['skautIS_Token'];
		$timeout = DateTime::createFromFormat('j. n. Y H:i:s', $data['skautIS_DateLogout'])->format('U');

		setcookie('skautis_token', $token, intval($timeout), "/", $COOKIEURI, true, true);
		setcookie('skautis_timeout', $timeout, intval($timeout), "/", $COOKIEURI, true, false);
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
