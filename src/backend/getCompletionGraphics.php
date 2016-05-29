<?php
require_once("common.php");


$which = getStringRequestParam("which", False);
$which = ($which === null) ? "both" : strtolower($which);

$correctGraphics = ($which === "both" || $which === "correct")
		? $correctGraphics = listCompletionGraphics("../images/completion_graphics/correct_*.{jpg,jpeg,png,gif,bmp}")
		: array();

$incorrectGraphics = ($which === "both" || $which === "incorrect")
		? $incorrectGraphics = listCompletionGraphics("../images/completion_graphics/incorrect_*.{jpg,jpeg,png,gif,bmp}")
		: array();
		
$graphics = array("correct" => $correctGraphics, "incorrect" => $incorrectGraphics);
sendReply(json_encode($graphics), $CONTENT_TYPE_JSON, $HTTP_STATUS_SUCCESS);


/**
 * @param string
 * @return Array<string>
 */
function listCompletionGraphics($filePattern) {
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
