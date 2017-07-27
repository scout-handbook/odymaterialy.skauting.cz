<?php
const _AUTH_EXEC = 1;

require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/auth/skautis.secret.php');

$skautis = Skautis\Skautis::getInstance(SKAUTIS_APP_ID, SKAUTIS_TEST_MODE);
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
