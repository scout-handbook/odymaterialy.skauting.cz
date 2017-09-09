<?php
const _AUTH_EXEC = 1;

require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/auth/skautis.secret.php');

function login($skautis)
{
	$redirect = $skautis->getloginurl('https://odymaterialy.skauting.cz/admin/index.php');
	header('Location: ' . $redirect);
	die();
}

$skautis = Skautis\Skautis::getInstance(SKAUTIS_APP_ID, SKAUTIS_TEST_MODE);

if(isset($_COOKIE['skautis_token']) and isset($_COOKIE['skautis_timeout']))
{
	$reconstructedPost = array(
		'skautIS_Token' => $_COOKIE['skautis_token'],
		'skautIS_IDRole' => '',
		'skautIS_IDUnit' => '',
		'skautIS_DateLogout' => \DateTime::createFromFormat('U', $_COOKIE['skautis_timeout'])
			->setTimezone(new \DateTimeZone('Europe/Prague'))->format('j. n. Y H:i:s'));
	$skautis->setLoginData($reconstructedPost);
	if($skautis->getUser()->isLoggedIn(true))
	{
		ob_start();
		include($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/get_login_state.php');
		$loginState = ob_get_clean();
		header("content-type:text/html");
		$role = json_decode($loginState)->role;
		if($role !== "editor" and $role !== "administrator" and $role !== "superuser")
		{
			header('Location: https://odymaterialy.skauting.cz');
			die();
		}
		include("main.html");
	}
	else
	{
		login($skautis);
	}
}
else
{
	login($skautis);
}

