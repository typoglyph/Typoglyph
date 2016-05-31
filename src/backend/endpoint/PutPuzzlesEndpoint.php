<?php
require_once("endpoint/BlankResponse.php");
require_once("endpoint/DatabaseAwareEndpoint.php");
require_once("puzzle/PuzzleDecoder.php");


class PutPuzzlesEndpoint extends DatabaseAwareEndpoint {
	
	/**
	 * @override
	 */
	public function _handleRequest($req) {
		$puzzlesJson = $req->getStringParameter("puzzles");
		$puzzles = PuzzleDecoder::fromJsonArray($puzzles);
		
		if ($puzzles === Null || count($puzzles) === 0) {
			throw new Exception("Invalid 'puzzles' parameter: $puzzlesJson");
		}
		
		try {
			$dbConn = $this->getPrivilegedDatabaseConnection();
			$dbConn->insertPuzzles($puzzles);
		} finally {
			$dbConn = Null;
		}
		return new BlankResponse();
	}
}
?>
