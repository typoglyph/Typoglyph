<?php
/**
 * Enumeration defining the different "levels" which messages can be logged at. The levels can be
 * considered more or less "verbose". For example, error messages are not very verbose and should
 * only be logged in extreme circumstances. Trace messages, however, are extremely verbose and
 * should be logged as often as is useful. Generally, info messages or higher will be logged in a
 * production environment, but debug or even trace messages can be logged for debugging and
 * development purposes.
 */
final class LogLevel {
	static $Trace;
	static $Debug;
	static $Info;
	static $Warn;
	static $Error;
	private static $allLevels;
	
	private $name;
	private $value;
	
	static function initStatic() {
		$t = static::$Trace	= new LogLevel(100, "trace");
		$d = static::$Debug	= new LogLevel(200, "debug");
		$i = static::$Info	= new LogLevel(300, "info");
		$w = static::$Warn	= new LogLevel(400, "warn");
		$e = static::$Error	= new LogLevel(500, "error");
		static::$allLevels = array($t, $d, $i, $w, $e);
	}
	
	/**
	 * @param int $value How verbose this log level is. Smaller values are more verbose.
	 * @param string $name
	 */
	private function __construct($value, $name) {
		$this->name = $name;
		$this->value = $value;
	}
	
	function __toString() {
		return $this->getName();
	}
	
	/**
	 * @return string
	 */
	function getName() {
		return $this->name;
	}
	
	/**
	 * @param string $name
	 * @return LogLevel
	 */
	static function fromName($name) {
		foreach (static::$allLevels as $level) {
			if (strcasecmp($name, $level->getName()) == 0) {
				return $level;
			}
		}
		throw new Exception("No such log level: $name");
	}
	
	/**
	 * @return int a negative integer, zero, or a positive integer as this level is less verbose,
	 *     equal to, or more verbose the specified level
	 */
	function compareTo(LogLevel $other) {
		return $other->value - $this->value;
	}
}
LogLevel::initStatic();
?>
