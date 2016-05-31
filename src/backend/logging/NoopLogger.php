<?php
require_once("logging/BaseLogger.php");
require_once("logging/LogLevel.php");


/**
 * Logger implementation which simply discards all logged messages
 */
class NoopLogger extends BaseLogger {
	/**
	 * @param string $name
	 */
	function __construct($name) {
		parent::__construct($name);
	}
	
	function log(LogLevel $level, $msg) {
		// No operation
	}
}
?>
