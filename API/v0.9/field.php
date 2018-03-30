<?php declare(strict_types = 1);
const _API_EXEC = 1;

require_once($_SERVER['DOCUMENT_ROOT'] . '/api-config.php');
require_once($CONFIG->basepath . '/v0.9/endpoints/fieldEndpoint.php');

$fieldEndpoint->handle();
