<?php
require_once("logging/Logger.php");
require_once("logging/LogLevel.php");


abstract class BaseLogger implements Logger {
	private $name;
	
	/**
	 * @param string $name
	 */
	function __construct($name) {
		$this->name = $name;
	}
	
	function getName() {
		return $this->name;
	}
	
	function trace($msg) {
		$this->log(LogLevel::$Trace, $msg);
	}
	
	function debug($msg) {
		$this->log(LogLevel::$Debug, $msg);
	}
	
	function info($msg) {
		$this->log(LogLevel::$Info, $msg);
	}
	
	function warn($msg) {
		$this->log(LogLevel::$Warn, $msg);
	}
	
	function error($msg) {
		$this->log(LogLevel::$Error, $msg);
	}
}
?>
