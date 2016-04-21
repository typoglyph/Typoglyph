<?php
require_once("common.php");


$which = getStringRequestParam("which", False);
$which = ($which === null) ? "both" : strtolower($which);

$supportedFileExtensions = "mp3,ogg,wav";
$directory = "../sounds/completion_sounds";

$correctSounds = ($which === "both" || $which === "correct")
		? $correctSounds = listCompletionSounds($directory . "/correct_*.{" . $supportedFileExtensions . "}")
		: array();

$incorrectSounds = ($which === "both" || $which === "incorrect")
		? $incorrectSounds = listCompletionSounds($directory . "/incorrect_*.{" . $supportedFileExtensions . "}")
		: array();
		
$sounds = array("correct" => $correctSounds, "incorrect" => $incorrectSounds);
sendJsonReply($sounds, $HTTP_STATUS_SUCCESS);


/**
 * @param string
 * @return Array<string>
 */
function listCompletionSounds($filePattern) {
	$relativePaths = glob($filePattern, GLOB_BRACE);
	$fullPaths = array();
	foreach ($relativePaths as $relativePath) {
		// filter out directories
		if (is_file($relativePath)) {
			// make the path relative from the root, instead of relative from the current file
			$fullPath = substr($relativePath, 3);
			array_push($fullPaths, $fullPath);
		}
	}
	return $fullPaths;
}
?>
