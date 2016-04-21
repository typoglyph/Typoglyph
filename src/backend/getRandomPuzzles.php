<?php
require_once("common.php");

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

sendJsonReply($puzzles, $HTTP_STATUS_SUCCESS);
?>
