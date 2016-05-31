<?php
require_once("endpoint/DatabaseAwareEndpoint.php");
require_once("endpoint/JsonResponse.php");
require_once("puzzle/PuzzleEncoder.php");


class GetAllPuzzlesEndpoint extends DatabaseAwareEndpoint {
	
	/**
	 * @override
	 */
	 public function _handleRequest($req) {
		 try {
			 $dbConn = $this->getDatabaseConnection();
			 $puzzles = $dbConn->fetchAllPuzzles();
		 } finally {
			 $dbConn = Null;
		 }
		 $jsonPuzzles = PuzzleEncoder::toJsonArray($puzzles);
		 return new JsonResponse($jsonPuzzles);
	 }
}
?>
