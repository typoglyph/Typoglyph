<?php
require_once("common.php");

// Parse query parameters
$puzzleIdsJson = getStringRequestParam("puzzleIds", True);
$puzzleIds = json_decode($puzzleIdsJson);

if ($puzzleIds === Null || count($puzzleIds) === 0) {
	throw new Exception("No puzzles to remove");
}

try {
    $db = getPrivilegedDatabaseConnection();
    $db->removePuzzles($puzzleIds);
} finally {
    $db = Null;
}

sendReply("", $CONTENT_TYPE_TEXT, $HTTP_STATUS_SUCCESS);
?>
