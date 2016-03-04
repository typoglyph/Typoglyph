<?php
require("common.php");


$count = getIntRequestParam("count", True);
if ($count < 0)
	throw new Exception("Invalid 'count' parameter: $count");

try {
    $db = getDatabaseConnection();
    $puzzles = getRandomPuzzles($db, $count);
} finally {
    $db = Null;
}

$json = puzzlesToJsonArray($puzzles);
print($json);


function getRandomPuzzles($dbConnection, $count) {
	$preparedStatement = $dbConnection->prepare('
		SELECT *
		FROM `puzzles`
		ORDER BY RAND()
		LIMIT ?');
	$preparedStatement->bindParam(1, $count, PDO::PARAM_INT);
	$preparedStatement->execute();
	return $preparedStatement->fetchAll(PDO::FETCH_OBJ);
}
?>
