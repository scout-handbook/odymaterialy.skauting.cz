<?php
function startsWith($haystack, $needle)
{
	$length = strlen($needle);
	return (substr($haystack, 0, $length) === $needle);
}

$redirect = $_GET['ReturnUrl'];
if(startsWith($redirect, 'http://'))
{
	$redirect = 'https://' . substr($redirect, 7);
}
elseif(!startsWith($redirect, 'https://'))
{
	$hostname = 'https://odymaterialy.skauting.cz';
	if(!startsWith($redirect, '/'))
	{
		$hostname .= '/';
	}
	$redirect = $hostname . $redirect;
}

$token = $_POST['skautIS_Token'];
$timeout = DateTime::createFromFormat('j. n. Y H:i:s', $_POST['skautIS_DateLogout'])->format('U');
setcookie('skautis_token', $token, intval($timeout), "/", "odymaterialy.skauting.cz", true, true);
setcookie('skautis_timeout', $timeout, intval($timeout), "/", "odymaterialy.skauting.cz", true, true);

$_COOKIE['skautis_token'] = $token;
$_COOKIE['skautis_timeout'] = $timeout;

ob_start();
include($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/update_user.php');
ob_end_flush();

header('Location: ' . $redirect);
die();
