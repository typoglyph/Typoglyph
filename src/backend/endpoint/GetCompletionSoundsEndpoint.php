<?php
require_once("endpoint/Endpoint.php");
require_once("endpoint/JsonResponse.php");


class GetCompletionSoundsEndpoint extends Endpoint {
	
	/**
	 * @override
	 */
	public function _handleRequest($req) {
		$which = $req->getStringParameter("which", False);
		$which = ($which === null) ? "both" : strtolower($which);

		$supportedFileExtensions = "mp3,ogg,wav";
		$directory = "../audio/completion_sounds";

		$correctSounds = ($which === "both" || $which === "correct")
				? $correctSounds = $this->listCompletionSounds($directory . "/correct_*.{" . $supportedFileExtensions . "}")
				: array();

		$incorrectSounds = ($which === "both" || $which === "incorrect")
				? $incorrectSounds = $this->listCompletionSounds($directory . "/incorrect_*.{" . $supportedFileExtensions . "}")
				: array();
				
		$sounds = array("correct" => $correctSounds, "incorrect" => $incorrectSounds);
		return new JsonResponse(json_encode($sounds));
	}
	
	/**
	 * @param string
	 * @return Array<string>
	 */
	private function listCompletionSounds($filePattern) {
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
}
?>
