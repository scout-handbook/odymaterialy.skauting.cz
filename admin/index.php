<?php declare(strict_types=1);

$context = ['http' => ['ignore_errors' => true]];
if(isset($_COOKIE['skautis_timeout']) and isset($_COOKIE['skautis_token']))
{
	$context = ['http' => ['ignore_errors' => true, 'header' => 'Cookie: skautis_timeout=' . $_COOKIE['skautis_timeout'] . '; skautis_token=' . $_COOKIE['skautis_token']]];
}
$accountInfo = file_get_contents('https://odymaterialy.skauting.cz/API/v0.9/account?no-avatar=true', false, stream_context_create($context));
$loginState = json_decode($accountInfo, true);
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
	elseif($loginState['status'] == 401)
	{
		header('Location: https://odymaterialy.skauting.cz/API/v0.9/login?return-uri=' . urlencode($_SERVER['REQUEST_URI']));
		die();
	}
}
header('Location: https://odymaterialy.skauting.cz');
die();
