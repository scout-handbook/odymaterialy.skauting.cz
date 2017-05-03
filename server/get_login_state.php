<?php
const _EXEC = 1;

header("content-type:application/json");
require_once('internal/skautisTry.php');

function showUserAccount($skautis)
{
	$response = array();
	$response['login_state'] = true;
	$idPerson = $skautis->UserManagement->UserDetail()->ID_Person;
	$response['user_name'] = $skautis->OrganizationUnit->PersonDetail(array('ID' => $idPerson))->DisplayName;
	return $response;
}

function showLoginForm()
{
	$response = array();
	$response['login_state'] = false;
	return $response;
}

echo(json_encode(skautisTry('showUserAccount', 'showLoginForm')));
