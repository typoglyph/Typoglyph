<?php
require_once("config/ApplicationConfig.php");
require_once("logging/FileLogger.php");
require_once("logging/FilteredLogger.php");


/**
 * Example usage:
 * <code>
 * class SomeObject {
 *   private static $logger;
 *   
 *   static function initStatic() {
 *     static::$logger = LoggerFactory::getLogger(__CLASS__);
 *   }
 *   
 *   function __construct($arg1, $arg2) {
 *     static::$logger->info("<init>: arg1=$arg1, arg2=$arg2");
 *   }
 *   
 *   function doSomethingUseful() {
 *     static::$logger->info("Doing something useful now");
 *   }
 * }
 * SomeObject::initStatic();
 * </code>
 * 
 * 
 * Manages the creation of logger instances. This class should be the only place where a logger
 * implementation is ever directly instantiated. How loggers are created/cached/managed is
 * completely up to this class.
 */
final class LoggerFactory {
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
		$logConfig = (new ApplicationConfig())->getLoggerConfig();
		$logger = new FileLogger($name, $logConfig->getFilePath());
		$logger = new FilteredLogger($logger, LogLevel::fromName($logConfig->getLevel()));
		return $logger;
	}
}
?>
