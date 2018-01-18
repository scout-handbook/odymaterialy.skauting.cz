<?php declare(strict_types=1);
@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Endpoint.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Role.php');

$logoutEndpoint = new HandbookAPI\Endpoint();

$logoutUser = function(Skautis\Skautis $skautis, array $data, HandbookAPI\Endpoint $endpoint) : void
{
	if(isset($data['return-uri']) and isset($_COOKIE['skautis_token']))
	{
		if($data['return-uri'] != '')
		{
			setcookie('return-uri', $data['return-uri'], time() + 30, "/", "odymaterialy.skauting.cz", true, true);
			$_COOKIE['return-uri'] = $data['return-uri'];
		}

		$reconstructedPost = array(
			'skautIS_Token' => $_COOKIE['skautis_token'],
			'skautIS_IDRole' => '',
			'skautIS_IDUnit' => '',
			'skautIS_DateLogout' => \DateTime::createFromFormat('U', strval(time() + 60))
				->setTimezone(new \DateTimeZone('Europe/Prague'))->format('j. n. Y H:i:s'));
		$skautis->setLoginData($reconstructedPost);
		header('Location: ' . $skautis->getLogoutUrl());
		die();
	}
	setcookie('skautis_token', "", time() - 3600, "/", "odymaterialy.skauting.cz", true, true);
	setcookie('skautis_timeout', "", time() - 3600, "/", "odymaterialy.skauting.cz", true, true);
	unset($_COOKIE['skautis_token']);
	unset($_COOKIE['skautis_timeout']);

	if(isset($_COOKIE['return-uri']))
	{
		$redirect = $_COOKIE['return-uri'];
		setcookie('return-uri', "", time() - 3600, "/", "odymaterialy.skauting.cz", true, true);
		unset($_COOKIE['return-uri']);
		echo $redirect;
		header('Location: ' . $redirect);
		die();
	}
	header('Location: https://odymaterialy.skauting.cz/');
	die();
};
$logoutEndpoint->setListMethod(new HandbookAPI\Role('guest'), $logoutUser);
$logoutEndpoint->setAddMethod(new HandbookAPI\Role('guest'), $logoutUser);
