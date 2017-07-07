<?php
const _AUTH_EXEC = 1;

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/internal/skautisTry.php');

function success()
{
	ob_start();
	include($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/get_login_state.php');
	$loginState = ob_get_clean();
	header("content-type:text/html");
	$role = json_decode($loginState)->role;
	if($role !== "editor" and $role !== "administrator" and $role !== "superuser")
	{
		header('Location: https://odymaterialy.skauting.cz');
	}
	include("main.html");
}

function login($skautis)
{
	$redirect = $skautis->getloginurl('https://odymaterialy.skauting.cz/admin/index.php');
	header('Location: ' . $redirect);
}

OdyMaterialyAPI\skautisTry('success', 'login');
die();
