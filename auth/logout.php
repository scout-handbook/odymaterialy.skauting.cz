<?php
const _EXEC = 1;

require_once('skautisTry.php');

session_start();

function logout($skautis)
{
	header('Location: ' . $skautis->getLogoutUrl());
}

function redirect($skautis)
{
	header('Location: https://odymaterialy.skauting.cz/');
}

skautisTry('logout', 'redirect');
die();

