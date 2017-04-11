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
	$redirect = 'https://odymaterialy.skauting.cz/' . $redirect;
}

session_unset();
session_destroy();

header('Location: ' . $redirect);
die();
?>
