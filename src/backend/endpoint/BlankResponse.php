<?php
require_once("endpoint/Response.php");


class BlankResponse extends Response {
	
	/**
	 * @override
	 */
	public function send() {
		exit($this->status);
	}
	
	/**
	 * @param int $status
	 */
	public function __construct($status = Null) {
		parent::__construct("", static::$CONTENT_TYPE_TEXT, $status);
	}
}
?>
