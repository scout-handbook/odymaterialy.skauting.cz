<?php
@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/Endpoint.php');

$loginEndpoint = new OdyMaterialyAPI\Endpoint('user');

$loginUser = function($skautis, $data, $endpoint)
{
	$prefix = 'https://odymaterialy.skauting.cz';
	if(substr($_SERVER['HTTP_REFERER'], 0, strlen($prefix)) === $prefix)
	{
		$redirect = $skautis->getLoginUrl(substr($_SERVER['HTTP_REFERER'], strlen($prefix)));
	}
	else
	{
		$redirect = $skautis->getLoginUrl();
	}
	header('Location: ' . $redirect);
	die();
};
$loginEndpoint->setListMethod(new OdymaterialyAPI\Role('guest'), $loginUser);
