<?php
require_once("endpoint/Response.php");


class CsvResponse extends Response {
	
	/**
	 * @param string $jsonData
	 * @param int $status
	 */
	public function __construct($jsonData, $status = Null) {
		parent::__construct($jsonData, static::$CONTENT_TYPE_CSV, $status);
	}
}
?>
