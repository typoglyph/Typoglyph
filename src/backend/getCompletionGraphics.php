<?php
require_once("common.php");


$correct = getBooleanRequestParam("correct_answer", True);
$pattern = "../images/completion_graphics/" . ($correct ? "correct_" : "incorrect_") . "*.{jpg,jpeg,png,gif,bmp}";

$relativePaths = glob($pattern, GLOB_BRACE);
$fullPaths = array();
foreach ($relativePaths as $relativePath) {
	// filter out directories
	if (is_file($relativePath)) {
		// make the path relative from the root, instead of relative from the current file
		$fullPath = substr($relativePath, 3);
		array_push($fullPaths, $fullPath);
	}
}

print(json_encode($fullPaths));
?>
