<?php
require_once("logging/LogLevel.php");


interface Logger {
	/**
	 * @return string
	 */
	function getName();
	/**
	 * @param mixed $msg
	 */
	function trace($msg);
	/**
	 * @param mixed $msg
	 */
	function debug($msg);
	/**
	 * @param mixed $msg
	 */
	function info($msg);
	/**
	 * @param mixed $msg
	 */
	function warn($msg);
	/**
	 * @param mixed $msg
	 */
	function error($msg);
	/**
	 * @param LogLevel $level
	 * @param mixed $msg
	 */
	function log(LogLevel $level, $msg);
}
?>
