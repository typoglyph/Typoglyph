<?php
require_once("common.php");


// Parse query parameters
$count = getIntRequestParam("count", True);
if ($count < 0)
	throw new Exception("Invalid 'count' parameter: $count");

// Connect to DB and grab required puzzles in their raw format
try {
    $db = getDatabaseConnection();
    $dbPuzzles = getRandomPuzzles($db, $count);
} finally {
    $db = Null;
}

// Convert to a format useful to the front end (see /src/scripts/puzzle.js for the structure we're aiming for)
$puzzles = array();
foreach ($dbPuzzles as $dbPuzzle) {
	$puzzle = array();
	$puzzle["sentence"] = "";
	$puzzle["options"] = array();
	$puzzle["gaps"] = array();
	
	// Sort out the options
	// For each character
	foreach (str_split($dbPuzzle->options) as $dbOption) {
		// str_split returns an array containing only "" when given "" as parameter
		if (strlen($dbOption) === 0)
			continue;
		
		$option = array( "value"=>$dbOption );
		array_push($puzzle["options"], $option);
	}
	
	// Sort out the sentence and the gaps
	// For each character
	$escaped = False;
	$gap = Null;
	foreach (str_split($dbPuzzle->sentence) as $i=>$char) {
		// str_split returns an array containing only "" when given "" as parameter
		if (strlen($char) === 0)
			continue;
		
		// Set the flag so that the next character is properly escaped
		if (!$escaped && $char === "\\") {
			$escaped = True;
			
		} elseif (!$escaped && $char === "{") {
			if ($gap !== Null) {
				// The input was something like "Hello {{} world" instead of "Hello {\{} world"
				throw new Exception("Char<$i>: Non-escaped '{' found before the current '{' was closed: '{$dbPuzzle->sentence}'");
			}
			// We have hit the start of a gap - create an object to represent it
			$gap = array();
			$gap["position"] = $i;
			$gap["solution"] = Null;
			$gap["currentChoice"] = Null;
			
		} elseif (!$escaped && $char === "}") {
			if ($gap === Null) {
				// The input was something like "Hello {}} world" instead of "Hello {\}} world", or maybe "Hello } world" instead of "Hello \} world"
				throw new Exception("Char<$i>: Non-escaped '}' found before any '{' was opened: '{$dbPuzzle->sentence}'");
			}
			// We have reached the end of a gap - add it to the puzzle and clear our reference of it
			array_push($puzzle["gaps"], $gap);
			$gap = Null;
			
		} else {
			// It's just a normal, bogstandard character (or has been escaped, so we must treat it like one)
			if ($gap === Null) {
				// We are not inside a gap - just add the character to the end of the sentence!
				$puzzle["sentence"] .= $char;
			} else {
				// We are inside a gap and this character is part of the solution
				if ($gap["solution"] === Null) {
					$gap["solution"] = array();
					$gap["solution"]["value"] = "";
				}
				$gap["solution"]["value"] .= $char;
			}
			
			// If this character was escaped, clear the flag so the next character is treated normally
			$escaped = False;
		}
	}
	array_push($puzzles, $puzzle);
}

// Convert to JSON and return the result
$json = toJson($puzzles, False);
print($json);


/**
 * @param PDO $dbConnection
 * @return object[]
 */
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
