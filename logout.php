<?php
const _EXEC = 1;

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once('vendor/autoload.php');
require_once('skautis.secret.php');

session_start();

if(isset($_SESSION['skautis_token']))
{
	$skautis = Skautis\Skautis::getInstance(SKAUTIS_APP_ID, SKAUTIS_TEST_MODE);
	$reconstructed_post = array('skautIS_Token' => $_SESSION['skautis_token'], 'skautIS_IDRole' => '', 'skautIS_IDUnit' => '', 'skautIS_DateLogout' => DateTime::createFromFormat('U', $_SESSION['skautis_timeout'])->setTimezone(new DateTimeZone('Europe/Prague'))->format('j. n. Y H:i:s'));
	$skautis->setLoginData($reconstructed_post);
	header('Location: ' . $skautis->getLogoutUrl());
	die();
}
else
{
	header('Location: https://odymaterialy.skauting.cz/');
	die();
}

