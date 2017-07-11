<?php
const _AUTH_EXEC = 1;

require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/auth/skautis.secret.php');

if(isset($_COOKIE['skautis_token']))
{
	$skautis = Skautis\Skautis::getInstance(OdyMaterialyAPI\SKAUTIS_APP_ID, OdyMaterialyAPI\SKAUTIS_TEST_MODE);
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
