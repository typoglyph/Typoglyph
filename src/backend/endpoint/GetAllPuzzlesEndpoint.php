<?php
require_once("endpoint/DatabaseAwareEndpoint.php");
require_once("endpoint/JsonResponse.php");
require_once("puzzle/PuzzleEncoder.php");


class GetAllPuzzlesEndpoint extends DatabaseAwareEndpoint {
	
	/**
	 * @override
	 */
	public function _handleRequest($req) {
		$pretty = $req->getBooleanParameter("pretty", False);
		$pretty = ($pretty === Null) ? False : $pretty;

		try {
			$dbConn = $this->getDatabaseConnection();
			$puzzles = $dbConn->fetchAllPuzzles();
		} finally {
			$dbConn = Null;
		}

		$encoded = PuzzleEncoder::toJsonArray($puzzles, $pretty);
		return new JsonResponse($encoded);
	}
}
?>
