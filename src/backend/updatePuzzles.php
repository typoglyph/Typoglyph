<?php
require_once("common.php");
require_once("puzzle.php");

// Parse query parameters
$puzzlesJson = getStringRequestParam("puzzles", True);
$puzzles = PuzzleDecoder::fromJsonArray($puzzlesJson);

if ($puzzles === Null || count($puzzles) === 0) {
	throw new Exception("No puzzles to update");
}

try {
    $db = getPrivilegedDatabaseConnection();
    $db->updatePuzzles($puzzles);
} finally {
    $db = Null;
}

sendReply("", $CONTENT_TYPE_TEXT, $HTTP_STATUS_SUCCESS);
?>
