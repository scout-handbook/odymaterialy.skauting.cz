<?php
const _API_EXEC = 1;

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/endpoints/accountEndpoint.php');

$loginState = $accountEndpoint->call('GET', []);
if(isset($loginState['status']))
{
	if($loginState['status'] == 200)
	{
		if(isset($loginState['response']['role']))
		{
			$role = $loginState['response']['role'];
			if($role == 'editor' or $role == 'administrator' or $role == 'superuser')
			{
				require('main.html');
				die();
			}
		}
	}
	else if($loginState['status'] == 401)
	{
		header('Location: https://odymaterialy.skauting.cz/API/v0.9/login?return-uri=' . urlencode('https://odymaterialy.skauting.cz/admin/')); // TODO: Remove trailing /
		die();
	}
}
header('Location: https://odymaterialy.skauting.cz');
die();
