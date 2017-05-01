<?php
function startsWith($haystack, $needle)
{
	$length = strlen($needle);
	return (substr($haystack, 0, $length) === $needle);
}
session_start();

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
$_SESSION['skautis_token'] = $token;
$_SESSION['skautis_timeout'] = $timeout;

header('Location: ' . $redirect);
die();
