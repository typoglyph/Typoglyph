<?php
require_once("endpoint/Endpoint.php");
require_once("endpoint/JsonResponse.php");


class GetCompletionGraphicsEndpoint extends Endpoint {
	
	/**
	 * @override
	 */
	public function _handleRequest($req) {
		$which = $req->getStringParameter("which", False);
		$which = ($which === null) ? "both" : strtolower($which);

		$correctGraphics = ($which === "both" || $which === "correct")
				? $correctGraphics = $this->listCompletionGraphics("../images/completion_graphics/correct_*.{jpg,jpeg,png,gif,bmp}")
				: array();

		$incorrectGraphics = ($which === "both" || $which === "incorrect")
				? $incorrectGraphics = $this->listCompletionGraphics("../images/completion_graphics/incorrect_*.{jpg,jpeg,png,gif,bmp}")
				: array();
		
		$graphics = array("correct" => $correctGraphics, "incorrect" => $incorrectGraphics);
		return new JsonResponse(json_encode($graphics));
	}
	
	/**
	 * @param string
	 * @return Array<string>
	 */
	private function listCompletionGraphics($filePattern) {
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
