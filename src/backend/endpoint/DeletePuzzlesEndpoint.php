<?php
require_once("endpoint/BlankResponse.php");
require_once("endpoint/DatabaseAwareEndpoint.php");


class DeletePuzzlesEndpoint extends DatabaseAwareEndpoint {
	
	/**
	 * @override
	 */
	public function _handleRequest($req) {
		$puzzleIdsJson = $req->getStringParameter("puzzleIds");
		$puzzleIds = json_decode($puzzleIdsJson);
		
		if ($puzzleIds === Null || count($puzzleIds) === 0) {
			throw new Exception("Invalid 'puzzleIds' parameter: $puzzleIdsJson");
		}
		
		try {
			$dbConn = $this->getPrivilegedDatabaseConnection();
			$dbConn->removePuzzles($puzzleIds);
		} finally {
			$dbConn = Null;
		}
		return new BlankResponse();
	}
}
?>
