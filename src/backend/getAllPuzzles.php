<?php
require_once("common.php");
require_once("puzzle.php");


try {
    $db = getDatabaseConnection();
    $puzzles = $db->fetchAllPuzzles();
} finally {
    $db = Null;
}

$jsonPuzzles = PuzzleEncoder::toJsonArray($puzzles);
sendReply($jsonPuzzles, $CONTENT_TYPE_JSON, $HTTP_STATUS_SUCCESS)
?>
