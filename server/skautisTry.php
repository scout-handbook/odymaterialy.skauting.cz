<?php
@_EXEC == 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');
require_once('skautis.secret.php');

function skautisTry($success, $failure)
{
	$skautis = Skautis\Skautis::getInstance(SKAUTIS_APP_ID, SKAUTIS_TEST_MODE);
	if(isset($_SESSION['skautis_token']))
	{
		if(($_SESSION['skautis_timeout'] > time()) or $skautis->getUser()->isLoggedIn())
		{
			$reconstructedPost = array(
				'skautIS_Token' => $_SESSION['skautis_token'],
				'skautIS_IDRole' => '',
				'skautIS_IDUnit' => '',
				'skautIS_DateLogout' => DateTime::createFromFormat('U', $_SESSION['skautis_timeout'])->setTimezone(new DateTimeZone('Europe/Prague'))->format('j. n. Y H:i:s'));
			$skautis->setLoginData($reconstructedPost);
			try
			{
				return $success($skautis);
			}
			catch(Skautis\Exception $e)
			{
				return $failure($skautis);
			}
		}
		return $failure($skautis);
	}
	return $failure($skautis);
}
