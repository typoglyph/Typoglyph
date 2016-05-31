<?php
require_once("endpoint/DatabaseAwareEndpoint.php");
require_once("endpoint/JsonResponse.php");
require_once("puzzle/PuzzleEncoder.php");


class GetRandomPuzzlesEndpoint extends DatabaseAwareEndpoint {

	/**
	 * @override
	 */
	public function _handleRequest($req) {
		$count = $req->getIntParameter("count");
		if ($count < 0) {
			throw new Exception("Invalid 'count' parameter: $count");
		}
		
		try {
			$dbConn = $this->getDatabaseConnection();
			$puzzles = $dbConn->fetchRandomPuzzles($count);
		} finally {
			$dbConn = Null;
		}
		$jsonPuzzles = PuzzleEncoder::toJsonArray($puzzles);
		return new JsonResponse($jsonPuzzles);
	}
}
?>
