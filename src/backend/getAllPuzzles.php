<?php
require_once("common.php");


try {
    $db = getDatabaseConnection();
    $puzzles = $db->fetchAllPuzzles();
} finally {
    $db = Null;
}

sendJsonReply($puzzles, $HTTP_STATUS_SUCCESS)
?>
