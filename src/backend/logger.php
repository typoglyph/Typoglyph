<?php
/*
Example usage:

<code>
require_once("logger.php");


class SomeObject {
	private static $logger;
	
	static function initStatic() {
		static::$logger = LoggerFactory::getLogger(__CLASS__);
	}
	
	function __construct($arg1, $arg2) {
		static::$logger->info("<init>: arg1=$arg1, arg2=$arg2");
	}
	
	function doSomethingUseful() {
		static::$logger->info("Doing something useful now");
	}
}
SomeObject::initStatic();
</code>
*/


/**
 * Manages the creation of logger instances. This class should be the only place where a logger
 * implementation is ever directly instantiated. How loggers are created/cached/managed is
 * completely up to this class.
 */
final class LoggerFactory {
	private static $LOG_FILE = "../../php_output.log";
	private static $loggers = array();
	
	/**
	 * Returns a logger implementation with the given name. The name should usually correspond to
	 * the class name where the logger is used.
	 *
	 * @param string $name
	 * @return Logger
	 */
	static function getLogger($name) {
		if (!array_key_exists($name, static::$loggers)) {
			static::$loggers[$name] = static::createLogger($name);
		}
		return static::$loggers[$name];
	}
	
	private static function createLogger($name) {
		$logger = new FileLogger($name, static::$LOG_FILE);
		$logger = new FIlteredLogger($logger, LogLevel::$Trace);
		return $logger;
	}
}


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


/**
 * Logger implementation which appends messages to the end of a specified file
 */
class FileLogger extends BaseLogger {
	private $filePath;
	
	/**
	 * @param string $name
	 * @param string $filePath
	 */
	function __construct($name, $filePath) {
		parent::__construct($name);
		$this->filePath = $filePath;
	}
	
	function log(LogLevel $level, $msg) {
		$msg = "$msg\n";
		$timestamp = date("Y-m-d H:i:s");
		$level = static::strAlignRight(strtoupper($level->getName()), 4);
		$logger = static::strAlignRight($this->getName(), 25);
		
		$message = "$timestamp | $level | $logger | $msg";
		file_put_contents($this->filePath, $message, FILE_APPEND);
	}
	
	/**
	 * Returns a string part of $str which is exactly $len characters long, by either truncating or
	 * left padding with spaces.
	 *
	 * @param string $str
	 * @param int $len
	 */
	private static function strAlignRight($str, $len) {
		$str = str_pad($str, $len, " ", STR_PAD_LEFT);
		$str = substr($str, 0, $len);
		return $str;
	}
}


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
