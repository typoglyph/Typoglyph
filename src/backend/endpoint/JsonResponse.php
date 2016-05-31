<?php
require_once("endpoint/Response.php");


class JsonResponse extends Response {
	
	/**
	 * @param string $jsonData
	 * @param int $status
	 */
	public function __construct($jsonData, $status = Null) {
		parent::__construct($jsonData, static::$CONTENT_TYPE_JSON, $status);
	}
}
?>
