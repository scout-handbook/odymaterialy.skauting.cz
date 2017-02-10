<?php
require __DIR__ . '/vendor/autoload.php';

function APIcall($api, $params = array())
{
	$prefix = (isset($_SERVER["HTTPS"]) && strtolower($_SERVER["HTTPS"]) == 'on') ? 'https://' : 'http://';
	$curl = curl_init($prefix . $_SERVER['HTTP_HOST'] . '/API/' . $api);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	if(!empty($params))
	{
		curl_setopt($curl, CURLOPT_POST, true);
		curl_setopt($curl, CURLOPT_POSTFIELDS, $params);
	}
	$result = curl_exec($curl);
	curl_close($curl);
	return $result;
}

$markdown = APIcall("get_lesson.php", array('name' => 'Prostředky'));
$parser = new \cebe\markdown\Markdown();
echo $parser->parse($markdown);
?>
