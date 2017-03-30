<?php
ob_start();
$_GET['name'] = 'Zpětná vazba a Konstruktivní kritika';
include('API/get_lesson.php');
$md = ob_get_clean();

include_once("vendor/autoload.php");

$parser = new \cebe\markdown\latex\Markdown();
echo $parser->parse($md);
?>
