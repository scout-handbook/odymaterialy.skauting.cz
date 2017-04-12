<?php
const _EXEC = 1;

require_once('vendor/autoload.php');
require_once('skautis.secret.php');

session_start();

$skautis = Skautis\Skautis::getInstance(SKAUTIS_APP_ID, SKAUTIS_TEST_MODE);
$response = array();
if(isset($_SESSION['skautis_token']))
{
	$response['login_state'] = true;
}
else
{
	$response['login_state'] = false;
	if(isset($_GET['returnUri']))
	{
		$response['login_uri'] = $skautis->getLoginUrl($_GET['returnUri']);
	}
	else
	{
		$response['login_uri'] = $skautis->getLoginUrl();
	}
}

echo(json_encode($response));

