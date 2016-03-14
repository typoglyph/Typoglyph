<?php
require_once("common.php");


try {
    $db = getDatabaseConnection();
    $puzzles = $db->fetchAllPuzzles();
} finally {
    $db = Null;
}

$json = toJson($puzzles, False);
print($json);
?>
