<?php
@_API_EXEC === 1 or die('Restricted access.');

require_once($_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Database.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/Endpoint.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/OdyMarkdown.php');

use Ramsey\Uuid\Uuid;

$lessonLatexEndpoint = new OdyMaterialyAPI\Endpoint('latex');

$getLessonLatex = function($skautis, $data, $endpoint)
{
	$SQL = <<<SQL
SELECT name
FROM lessons
WHERE id = ?;
SQL;

	$id = $endpoint->parseUuid($data['parent-id'])->getBytes();

	$db = new OdymaterialyAPI\Database();
	$db->prepare($SQL);
	$db->bind_param('s', $id);
	$db->execute();
	$name = '';
	$db->bind_result($name);
	$db->fetch_require('lesson');
	unset($db);

	$md = $endpoint->getParent()->call('GET', ['id' => $data['parent-id']])['response'];

	$parser = new OdyMarkdown\OdyMarkdown();
	$latex = $parser->parse($md);

	$latex = file_get_contents($_SERVER['DOCUMENT_ROOT'] . '/API/v0.9/internal/OdyMarkdown_template.tex') . "\n\\lessonname{" . $name . "}\n\\begin{document}\n\\setup\n" . $latex . '\\end{document}';

	header('content-type:application/x-latex; charset=utf-8');
	echo $latex;
};
$lessonLatexEndpoint->setListMethod(new OdymaterialyAPI\Role('guest'), $getLessonLatex);
