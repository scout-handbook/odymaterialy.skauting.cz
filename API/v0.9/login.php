<?php declare(strict_types = 1);
const _API_EXEC = 1;

require_once($_SERVER['DOCUMENT_ROOT'] . '/settings.php');
require_once($BASEPATH . '/v0.9/endpoints/loginEndpoint.php');

$loginEndpoint->handle();
