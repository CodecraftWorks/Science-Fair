<?php
require_once 'TheNounProject.class.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

if (!isset($_GET["word"]))
{
	print("{\"error\": No word.}");
	exit(0);
}

$word = $_GET["word"];
$limit = isset($_GET["limit"]) ? $_GET["limit"] : 10;

$NOUN_PROJECT_KEY = getenv('NOUN_PROJECT_KEY');
$NOUN_PROJECT_SECRET = getenv('NOUN_PROJECT_SECRET');

$theNounProject = new TheNounProject($NOUN_PROJECT_KEY, $NOUN_PROJECT_SECRET);
$icons = $theNounProject->getIconsByTerm(
    $word,
    array('limit' => $limit)
);
print("{\"results\": ".json_encode($icons)."}");
exit(0);
?>