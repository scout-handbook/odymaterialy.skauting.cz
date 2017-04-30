<?php
require_once("server/OdyMarkdown.php");

$_GET['name'] = 'Zpětná vazba a Konstruktivní kritika';
ob_start();
include('API/get_lesson.php');
$md = ob_get_clean();

$parser = new OdyMarkdown();
$latex = nl2br($parser->parse($md));
echo $latex;
?>
