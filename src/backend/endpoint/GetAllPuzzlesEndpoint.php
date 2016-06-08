<?php
require_once("endpoint/CsvResponse.php");
require_once("endpoint/DatabaseAwareEndpoint.php");
require_once("endpoint/JsonResponse.php");
require_once("endpoint/XmlResponse.php");
require_once("puzzle/CsvPuzzleEncoder.php");
require_once("puzzle/PuzzleEncoder.php");
require_once("puzzle/XmlPuzzleEncoder.php");


class GetAllPuzzlesEndpoint extends DatabaseAwareEndpoint {
	
	/**
	 * @override
	 */
	 public function _handleRequest($req) {
		 $format = $req->getStringParameter("format", False);
		 $format = strtolower($format);
		 $pretty = $req->getBooleanParameter("pretty", False);
		 $pretty = ($pretty === Null) ? False : $pretty;
		 
		 try {
			 $dbConn = $this->getDatabaseConnection();
			 $puzzles = $dbConn->fetchAllPuzzles();
		 } finally {
			 $dbConn = Null;
		 }
		 
		 switch ($format) {
			 case "csv":
				$encoded = CsvPuzzleEncoder::toCsvArray($puzzles);
				return new CsvResponse($encoded);
			case "xml":
				$encoded = XmlPuzzleEncoder::toXmlArray($puzzles, $pretty);
				return new XmlResponse($encoded);
			//case "json":
			default:
				$encoded = PuzzleEncoder::toJsonArray($puzzles, $pretty);
				return new JsonResponse($encoded);
		 }
	 }
}
?>
