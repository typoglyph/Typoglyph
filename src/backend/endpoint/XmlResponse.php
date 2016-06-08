<?php
require_once("endpoint/Response.php");


class XmlResponse extends Response {
	
	/**
	 * @param string $jsonData
	 * @param int $status
	 */
	public function __construct($jsonData, $status = Null) {
		parent::__construct($jsonData, static::$CONTENT_TYPE_XML, $status);
	}
}
?>
