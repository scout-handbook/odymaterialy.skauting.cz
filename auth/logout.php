<?php
const _EXEC = 1;

require_once($_SERVER['DOCUMENT_ROOT'] . '/server/skautisTry.php');

session_start();

function logout($skautis)
{
	header('Location: ' . $skautis->getLogoutUrl());
}

function redirect()
{
	header('Location: https://odymaterialy.skauting.cz/');
}

skautisTry('logout', 'redirect');
die();
