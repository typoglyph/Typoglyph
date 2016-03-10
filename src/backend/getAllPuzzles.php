<?php
require_once("common.php");


try {
    $db = getDatabaseConnection();
    $puzzles = getAllPuzzles($db);
} finally {
    $db = Null;
}
$json = toJson($puzzles, False);
print($json);


function getAllPuzzles($dbConnection) {
	$preparedStatement = $dbConnection->prepare('
		SELECT *
		FROM `puzzles`');
	$preparedStatement->execute();
	return $preparedStatement->fetchAll(PDO::FETCH_OBJ);
}
?>
