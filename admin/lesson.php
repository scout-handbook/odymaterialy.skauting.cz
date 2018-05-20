<?php declare(strict_types=1);

$CONFIG = json_decode(file_get_contents($_SERVER['DOCUMENT_ROOT'] . '/client-config.json'));

$context = stream_context_get_default();
stream_context_set_option($context, ['http' => ['ignore_errors' => true]]);
if(isset($_COOKIE['skautis_timeout']) and isset($_COOKIE['skautis_token']))
{
	stream_context_set_option($context, ['http' => ['header' => 'Cookie: skautis_timeout=' . $_COOKIE['skautis_timeout'] . '; skautis_token=' . $_COOKIE['skautis_token']]]);
}
$accountInfo = file_get_contents($CONFIG->apiuri . '/account?no-avatar=true', false, $context);
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
				$file = fopen($CONFIG->apiuri . '/lesson/' . $_GET['id'] . '/pdf', 'rb');
				foreach($http_response_header as $header)
				{
					if(strtolower(substr($header, 0, 20)) === "content-disposition:")
					{
						header($header);
					}
					if(strtolower(substr($header, 0, 22)) === "http/1.1 404 not found")
					{
						header('Location: ' . $CONFIG->baseuri . '/error/404.html');
						die();
					}
				}
				if($file !== false)
				{
					header('content-type:application/pdf; charset=utf-8');
					fpassthru($file);
					die();
				}
			}
		}
	}
	elseif($loginState['status'] == 401)
	{
		header('Location: ' . $CONFIG->apiuri . '/login?return-uri=' . urlencode($_SERVER['REQUEST_URI']));
		die();
	}
}
header('Location: ' . $CONFIG->baseuri);
die();
