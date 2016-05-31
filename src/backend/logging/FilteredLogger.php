<?php
require_once("logging/BaseLogger.php");
require_once("logging/LogLevel.php");


/**
 * Logger implementation which forwards messages to a delegate logger. Only messages which are less
 * verbose (or equal to) the specified threshold will be forwarded to the delegate.
 *
 * This logger will have the same name as the specified delegate.
 */
class FilteredLogger extends BaseLogger {
	private $delegate;
	private $threshold;
	
	/**
	 * @param Logger $delegate
	 * @param LogLevel $threshold
	 */
	function __construct(Logger $delegate, LogLevel $threshold) {
		parent::__construct($delegate->getName());
		$this->delegate = $delegate;
		$this->threshold = $threshold;
	}
	
	function getName() {
		return $this->delegate->getName();
	}
	
	function log(LogLevel $level, $msg) {
		if ($level->compareTo($this->threshold) <= 0) {
			// $level is less verbose than (or equal to) $threshold
			$this->delegate->log($level, $msg);
		}
	}
}
?>
