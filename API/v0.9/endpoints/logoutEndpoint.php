<?php
@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/Endpoint.php');

$logoutEndpoint = new OdyMaterialyAPI\Endpoint('user');

$logoutUser = function($skautis, $data, $endpoint)
{
	if(isset($_COOKIE['skautis_token']))
	{
		$reconstructedPost = array(
			'skautIS_Token' => $_COOKIE['skautis_token'],
			'skautIS_IDRole' => '',
			'skautIS_IDUnit' => '',
			'skautIS_DateLogout' => \DateTime::createFromFormat('U', strval(time() + 60))
				->setTimezone(new \DateTimeZone('Europe/Prague'))->format('j. n. Y H:i:s'));
		$skautis->setLoginData($reconstructedPost);
		header('Location: ' . $skautis->getLogoutUrl());
	}
	header('Location: https://odymaterialy.skauting.cz/logout');
	die();
};
$logoutEndpoint->setListMethod(new OdymaterialyAPI\Role('guest'), $logoutUser);
