<?php

require_once("OdyMarkdown.php");

$_GET['name'] = 'Zpětná vazba a Konstruktivní kritika';
ob_start();
include('API/v0.9/get_lesson.php');
$md = ob_get_clean();

header('content-type:text/plain; charset=utf-8');
//header('content-type:application/x-latex; charset=utf-8');

$parser = new OdyMarkdown\OdyMarkdown();
$latex = $parser->parse($md);
echo $latex;
