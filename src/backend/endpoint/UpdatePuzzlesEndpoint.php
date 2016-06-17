<?php
require_once("endpoint/BlankResponse.php");
require_once("endpoint/DatabaseAwareEndpoint.php");
require_once("puzzle/PuzzleDecoder.php");


class UpdatePuzzlesEndpoint extends DatabaseAwareEndpoint {
	
	/**
	 * @override
	 */
	public function _handleRequest($req) {
		$puzzlesJson = $req->getPostData();
		$puzzles = PuzzleDecoder::fromJsonArray($puzzlesJson);
		
		$mode = $req->getStringParameter("mode");
		$mode = strtolower($mode);
		
		try {
			$dbConn = $this->getPrivilegedDatabaseConnection();
			switch (strtolower($mode)) {
				case "merge":
					$dbConn->mergePuzzles($puzzles);
					break;
				case "insert":
					$dbConn->insertPuzzles($puzzles);
					break;
				case "replace":
					$dbConn->replacePuzzles($puzzles);
					break;
				default:
					throw new Exception("Unknown update mode: $mode");
			}
		} finally {
			$dbConn = Null;
		}
		return new BlankResponse();
	}
}
?>
