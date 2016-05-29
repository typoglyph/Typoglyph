<?php
require_once("common.php");
require_once("puzzle.php");

// Parse query parameters
$count = getIntRequestParam("count", True);
if ($count < 0)
	throw new Exception("Invalid 'count' parameter: $count");


try {
    $db = getDatabaseConnection();
    $puzzles = $db->fetchRandomPuzzles($count);
} finally {
    $db = Null;
}

$jsonPuzzles = PuzzleEncoder::toJsonArray($puzzles);
sendReply($jsonPuzzles, $CONTENT_TYPE_JSON, $HTTP_STATUS_SUCCESS);
?>
