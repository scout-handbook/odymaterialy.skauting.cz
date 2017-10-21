<?php
@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Endpoint.php');

$refreshEndpoint = new OdyMaterialyAPI\Endpoint('user');

$refreshLogin = function($skautis, $data, $endpoint)
{
	$dateLogout = $skautis->UserManagement->LoginUpdateRefresh(['ID' => $_COOKIE['skautis_token']])->DateLogout;
	$timeout = DateTime::createFromFormat('Y-m-d\TH:i:s.u', $dateLogout)->format('U');
	setcookie('skautis_timeout', $timeout, intval($timeout), "/", "odymaterialy.skauting.cz", true, true);
	$_COOKIE['skautis_timeout'] = $timeout;
	return ['status' => 200];
};
$refreshEndpoint->setListMethod(new OdymaterialyAPI\Role('user'), $refreshLogin);
