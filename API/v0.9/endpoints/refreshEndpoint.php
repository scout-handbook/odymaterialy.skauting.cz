<?php declare(strict_types = 1);
@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/api-config.php');
require_once($CONFIG->basepath . '/vendor/autoload.php');
require_once($CONFIG->basepath . '/v0.9/internal/Endpoint.php');
require_once($CONFIG->basepath . '/v0.9/internal/Role.php');

$refreshEndpoint = new HandbookAPI\Endpoint();

$refreshLogin = function(Skautis\Skautis $skautis) use ($CONFIG) : array
{
	$dateLogout = $skautis->UserManagement->LoginUpdateRefresh(['ID' => $_COOKIE['skautis_token']])->DateLogout;
	$timeout = DateTime::createFromFormat('Y-m-d\TH:i:s.u', $dateLogout)->format('U');
	setcookie('skautis_timeout', $timeout, intval($timeout), "/", $CONFIG->cookieuri, true, false);
	$_COOKIE['skautis_timeout'] = $timeout;
	return ['status' => 200];
};
$refreshEndpoint->setListMethod(new HandbookAPI\Role('user'), $refreshLogin);
