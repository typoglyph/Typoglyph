<?php
require_once("common.php");

// Parse query parameters
$puzzleIdsJson = getStringRequestParam("puzzleIds", True);
$puzzleIds = fromJson($puzzleIdsJson);

if ($puzzleIds === Null || count($puzzleIds) === 0) {
	throw new Exception("No puzzles to remove");
}

try {
    $db = getPrivilegedDatabaseConnection();
    $db->removePuzzles($puzzleIds);
} finally {
    $db = Null;
}

sendReply("", "text/plain", $HTTP_STATUS_SUCCESS);
?>
