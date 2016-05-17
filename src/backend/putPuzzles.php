<?php
require_once("common.php");
require_once("puzzle.php");

// Parse query parameters
$puzzlesJson = getStringRequestParam("puzzles", True);
$puzzles = PuzzleParser::fromJsonArray($puzzlesJson);

if ($puzzles === Null || count($puzzles) === 0) {
	throw new Exception("No puzzles to update");
}

try {
    $db = getPrivilegedDatabaseConnection();
    $db->insertPuzzles($puzzles);
} finally {
    $db = Null;
}

sendReply("", "text/plain", $HTTP_STATUS_SUCCESS);
?>
