<?php declare(strict_types=1);
const _API_EXEC = 1;

require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/endpoints/competenceEndpoint.php');

$competenceEndpoint->handle();
