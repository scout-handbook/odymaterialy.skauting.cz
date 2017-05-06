<?php
namespace OdyMaterialyAPI;

@_API_EXEC === 1 or @_AUTH_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');
require_once('skautis.secret.php');

function skautisTry($success, $failure)
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
		if($skautis->getUser()->isLoggedIn() || $skautis->getUser()->isLoggedIn(true))
		{
			try
			{
				return $success($skautis);
			}
			catch(\Skautis\Exception $e)
			{
				return $failure($skautis);
			}
		}
		return $failure($skautis);
	}
	return $failure($skautis);
}
