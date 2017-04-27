<?php
const _EXEC = 1;

require_once('vendor/autoload.php');
require_once('skautis.secret.php');

session_start();

$skautis = Skautis\Skautis::getInstance(SKAUTIS_APP_ID, SKAUTIS_TEST_MODE);
$response = array();
if(isset($_SESSION['skautis_token']))
{
	$response['login_state'] = true;
	$reconstructed_post = array('skautIS_Token' => $_SESSION['skautis_token'], 'skautIS_IDRole' => '', 'skautIS_IDUnit' => '', 'skautIS_DateLogout' => DateTime::createFromFormat('U', $_SESSION['skautis_timeout'])->setTimezone(new DateTimeZone('Europe/Prague'))->format('j. n. Y H:i:s'));
	$skautis->setLoginData($reconstructed_post);
	$id_person = $skautis->UserManagement->UserDetail()->ID_Person;
	$response['user_name'] = $skautis->OrganizationUnit->PersonDetail(array('ID' => $id_person))->DisplayName;
	//$response['user_avatar'] = base64_encode($skautis->OrganizationUnit->PersonPhoto(array('ID' => $id_person, 'Size' => 'big'))->PhotoBigContent);
}
else
{
	$response['login_state'] = false;
}

echo(json_encode($response));

